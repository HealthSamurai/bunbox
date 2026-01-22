/**
 * FHIR CRUD Acceptance Tests
 */

import { test, expect, beforeAll, afterAll, describe } from "bun:test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const TENANT_ID = "11111111-1111-1111-1111-111111111111";

async function fhirFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/fhir+json",
      "X-Tenant-ID": TENANT_ID,
      ...options.headers,
    },
  });
}

async function fhirJson(path: string, options: RequestInit = {}): Promise<any> {
  const res = await fhirFetch(path, options);
  if (res.status === 204) return null;
  return res.json();
}

describe("FHIR Server", () => {
  describe("Metadata", () => {
    test("GET /metadata returns CapabilityStatement", async () => {
      const res = await fhirFetch("/metadata");
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("application/fhir+json");

      const body = await res.json();
      expect(body.resourceType).toBe("CapabilityStatement");
      expect(body.fhirVersion).toBe("4.0.1");
      expect(body.status).toBe("active");
    });
  });

  describe("Patient CRUD", () => {
    let patientId: string;
    let versionId: string;

    test("POST /Patient creates a new patient", async () => {
      const patient = {
        resourceType: "Patient",
        name: [{ family: "TestFamily", given: ["TestGiven"] }],
        birthDate: "1980-01-01",
      };

      const res = await fhirFetch("/Patient", {
        method: "POST",
        body: JSON.stringify(patient),
      });

      expect(res.status).toBe(201);
      expect(res.headers.get("location")).toMatch(/^\/Patient\/.+/);
      expect(res.headers.get("etag")).toMatch(/^W\/".+"$/);

      const body = await res.json();
      expect(body.resourceType).toBe("Patient");
      expect(body.id).toBeDefined();
      expect(body.meta.versionId).toBeDefined();
      expect(body.meta.lastUpdated).toBeDefined();
      expect(body.name[0].family).toBe("TestFamily");

      patientId = body.id;
      versionId = body.meta.versionId;
    });

    test("GET /Patient/:id reads the patient", async () => {
      const res = await fhirFetch(`/Patient/${patientId}`);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.resourceType).toBe("Patient");
      expect(body.id).toBe(patientId);
      expect(body.name[0].family).toBe("TestFamily");
    });

    test("GET /Patient/:id returns 404 for non-existent patient", async () => {
      const res = await fhirFetch("/Patient/00000000-0000-0000-0000-000000000000");
      expect(res.status).toBe(404);

      const body = await res.json();
      expect(body.resourceType).toBe("OperationOutcome");
      expect(body.issue[0].code).toBe("not-found");
    });

    test("PUT /Patient/:id updates the patient", async () => {
      const updatedPatient = {
        resourceType: "Patient",
        name: [{ family: "UpdatedFamily", given: ["UpdatedGiven"] }],
        birthDate: "1980-01-01",
        gender: "male",
      };

      const res = await fhirFetch(`/Patient/${patientId}`, {
        method: "PUT",
        body: JSON.stringify(updatedPatient),
      });

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.id).toBe(patientId);
      expect(body.name[0].family).toBe("UpdatedFamily");
      expect(body.gender).toBe("male");
      expect(body.meta.versionId).not.toBe(versionId);

      versionId = body.meta.versionId;
    });

    test("PUT /Patient/:id creates if not exists (upsert)", async () => {
      const newId = "aaaaaaaa-bbbb-cccc-dddd-" + Date.now().toString(16).padStart(12, "0");
      const patient = {
        resourceType: "Patient",
        name: [{ family: "UpsertFamily" }],
      };

      const res = await fhirFetch(`/Patient/${newId}`, {
        method: "PUT",
        body: JSON.stringify(patient),
      });

      expect(res.status).toBe(201);

      const body = await res.json();
      expect(body.id).toBe(newId);

      // Clean up
      await fhirFetch(`/Patient/${newId}`, { method: "DELETE" });
    });

    test("GET /Patient/:id/_history returns history bundle", async () => {
      const res = await fhirFetch(`/Patient/${patientId}/_history`);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.resourceType).toBe("Bundle");
      expect(body.type).toBe("history");
      expect(body.total).toBeGreaterThanOrEqual(2); // At least create + update
      expect(body.entry.length).toBeGreaterThanOrEqual(2);

      // Most recent first
      expect(body.entry[0].resource.name[0].family).toBe("UpdatedFamily");
    });

    test("GET /Patient/:id/_history/:vid returns specific version", async () => {
      const res = await fhirFetch(`/Patient/${patientId}/_history/${versionId}`);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.resourceType).toBe("Patient");
      expect(body.meta.versionId).toBe(versionId);
    });

    test("DELETE /Patient/:id deletes the patient", async () => {
      const res = await fhirFetch(`/Patient/${patientId}`, {
        method: "DELETE",
      });
      expect(res.status).toBe(204);

      // Verify deleted
      const getRes = await fhirFetch(`/Patient/${patientId}`);
      expect(getRes.status).toBe(404);
    });

    test("DELETE /Patient/:id returns 404 for non-existent", async () => {
      const res = await fhirFetch("/Patient/00000000-0000-0000-0000-000000000000", {
        method: "DELETE",
      });
      expect(res.status).toBe(404);
    });
  });

  describe("Search", () => {
    let patientId: string;

    beforeAll(async () => {
      // Create a patient for search tests
      const res = await fhirJson("/Patient", {
        method: "POST",
        body: JSON.stringify({
          resourceType: "Patient",
          name: [{ family: "SearchTest", given: ["John"] }],
        }),
      });
      patientId = res.id;
    });

    afterAll(async () => {
      await fhirFetch(`/Patient/${patientId}`, { method: "DELETE" });
    });

    test("GET /Patient returns searchset bundle", async () => {
      const res = await fhirFetch("/Patient");
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.resourceType).toBe("Bundle");
      expect(body.type).toBe("searchset");
      expect(Array.isArray(body.entry)).toBe(true);
    });

    test("GET /Patient?_id=:id returns specific patient", async () => {
      const res = await fhirFetch(`/Patient?_id=${patientId}`);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.total).toBe(1);
      expect(body.entry[0].resource.id).toBe(patientId);
    });

    test("GET /Patient?_count=1 limits results", async () => {
      const res = await fhirFetch("/Patient?_count=1");
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.entry.length).toBeLessThanOrEqual(1);
    });
  });

  describe("Patient-Related Resources (Observation)", () => {
    let patientId: string;
    let observationId: string;

    beforeAll(async () => {
      // Create a patient first
      const res = await fhirJson("/Patient", {
        method: "POST",
        body: JSON.stringify({
          resourceType: "Patient",
          name: [{ family: "ObsTest" }],
        }),
      });
      patientId = res.id;
    });

    afterAll(async () => {
      if (observationId) {
        await fhirFetch(`/Observation/${observationId}`, { method: "DELETE" });
      }
      await fhirFetch(`/Patient/${patientId}`, { method: "DELETE" });
    });

    test("POST /Observation requires patient reference", async () => {
      const observation = {
        resourceType: "Observation",
        status: "final",
        code: { coding: [{ system: "http://loinc.org", code: "8867-4" }] },
        // Missing subject reference
      };

      const res = await fhirFetch("/Observation", {
        method: "POST",
        body: JSON.stringify(observation),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.resourceType).toBe("OperationOutcome");
      expect(body.issue[0].diagnostics).toContain("Patient reference is required");
    });

    test("POST /Observation creates with patient reference", async () => {
      const observation = {
        resourceType: "Observation",
        status: "final",
        code: { coding: [{ system: "http://loinc.org", code: "8867-4" }] },
        subject: { reference: `Patient/${patientId}` },
        valueQuantity: { value: 72, unit: "bpm" },
      };

      const res = await fhirFetch("/Observation", {
        method: "POST",
        body: JSON.stringify(observation),
      });

      expect(res.status).toBe(201);

      const body = await res.json();
      expect(body.resourceType).toBe("Observation");
      expect(body.subject.reference).toBe(`Patient/${patientId}`);

      observationId = body.id;
    });

    test("GET /Observation?patient=:id searches by patient", async () => {
      const res = await fhirFetch(`/Observation?patient=${patientId}`);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.resourceType).toBe("Bundle");
      expect(body.total).toBeGreaterThanOrEqual(1);
      expect(body.entry[0].resource.subject.reference).toBe(`Patient/${patientId}`);
    });

    test("GET /Observation?subject=Patient/:id also works", async () => {
      const res = await fhirFetch(`/Observation?subject=Patient/${patientId}`);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.total).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Type History", () => {
    test("GET /Patient/_history returns type history bundle", async () => {
      const res = await fhirFetch("/Patient/_history");
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.resourceType).toBe("Bundle");
      expect(body.type).toBe("history");
    });
  });

  describe("Multi-Tenancy", () => {
    let patientId: string;
    const otherTenantId = "22222222-2222-2222-2222-222222222222";

    beforeAll(async () => {
      // Create patient in default tenant
      const res = await fhirJson("/Patient", {
        method: "POST",
        body: JSON.stringify({
          resourceType: "Patient",
          name: [{ family: "TenantTest" }],
        }),
      });
      patientId = res.id;
    });

    afterAll(async () => {
      await fhirFetch(`/Patient/${patientId}`, { method: "DELETE" });
    });

    test("Different tenant cannot access other tenant's resources", async () => {
      const res = await fetch(`${BASE_URL}/Patient/${patientId}`, {
        headers: {
          "Content-Type": "application/fhir+json",
          "X-Tenant-ID": otherTenantId,
        },
      });

      expect(res.status).toBe(404);
    });
  });

  describe("Default Tenant (no X-Tenant-ID header)", () => {
    let patientId: string;

    test("POST /Patient works without tenant header", async () => {
      const res = await fetch(`${BASE_URL}/Patient`, {
        method: "POST",
        headers: { "Content-Type": "application/fhir+json" },
        body: JSON.stringify({
          resourceType: "Patient",
          name: [{ family: "DefaultTenant" }],
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.resourceType).toBe("Patient");
      patientId = body.id;
    });

    test("GET /Patient/:id works without tenant header", async () => {
      const res = await fetch(`${BASE_URL}/Patient/${patientId}`, {
        headers: { "Content-Type": "application/fhir+json" },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.name[0].family).toBe("DefaultTenant");
    });

    test("DELETE /Patient/:id cleanup", async () => {
      const res = await fetch(`${BASE_URL}/Patient/${patientId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/fhir+json" },
      });
      expect(res.status).toBe(204);
    });
  });

  describe("Error Handling", () => {
    test("Invalid path returns 400", async () => {
      const res = await fhirFetch("/");
      expect(res.status).toBe(400);

      const body = await res.json();
      expect(body.resourceType).toBe("OperationOutcome");
    });

    test("Invalid JSON returns 500", async () => {
      const res = await fetch(`${BASE_URL}/Patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/fhir+json",
          "X-Tenant-ID": TENANT_ID,
        },
        body: "not json",
      });

      expect(res.status).toBe(500);
    });

    test("Unsupported method returns 405", async () => {
      const res = await fhirFetch("/Patient/123", {
        method: "PATCH",
      });

      expect(res.status).toBe(405);
    });
  });
});
