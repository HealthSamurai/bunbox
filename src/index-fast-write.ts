/**
 * Optimized FHIR Server - Hardcoded Patient write for benchmarking
 */

import { SQL } from "bun";

const sql = new SQL({
  url: "postgres://postgres:postgres@localhost:54321/bunbox",
  max: 100,
  idleTimeout: 30,
  maxLifetime: 3600,
  connectionTimeout: 10,
});

const DEFAULT_TENANT = "00000000-0000-0000-0000-000000000000";

// Fast UUIDv7
function uuidv7(): string {
  const timestamp = Date.now();
  const hex = timestamp.toString(16).padStart(12, "0");
  const rand = crypto.getRandomValues(new Uint8Array(10));
  const r = Array.from(rand).map(b => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-7${r.slice(0,3)}-${((parseInt(r[3],16)&0x3)|0x8).toString(16)}${r.slice(4,7)}-${r.slice(7,19)}`;
}

Bun.serve({
  port: 3000,

  async fetch(req: Request): Promise<Response> {
    // Fast path - POST /Patient
    if (req.method === "POST" && req.url.includes("/Patient")) {
      const body = await req.json();

      const id = uuidv7();
      const versionId = uuidv7();

      body.id = id;
      body.resourceType = "Patient";
      body.meta = { versionId, lastUpdated: new Date().toISOString() };

      await sql`
        INSERT INTO patient (tenant_id, id, version_id, resource)
        VALUES (${DEFAULT_TENANT}::uuid, ${id}::uuid, ${versionId}::uuid, ${body})
      `;

      return new Response(JSON.stringify(body), {
        status: 201,
        headers: { "Content-Type": "application/fhir+json" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log("Fast Write Server on http://localhost:3000");
