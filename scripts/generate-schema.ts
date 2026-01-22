#!/usr/bin/env bun
/**
 * Generate PostgreSQL schema for FHIR R4 resources
 * Reads StructureDefinitions from ndjson.gz and creates table definitions
 */

import { gunzipSync } from "zlib";

const NDJSON_PATH = process.argv[2] || "config.ndjson.gz";
const OUTPUT_PATH = process.argv[3] || "schema.sql";

interface StructureDefinition {
  resourceType: string;
  id: string;
  kind: string;
  type: string;
  derivation?: string;
  snapshot?: {
    element: Array<{
      path: string;
      type?: Array<{
        code: string;
        targetProfile?: string[];
      }>;
    }>;
  };
}

async function loadStructureDefinitions(
  path: string
): Promise<StructureDefinition[]> {
  const file = Bun.file(path);
  const buffer = await file.arrayBuffer();
  const decompressed = gunzipSync(Buffer.from(buffer));
  const lines = decompressed.toString("utf-8").trim().split("\n");

  return lines
    .map((line) => JSON.parse(line) as StructureDefinition)
    .filter(
      (r) =>
        r.resourceType === "StructureDefinition" &&
        r.kind === "resource" &&
        r.derivation === "specialization"
    );
}

function isPatientRelated(sd: StructureDefinition): boolean {
  if (!sd.snapshot?.element) return false;
  const resourceType = sd.type;

  for (const element of sd.snapshot.element) {
    // Check for subject or patient element at root level
    if (
      element.path === `${resourceType}.subject` ||
      element.path === `${resourceType}.patient`
    ) {
      // Check if it references Patient
      if (element.type) {
        for (const t of element.type) {
          if (t.code === "Reference" && t.targetProfile) {
            for (const profile of t.targetProfile) {
              if (profile.includes("Patient")) {
                return true;
              }
            }
          }
        }
      }
    }
  }
  return false;
}

function toSnakeCase(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

function generateTableSQL(
  resourceType: string,
  hasPatientId: boolean
): string {
  const tableName = toSnakeCase(resourceType);
  const patientIdColumn = hasPatientId
    ? "\n  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries"
    : "";
  const patientIdIndex = hasPatientId
    ? `\nCREATE INDEX ${tableName}_patient_idx ON ${tableName}(tenant_id, patient_id);`
    : "";

  return `-- ${resourceType}
CREATE TABLE ${tableName} (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,${patientIdColumn}
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX ${tableName}_gin_idx ON ${tableName} USING GIN(resource jsonb_path_ops);${patientIdIndex}

CREATE TABLE ${tableName}_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,${patientIdColumn}
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);
`;
}

async function main() {
  console.log(`Loading StructureDefinitions from ${NDJSON_PATH}...`);
  const definitions = await loadStructureDefinitions(NDJSON_PATH);
  console.log(`Found ${definitions.length} resource definitions`);

  const patientRelated: string[] = [];
  const nonPatientRelated: string[] = [];

  for (const sd of definitions) {
    if (isPatientRelated(sd)) {
      patientRelated.push(sd.type);
    } else {
      nonPatientRelated.push(sd.type);
    }
  }

  console.log(`Patient-related resources: ${patientRelated.length}`);
  console.log(`Non-patient-related resources: ${nonPatientRelated.length}`);

  const sqlParts: string[] = [
    `-- FHIR R4 PostgreSQL Schema`,
    `-- Generated from StructureDefinitions`,
    `-- Generated at: ${new Date().toISOString()}`,
    ``,
    `-- Patient-related resources (${patientRelated.length} tables)`,
    `-- These have a patient_id column for efficient patient-scoped queries`,
    ``,
  ];

  // Sort for consistent output
  patientRelated.sort();
  nonPatientRelated.sort();

  for (const rt of patientRelated) {
    sqlParts.push(generateTableSQL(rt, true));
  }

  sqlParts.push(`-- Non-patient-related resources (${nonPatientRelated.length} tables)`);
  sqlParts.push(``);

  for (const rt of nonPatientRelated) {
    sqlParts.push(generateTableSQL(rt, false));
  }

  const sql = sqlParts.join("\n");
  await Bun.write(OUTPUT_PATH, sql);
  console.log(`Schema written to ${OUTPUT_PATH}`);

  // Print summary
  console.log("\nPatient-related resources:");
  console.log(patientRelated.join(", "));
  console.log("\nNon-patient-related resources:");
  console.log(nonPatientRelated.join(", "));
}

main().catch(console.error);
