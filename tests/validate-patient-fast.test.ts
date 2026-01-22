import { test, expect, describe } from "bun:test";
import { validatePatient } from "../src/fhir/validate-patient-fast";

describe("Patient Validation (Fast)", () => {
  describe("Valid Patients", () => {
    test("minimal valid patient", () => {
      const result = validatePatient({
        resourceType: "Patient",
      });
      expect(result.valid).toBe(true);
      expect(result.errors.filter(e => e.severity === "error")).toHaveLength(0);
    });

    test("complete valid patient", () => {
      const result = validatePatient({
        resourceType: "Patient",
        id: "example",
        identifier: [
          { system: "http://example.org/mrn", value: "12345" }
        ],
        active: true,
        name: [
          { use: "official", family: "Smith", given: ["John", "David"] }
        ],
        telecom: [
          { system: "phone", value: "555-1234", use: "home" }
        ],
        gender: "male",
        birthDate: "1990-01-15",
        address: [
          {
            use: "home",
            line: ["123 Main St"],
            city: "Boston",
            state: "MA",
            postalCode: "02101"
          }
        ],
        maritalStatus: {
          coding: [{ system: "http://hl7.org/fhir/v3/MaritalStatus", code: "M" }]
        },
        contact: [
          {
            relationship: [{ coding: [{ code: "spouse" }] }],
            name: { family: "Smith", given: ["Jane"] }
          }
        ],
        communication: [
          {
            language: { coding: [{ system: "urn:ietf:bcp:47", code: "en" }] },
            preferred: true
          }
        ],
        generalPractitioner: [
          { reference: "Practitioner/123" }
        ],
        managingOrganization: { reference: "Organization/456" }
      });
      expect(result.valid).toBe(true);
    });

    test("patient with deceased dateTime", () => {
      const result = validatePatient({
        resourceType: "Patient",
        deceasedDateTime: "2020-05-15T10:30:00Z"
      });
      expect(result.valid).toBe(true);
    });

    test("patient with multipleBirth integer", () => {
      const result = validatePatient({
        resourceType: "Patient",
        multipleBirthInteger: 2
      });
      expect(result.valid).toBe(true);
    });

    test("patient with link", () => {
      const result = validatePatient({
        resourceType: "Patient",
        link: [
          { other: { reference: "Patient/old-123" }, type: "replaces" }
        ]
      });
      expect(result.valid).toBe(true);
    });
  });

  describe("Invalid Patients", () => {
    test("wrong resourceType", () => {
      const result = validatePatient({
        resourceType: "Observation"
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === "Patient.resourceType")).toBe(true);
    });

    test("invalid gender code", () => {
      const result = validatePatient({
        resourceType: "Patient",
        gender: "invalid"
      });
      expect(result.errors.some(e => e.path === "Patient.gender")).toBe(true);
    });

    test("invalid birthDate format", () => {
      const result = validatePatient({
        resourceType: "Patient",
        birthDate: "15-01-1990"
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === "Patient.birthDate")).toBe(true);
    });

    test("both deceasedBoolean and deceasedDateTime", () => {
      const result = validatePatient({
        resourceType: "Patient",
        deceasedBoolean: true,
        deceasedDateTime: "2020-01-01"
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === "Patient.deceased[x]")).toBe(true);
    });

    test("name should be array", () => {
      const result = validatePatient({
        resourceType: "Patient",
        name: { family: "Smith" } // should be array
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === "Patient.name")).toBe(true);
    });

    test("active should be boolean", () => {
      const result = validatePatient({
        resourceType: "Patient",
        active: "yes"
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === "Patient.active")).toBe(true);
    });

    test("contact without details (pat-1)", () => {
      const result = validatePatient({
        resourceType: "Patient",
        contact: [
          { relationship: [{ coding: [{ code: "friend" }] }] }
          // missing name, telecom, address, or organization
        ]
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes("pat-1"))).toBe(true);
    });

    test("communication without language", () => {
      const result = validatePatient({
        resourceType: "Patient",
        communication: [
          { preferred: true }
          // missing required language
        ]
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path.includes("language"))).toBe(true);
    });

    test("link without required fields", () => {
      const result = validatePatient({
        resourceType: "Patient",
        link: [
          { } // missing other and type
        ]
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path.includes("other"))).toBe(true);
      expect(result.errors.some(e => e.path.includes("type"))).toBe(true);
    });

    test("invalid link type code", () => {
      const result = validatePatient({
        resourceType: "Patient",
        link: [
          { other: { reference: "Patient/123" }, type: "invalid-type" }
        ]
      });
      expect(result.errors.some(e => e.path.includes("type"))).toBe(true);
    });
  });

  describe("Warnings", () => {
    test("unknown property generates warning", () => {
      const result = validatePatient({
        resourceType: "Patient",
        unknownField: "value"
      });
      expect(result.valid).toBe(true); // warnings don't make it invalid
      expect(result.errors.some(e => e.severity === "warning" && e.path === "Patient.unknownField")).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    test("partial date formats", () => {
      expect(validatePatient({ resourceType: "Patient", birthDate: "1990" }).valid).toBe(true);
      expect(validatePatient({ resourceType: "Patient", birthDate: "1990-01" }).valid).toBe(true);
      expect(validatePatient({ resourceType: "Patient", birthDate: "1990-01-15" }).valid).toBe(true);
    });

    test("empty arrays are valid", () => {
      const result = validatePatient({
        resourceType: "Patient",
        identifier: [],
        name: [],
        telecom: []
      });
      expect(result.valid).toBe(true);
    });

    test("null resource", () => {
      const result = validatePatient(null);
      expect(result.valid).toBe(false);
    });

    test("non-object resource", () => {
      const result = validatePatient("Patient");
      expect(result.valid).toBe(false);
    });
  });
});
