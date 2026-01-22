/**
 * FHIR CRUD operations
 */

import {
  sql,
  uuidv7,
  toTableName,
  isPatientRelated,
  extractPatientId,
  ensureTable,
  extractTimestamp,
} from "../db";
import { validatePatient } from "./validate-patient-fast";

export interface FhirResource {
  resourceType: string;
  id?: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
  };
  [key: string]: any;
}

export interface OperationOutcome {
  resourceType: "OperationOutcome";
  issue: Array<{
    severity: "fatal" | "error" | "warning" | "information";
    code: string;
    diagnostics?: string;
  }>;
}

function operationOutcome(
  severity: "fatal" | "error" | "warning" | "information",
  code: string,
  diagnostics: string
): OperationOutcome {
  return {
    resourceType: "OperationOutcome",
    issue: [{ severity, code, diagnostics }],
  };
}

// Validation enabled flag (can be toggled for performance comparison)
export let validationEnabled = true;

export function setValidationEnabled(enabled: boolean): void {
  validationEnabled = enabled;
}

// CREATE - POST /:type
export async function create(
  tenantId: string,
  resourceType: string,
  resource: FhirResource
): Promise<{ status: number; body: FhirResource | OperationOutcome }> {
  // Validate Patient resources if validation is enabled
  if (validationEnabled && resourceType === "Patient") {
    const validationResult = validatePatient(resource);
    if (!validationResult.valid) {
      return {
        status: 400,
        body: {
          resourceType: "OperationOutcome",
          issue: validationResult.errors
            .filter(e => e.severity === "error")
            .map(e => ({
              severity: "error" as const,
              code: "invalid",
              diagnostics: `${e.path}: ${e.message}`,
            })),
        },
      };
    }
  }

  await ensureTable(resourceType);
  const tableName = toTableName(resourceType);

  const id = uuidv7();
  const versionId = uuidv7();

  // Set meta
  resource.id = id;
  resource.resourceType = resourceType;
  resource.meta = {
    versionId,
    lastUpdated: extractTimestamp(versionId).toISOString(),
  };

  const hasPatientId = isPatientRelated(resourceType);
  let patientId: string | null = null;

  if (hasPatientId) {
    patientId = extractPatientId(resource);
    if (!patientId) {
      return {
        status: 400,
        body: operationOutcome(
          "error",
          "required",
          `Patient reference is required for ${resourceType}`
        ),
      };
    }
  }

  if (hasPatientId) {
    await sql.unsafe(
      `INSERT INTO ${tableName} (tenant_id, id, version_id, patient_id, resource)
       VALUES ($1, $2, $3, $4, $5)`,
      [tenantId, id, versionId, patientId, resource]
    );
  } else {
    await sql.unsafe(
      `INSERT INTO ${tableName} (tenant_id, id, version_id, resource)
       VALUES ($1, $2, $3, $4)`,
      [tenantId, id, versionId, resource]
    );
  }

  return { status: 201, body: resource };
}

// READ - GET /:type/:id
export async function read(
  tenantId: string,
  resourceType: string,
  id: string
): Promise<{ status: number; body: FhirResource | OperationOutcome }> {
  await ensureTable(resourceType);
  const tableName = toTableName(resourceType);

  const result = await sql.unsafe(
    `SELECT resource FROM ${tableName} WHERE tenant_id = $1 AND id = $2`,
    [tenantId, id]
  );

  if (result.length === 0) {
    return {
      status: 404,
      body: operationOutcome(
        "error",
        "not-found",
        `${resourceType}/${id} not found`
      ),
    };
  }

  return { status: 200, body: result[0].resource as FhirResource };
}

