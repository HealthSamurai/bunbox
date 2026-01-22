/**
 * FHIR R4 Server - Entry point
 * Using Bun.serve with routes
 */

import { create, read, update, remove, search, setValidationEnabled, validationEnabled } from "./fhir/crud";
import { instanceHistory, vread, typeHistory } from "./fhir/history";

const PORT = parseInt(process.env.PORT || "3000", 10);
const DEFAULT_TENANT = "00000000-0000-0000-0000-000000000000";

// Extract tenant ID from request (header or default)
function getTenantId(req: Request): string {
  return req.headers.get("X-Tenant-ID") || DEFAULT_TENANT;
}

// JSON response helper
function jsonResponse(status: number, body: any, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/fhir+json",
      ...headers,
    },
  });
}

// Capability Statement (minimal)
const capabilityStatement = {
  resourceType: "CapabilityStatement",
  status: "active",
  date: new Date().toISOString(),
  kind: "instance",
  fhirVersion: "4.0.1",
  format: ["json"],
  rest: [
    {
      mode: "server",
      resource: [
        {
          type: "Patient",
          interaction: [
            { code: "read" },
            { code: "vread" },
            { code: "update" },
            { code: "delete" },
            { code: "history-instance" },
            { code: "history-type" },
            { code: "create" },
            { code: "search-type" },
          ],
        },
      ],
    },
  ],
};

// Parse path segments
function parsePath(pathname: string): { type?: string; id?: string; operation?: string; versionId?: string } {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return {};
  if (segments.length === 1) {
    if (segments[0] === "metadata") return { operation: "metadata" };
    return { type: segments[0] };
  }
  if (segments.length === 2) {
    if (segments[1] === "_history") return { type: segments[0], operation: "type-history" };
    return { type: segments[0], id: segments[1] };
  }
  if (segments.length === 3 && segments[2] === "_history") {
    return { type: segments[0], id: segments[1], operation: "history" };
  }
  if (segments.length === 4 && segments[2] === "_history") {
    return { type: segments[0], id: segments[1], operation: "vread", versionId: segments[3] };
  }

  return {};
}

const server = Bun.serve({
  port: PORT,

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;
    const path = parsePath(url.pathname);
    const tenantId = getTenantId(req);

    try {
      // GET /metadata
      if (path.operation === "metadata" && method === "GET") {
        return jsonResponse(200, capabilityStatement);
      }

      // POST /$toggle-validation - toggle validation on/off
      if (url.pathname === "/$toggle-validation" && method === "POST") {
        const body = await req.json();
        const enabled = body.enabled !== false;
        setValidationEnabled(enabled);
        return jsonResponse(200, { validation: enabled ? "enabled" : "disabled" });
      }

      // GET /$validation-status - check validation status
      if (url.pathname === "/$validation-status" && method === "GET") {
        return jsonResponse(200, { validation: validationEnabled ? "enabled" : "disabled" });
      }

      // No resource type specified
      if (!path.type) {
        return jsonResponse(400, {
          resourceType: "OperationOutcome",
          issue: [{ severity: "error", code: "invalid", diagnostics: "Invalid request path" }],
        });
      }

      const resourceType = path.type;

      // GET /:type/_history
      if (path.operation === "type-history" && method === "GET") {
        const result = await typeHistory(tenantId, resourceType, url.searchParams);
        return jsonResponse(result.status, result.body);
      }

      // GET /:type/:id/_history/:vid (vread)
      if (path.operation === "vread" && path.id && path.versionId && method === "GET") {
        const result = await vread(tenantId, resourceType, path.id, path.versionId);
        return jsonResponse(result.status, result.body);
      }

      // GET /:type/:id/_history
      if (path.operation === "history" && path.id && method === "GET") {
        const result = await instanceHistory(tenantId, resourceType, path.id);
        return jsonResponse(result.status, result.body);
      }

      // GET /:type/:id (read)
      if (path.id && method === "GET") {
        const result = await read(tenantId, resourceType, path.id);
        return jsonResponse(result.status, result.body, {
          ETag: `W/"${(result.body as any).meta?.versionId || ""}"`,
        });
      }

      // GET /:type (search)
      if (!path.id && method === "GET") {
        const result = await search(tenantId, resourceType, url.searchParams);
        return jsonResponse(result.status, result.body);
      }

      // POST /:type (create)
      if (!path.id && method === "POST") {
        const body = await req.json();
        const result = await create(tenantId, resourceType, body);
        return jsonResponse(result.status, result.body, {
          Location: `/${resourceType}/${(result.body as any).id}`,
          ETag: `W/"${(result.body as any).meta?.versionId || ""}"`,
        });
      }

      // PUT /:type/:id (update)
      if (path.id && method === "PUT") {
        const body = await req.json();
        const result = await update(tenantId, resourceType, path.id, body);
        return jsonResponse(result.status, result.body, {
          ETag: `W/"${(result.body as any).meta?.versionId || ""}"`,
        });
      }

      // DELETE /:type/:id (delete)
      if (path.id && method === "DELETE") {
        const result = await remove(tenantId, resourceType, path.id);
        if (result.status === 204) {
          return new Response(null, { status: 204 });
        }
        return jsonResponse(result.status, result.body);
      }

      // Method not allowed
      return jsonResponse(405, {
        resourceType: "OperationOutcome",
        issue: [{ severity: "error", code: "not-supported", diagnostics: `Method ${method} not supported` }],
      });
    } catch (error: any) {
      console.error("Error:", error);
      return jsonResponse(500, {
        resourceType: "OperationOutcome",
        issue: [{ severity: "fatal", code: "exception", diagnostics: error.message }],
      });
    }
  },
});

console.log(`FHIR R4 Server running on http://localhost:${PORT}`);
console.log(`  GET  /metadata           - Capability Statement`);
console.log(`  GET  /:type              - Search`);
console.log(`  GET  /:type/:id          - Read`);
console.log(`  GET  /:type/:id/_history - History`);
console.log(`  POST /:type              - Create`);
console.log(`  PUT  /:type/:id          - Update`);
console.log(`  DELETE /:type/:id        - Delete`);
