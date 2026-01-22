/**
 * Database connection and utilities using Bun.sql
 */

import { SQL } from "bun";

// Database connection with pool configuration
export const sql = new SQL({
  url:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:54321/bunbox",
  max: 100,             // Maximum 100 concurrent connections
  idleTimeout: 30,      // Close idle connections after 30s
  maxLifetime: 3600,    // Max connection lifetime 1 hour
  connectionTimeout: 10, // Connection timeout 10s
});

// UUIDv7 generation (timestamp-based, sortable)
export function uuidv7(): string {
  const timestamp = Date.now();
  const timestampHex = timestamp.toString(16).padStart(12, "0");

  // Random bits for uniqueness
  const randomBits = crypto.getRandomValues(new Uint8Array(10));
  const randomHex = Array.from(randomBits)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Format: xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx
  // Where 7 indicates version 7, and y is 8, 9, a, or b (variant bits)
  const uuid =
    timestampHex.slice(0, 8) +
    "-" +
    timestampHex.slice(8, 12) +
    "-7" +
    randomHex.slice(0, 3) +
    "-" +
    ((parseInt(randomHex.slice(3, 4), 16) & 0x3) | 0x8).toString(16) +
    randomHex.slice(4, 7) +
    "-" +
    randomHex.slice(7, 19);

  return uuid;
}

// Extract timestamp from UUIDv7 (for _lastUpdated)
export function extractTimestamp(uuid: string): Date {
  const hex = uuid.replace(/-/g, "").slice(0, 12);
  const timestamp = parseInt(hex, 16);
  return new Date(timestamp);
}

// Convert resource type to snake_case table name
export function toTableName(resourceType: string): string {
  return resourceType
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

// Patient-related resource types (have patient_id column)
// Generated from StructureDefinitions
export const PATIENT_RELATED_RESOURCES = new Set([
  "Account",
  "AdverseEvent",
  "AllergyIntolerance",
  "BodyStructure",
  "CarePlan",
  "CareTeam",
  "ChargeItem",
  "Claim",
  "ClaimResponse",
  "ClinicalImpression",
  "Communication",
  "CommunicationRequest",
  "Condition",
  "Consent",
  "CoverageEligibilityRequest",
  "CoverageEligibilityResponse",
  "DetectedIssue",
  "Device",
  "DeviceRequest",
  "DeviceUseStatement",
  "DiagnosticReport",
  "DocumentManifest",
  "DocumentReference",
  "Encounter",
  "EpisodeOfCare",
  "ExplanationOfBenefit",
  "FamilyMemberHistory",
  "Flag",
  "Goal",
  "GuidanceResponse",
  "ImagingStudy",
  "Immunization",
  "ImmunizationEvaluation",
  "ImmunizationRecommendation",
  "Invoice",
  "List",
  "MeasureReport",
  "Media",
  "MedicationAdministration",
  "MedicationDispense",
  "MedicationRequest",
  "MedicationStatement",
  "MolecularSequence",
  "NutritionOrder",
  "Observation",
  "Procedure",
  "RelatedPerson",
  "RequestGroup",
  "RiskAssessment",
  "ServiceRequest",
  "Specimen",
  "SupplyDelivery",
  "VisionPrescription",
]);

export function isPatientRelated(resourceType: string): boolean {
  return PATIENT_RELATED_RESOURCES.has(resourceType);
}

// Extract patient ID from resource (subject or patient reference)
export function extractPatientId(resource: any): string | null {
  // Check subject.reference
  if (resource.subject?.reference) {
    const match = resource.subject.reference.match(/Patient\/([^/]+)/);
    if (match) return match[1];
  }
  // Check patient.reference
  if (resource.patient?.reference) {
    const match = resource.patient.reference.match(/Patient\/([^/]+)/);
    if (match) return match[1];
  }
  return null;
}

// Ensure table exists (dynamic table creation)
const createdTables = new Set<string>();

export async function ensureTable(resourceType: string): Promise<void> {
  const tableName = toTableName(resourceType);
  if (createdTables.has(tableName)) return;

  const hasPatientId = isPatientRelated(resourceType);
  const patientIdColumn = hasPatientId ? "patient_id UUID," : "";
  const patientIdHistory = hasPatientId ? "patient_id UUID," : "";

  // Create main table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      tenant_id UUID NOT NULL,
      id UUID NOT NULL,
      version_id UUID NOT NULL,
      ${patientIdColumn}
      resource JSONB NOT NULL,
      PRIMARY KEY (tenant_id, id)
    )
  `);

  // Create GIN index
  await sql.unsafe(`
    CREATE INDEX IF NOT EXISTS ${tableName}_gin_idx
    ON ${tableName} USING GIN(resource jsonb_path_ops)
  `);

  // Create patient index if needed
  if (hasPatientId) {
    await sql.unsafe(`
      CREATE INDEX IF NOT EXISTS ${tableName}_patient_idx
      ON ${tableName}(tenant_id, patient_id)
    `);
  }

  // Create history table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS ${tableName}_history (
      tenant_id UUID NOT NULL,
      id UUID NOT NULL,
      version_id UUID NOT NULL,
      ${patientIdHistory}
      resource JSONB NOT NULL,
      PRIMARY KEY (tenant_id, id, version_id)
    )
  `);

  createdTables.add(tableName);
}