// UPDATE - PUT /:type/:id
export async function update(
  tenantId: string,
  resourceType: string,
  id: string,
  resource: FhirResource
): Promise<{ status: number; body: FhirResource | OperationOutcome }> {
  await ensureTable(resourceType);
  const tableName = toTableName(resourceType);

  // Check if resource exists
  const existing = await sql.unsafe(
    `SELECT version_id, resource FROM ${tableName} WHERE tenant_id = $1 AND id = $2`,
    [tenantId, id]
  );

  const hasPatientId = isPatientRelated(resourceType);
  let patientId: string | null = null;

  if (hasPatientId) {
    patientId = extractPatientId(resource);
    if (!patientId) {
      return {
        status: 400,
        body: operationOutcome(
          "error",
          "required",
          `Patient reference is required for ${resourceType}`
        ),
      };
    }
  }

  const newVersionId = uuidv7();
  resource.id = id;
  resource.resourceType = resourceType;
  resource.meta = {
    versionId: newVersionId,
    lastUpdated: extractTimestamp(newVersionId).toISOString(),
  };

  if (existing.length === 0) {
    // Create new resource (upsert behavior for PUT)
    if (hasPatientId) {
      await sql.unsafe(
        `INSERT INTO ${tableName} (tenant_id, id, version_id, patient_id, resource)
         VALUES ($1, $2, $3, $4, $5)`,
        [tenantId, id, newVersionId, patientId, resource]
      );
    } else {
      await sql.unsafe(
        `INSERT INTO ${tableName} (tenant_id, id, version_id, resource)
         VALUES ($1, $2, $3, $4)`,
        [tenantId, id, newVersionId, resource]
      );
    }
    return { status: 201, body: resource };
  }

  // Copy old version to history
  const oldVersionId = existing[0].version_id;
  const oldResource = existing[0].resource;
  const oldPatientId = hasPatientId ? extractPatientId(oldResource) : null;

  if (hasPatientId) {
    await sql.unsafe(
      `INSERT INTO ${tableName}_history (tenant_id, id, version_id, patient_id, resource)
       VALUES ($1, $2, $3, $4, $5)`,
      [tenantId, id, oldVersionId, oldPatientId, oldResource]
    );
  } else {
    await sql.unsafe(
      `INSERT INTO ${tableName}_history (tenant_id, id, version_id, resource)
       VALUES ($1, $2, $3, $4)`,
      [tenantId, id, oldVersionId, oldResource]
    );
  }

  // Update main table
  if (hasPatientId) {
    await sql.unsafe(
      `UPDATE ${tableName}
       SET version_id = $1, patient_id = $2, resource = $3
       WHERE tenant_id = $4 AND id = $5`,
      [newVersionId, patientId, resource, tenantId, id]
    );
  } else {
    await sql.unsafe(
      `UPDATE ${tableName}
       SET version_id = $1, resource = $2
       WHERE tenant_id = $3 AND id = $4`,
      [newVersionId, resource, tenantId, id]
    );
  }

  return { status: 200, body: resource };
}

// DELETE - DELETE /:type/:id
export async function remove(
  tenantId: string,
  resourceType: string,
  id: string
): Promise<{ status: number; body?: OperationOutcome }> {
  await ensureTable(resourceType);
  const tableName = toTableName(resourceType);
  const hasPatientId = isPatientRelated(resourceType);

  // Get existing resource to copy to history
  const existing = await sql.unsafe(
    `SELECT version_id, resource FROM ${tableName} WHERE tenant_id = $1 AND id = $2`,
    [tenantId, id]
  );

  if (existing.length === 0) {
    return {
      status: 404,
      body: operationOutcome(
        "error",
        "not-found",
        `${resourceType}/${id} not found`
      ),
    };
  }

  // Copy to history before delete
  const oldVersionId = existing[0].version_id;
  const oldResource = existing[0].resource;
  const oldPatientId = hasPatientId ? extractPatientId(oldResource) : null;

  if (hasPatientId) {
    await sql.unsafe(
      `INSERT INTO ${tableName}_history (tenant_id, id, version_id, patient_id, resource)
       VALUES ($1, $2, $3, $4, $5)`,
      [tenantId, id, oldVersionId, oldPatientId, oldResource]
    );
  } else {
    await sql.unsafe(
      `INSERT INTO ${tableName}_history (tenant_id, id, version_id, resource)
       VALUES ($1, $2, $3, $4)`,
      [tenantId, id, oldVersionId, oldResource]
    );
  }

  // Delete from main table
  await sql.unsafe(
    `DELETE FROM ${tableName} WHERE tenant_id = $1 AND id = $2`,
    [tenantId, id]
  );

  return { status: 204 };
}

// SEARCH - GET /:type (basic implementation)
export async function search(
  tenantId: string,
  resourceType: string,
  params: URLSearchParams
): Promise<{ status: number; body: any }> {
  await ensureTable(resourceType);
  const tableName = toTableName(resourceType);

  // Basic search - just return all resources for now
  // TODO: Implement proper search parameter handling
  const _count = parseInt(params.get("_count") || "100", 10);
  const _offset = parseInt(params.get("_offset") || "0", 10);

  let query = `SELECT resource FROM ${tableName} WHERE tenant_id = $1`;
  const queryParams: any[] = [tenantId];

  // Handle _id parameter
  const idParam = params.get("_id");
  if (idParam) {
    queryParams.push(idParam);
    query += ` AND id = $${queryParams.length}`;
  }

  // Handle patient parameter for patient-related resources
  if (isPatientRelated(resourceType)) {
    const patientParam =
      params.get("patient") || params.get("subject");
    if (patientParam) {
      // Extract ID from reference if needed (Patient/123 -> 123)
      const patientId = patientParam.replace(/^Patient\//, "");
      queryParams.push(patientId);
      query += ` AND patient_id = $${queryParams.length}`;
    }
  }

  query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(_count, _offset);

  const result = await sql.unsafe(query, queryParams);

  // Build Bundle response
  const bundle = {
    resourceType: "Bundle",
    type: "searchset",
    total: result.length,
    entry: result.map((row: any) => ({
      resource: row.resource,
      fullUrl: `${resourceType}/${row.resource.id}`,
    })),
  };

  return { status: 200, body: bundle };
}
