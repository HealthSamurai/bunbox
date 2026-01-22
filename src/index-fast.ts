/**
 * Optimized FHIR Server - Hardcoded Patient read for benchmarking
 */

import { SQL } from "bun";

const sql = new SQL({
  url: "postgres://postgres:postgres@localhost:54321/bunbox",
  max: 100,  // Increased pool
  idleTimeout: 30,
  maxLifetime: 3600,
  connectionTimeout: 10,
});

const DEFAULT_TENANT = "00000000-0000-0000-0000-000000000000";

// Pre-compile the query (prepared statement)
const readPatientQuery = sql`
  SELECT resource FROM patient WHERE tenant_id = ${DEFAULT_TENANT}::uuid AND id = ${""}::uuid
`;

Bun.serve({
  port: 3000,

  async fetch(req: Request): Promise<Response> {
    const url = req.url;

    // Fast path check - hardcoded for /Patient/:id
    const patientMatch = url.indexOf("/Patient/");
    if (patientMatch !== -1 && req.method === "GET") {
      // Extract ID directly (after /Patient/ which is 9 chars)
      const start = patientMatch + 9;
      const end = url.indexOf("?", start);
      const id = end === -1 ? url.slice(start) : url.slice(start, end);

      // Direct query - no overhead
      const result = await sql`
        SELECT resource FROM patient
        WHERE tenant_id = ${DEFAULT_TENANT}::uuid AND id = ${id}::uuid
      `;

      if (result.length === 0) {
        return new Response('{"resourceType":"OperationOutcome","issue":[{"severity":"error","code":"not-found"}]}', {
          status: 404,
          headers: { "Content-Type": "application/fhir+json" },
        });
      }

      // No pretty-print, direct JSON
      return new Response(JSON.stringify(result[0].resource), {
        status: 200,
        headers: { "Content-Type": "application/fhir+json" },
      });
    }

    // Fallback
    return new Response("Not found", { status: 404 });
  },
});

console.log("Fast FHIR Server on http://localhost:3000");
