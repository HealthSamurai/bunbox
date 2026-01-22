/**
 * FHIR History operations
 */

import { sql, toTableName, ensureTable } from "../db";

// HISTORY - GET /:type/:id/_history
export async function instanceHistory(
  tenantId: string,
  resourceType: string,
  id: string
): Promise<{ status: number; body: any }> {
  await ensureTable(resourceType);
  const tableName = toTableName(resourceType);

  // Get current version
  const current = await sql.unsafe(
    `SELECT resource, version_id FROM ${tableName}
     WHERE tenant_id = $1 AND id = $2`,
    [tenantId, id]
  );

  // Get historical versions
  const history = await sql.unsafe(
    `SELECT resource, version_id FROM ${tableName}_history
     WHERE tenant_id = $1 AND id = $2
     ORDER BY version_id DESC`,
    [tenantId, id]
  );

  // Combine current and history
  const entries: any[] = [];

  if (current.length > 0) {
    entries.push({
      resource: current[0].resource,
      fullUrl: `${resourceType}/${id}`,
      request: {
        method: "GET",
        url: `${resourceType}/${id}`,
      },
      response: {
        status: "200",
        etag: `W/"${current[0].version_id}"`,
      },
    });
  }

  for (const row of history) {
    entries.push({
      resource: row.resource,
      fullUrl: `${resourceType}/${id}/_history/${row.version_id}`,
      request: {
        method: "GET",
        url: `${resourceType}/${id}/_history/${row.version_id}`,
      },
      response: {
        status: "200",
        etag: `W/"${row.version_id}"`,
      },
    });
  }

  const bundle = {
    resourceType: "Bundle",
    type: "history",
    total: entries.length,
    entry: entries,
  };

  return { status: 200, body: bundle };
}

// VREAD - GET /:type/:id/_history/:vid
export async function vread(
  tenantId: string,
  resourceType: string,
  id: string,
  versionId: string
): Promise<{ status: number; body: any }> {
  await ensureTable(resourceType);
  const tableName = toTableName(resourceType);

  // Check current version first
  const current = await sql.unsafe(
    `SELECT resource FROM ${tableName}
     WHERE tenant_id = $1 AND id = $2 AND version_id = $3`,
    [tenantId, id, versionId]
  );

  if (current.length > 0) {
    return { status: 200, body: current[0].resource };
  }

  // Check history
  const history = await sql.unsafe(
    `SELECT resource FROM ${tableName}_history
     WHERE tenant_id = $1 AND id = $2 AND version_id = $3`,
    [tenantId, id, versionId]
  );

  if (history.length > 0) {
    return { status: 200, body: history[0].resource };
  }

  return {
    status: 404,
    body: {
      resourceType: "OperationOutcome",
      issue: [
        {
          severity: "error",
          code: "not-found",
          diagnostics: `${resourceType}/${id}/_history/${versionId} not found`,
        },
      ],
    },
  };
}

// TYPE HISTORY - GET /:type/_history
export async function typeHistory(
  tenantId: string,
  resourceType: string,
  params: URLSearchParams
): Promise<{ status: number; body: any }> {
  await ensureTable(resourceType);
  const tableName = toTableName(resourceType);

  const _count = parseInt(params.get("_count") || "100", 10);

  // Get recent versions from both tables
  const result = await sql.unsafe(
    `(SELECT resource, version_id, 'current' as source FROM ${tableName}
      WHERE tenant_id = $1)
     UNION ALL
     (SELECT resource, version_id, 'history' as source FROM ${tableName}_history
      WHERE tenant_id = $1)
     ORDER BY version_id DESC
     LIMIT $2`,
    [tenantId, _count]
  );

  const entries = result.map((row: any) => ({
    resource: row.resource,
    fullUrl: `${resourceType}/${row.resource.id}`,
    request: {
      method: "GET",
      url: `${resourceType}/${row.resource.id}`,
    },
    response: {
      status: "200",
      etag: `W/"${row.version_id}"`,
    },
  }));

  const bundle = {
    resourceType: "Bundle",
    type: "history",
    total: entries.length,
    entry: entries,
  };

  return { status: 200, body: bundle };
}
