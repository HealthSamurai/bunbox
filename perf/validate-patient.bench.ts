import { validatePatient } from "../src/fhir/validate-patient";
import { validatePatient as validatePatientFast } from "../src/fhir/validate-patient-fast";

// Test payloads
const minimalPatient = {
  resourceType: "Patient",
};

// Official FHIR R4 patient example from https://hl7.org/fhir/R4/patient-example.json
const fhirExamplePatient = {
  "resourceType": "Patient",
  "id": "example",
  "text": {
    "status": "generated",
    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table><tbody><tr><td>Name</td><td>Peter James <b>Chalmers</b> (\"Jim\")</td></tr></tbody></table></div>"
  },
  "identifier": [
    {
      "use": "usual",
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MR"
          }
        ]
      },
      "system": "urn:oid:1.2.36.146.595.217.0.1",
      "value": "12345",
      "period": {
        "start": "2001-05-06"
      },
      "assigner": {
        "display": "Acme Healthcare"
      }
    }
  ],
  "active": true,
  "name": [
    {
      "use": "official",
      "family": "Chalmers",
      "given": ["Peter", "James"]
    },
    {
      "use": "usual",
      "given": ["Jim"]
    },
    {
      "use": "maiden",
      "family": "Windsor",
      "given": ["Peter", "James"],
      "period": { "end": "2002" }
    }
  ],
  "telecom": [
    { "use": "home" },
    { "system": "phone", "value": "(03) 5555 6473", "use": "work", "rank": 1 },
    { "system": "phone", "value": "(03) 3410 5613", "use": "mobile", "rank": 2 },
    { "system": "phone", "value": "(03) 5555 8834", "use": "old", "period": { "end": "2014" } }
  ],
  "gender": "male",
  "birthDate": "1974-12-25",
  "_birthDate": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/patient-birthTime",
        "valueDateTime": "1974-12-25T14:35:45-05:00"
      }
    ]
  },
  "deceasedBoolean": false,
  "address": [
    {
      "use": "home",
      "type": "both",
      "text": "534 Erewhon St PeasantVille, Rainbow, Vic  3999",
      "line": ["534 Erewhon St"],
      "city": "PleasantVille",
      "district": "Rainbow",
      "state": "Vic",
      "postalCode": "3999",
      "period": { "start": "1974-12-25" }
    }
  ],
  "contact": [
    {
      "relationship": [
        {
          "coding": [
            { "system": "http://terminology.hl7.org/CodeSystem/v2-0131", "code": "N" }
          ]
        }
      ],
      "name": {
        "family": "du Marché",
        "_family": {
          "extension": [
            { "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-prefix", "valueString": "VV" }
          ]
        },
        "given": ["Bénédicte"]
      },
      "telecom": [
        { "system": "phone", "value": "+33 (237) 998327" }
      ],
      "address": {
        "use": "home",
        "type": "both",
        "line": ["534 Erewhon St"],
        "city": "PleasantVille",
        "district": "Rainbow",
        "state": "Vic",
        "postalCode": "3999",
        "period": { "start": "1974-12-25" }
      },
      "gender": "female",
      "period": { "start": "2012" }
    }
  ],
  "managingOrganization": { "reference": "Organization/1" }
};

const invalidPatient = {
  resourceType: "Patient",
  gender: "invalid",
  birthDate: "15-01-1990",
  active: "yes",
  name: { family: "Smith" }, // should be array
  deceasedBoolean: true,
  deceasedDateTime: "2020-01-01", // both deceased fields
};

// Warm up both
for (let i = 0; i < 1000; i++) {
  validatePatient(minimalPatient);
  validatePatient(fhirExamplePatient);
  validatePatient(invalidPatient);
  validatePatientFast(minimalPatient);
  validatePatientFast(fhirExamplePatient);
  validatePatientFast(invalidPatient);
}

function benchmark(name: string, fn: () => void, iterations: number = 100000): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const elapsed = performance.now() - start;
  const opsPerSec = (iterations / elapsed) * 1000;
  const avgMicroseconds = (elapsed / iterations) * 1000;

  console.log(`  ${iterations.toLocaleString()} iterations in ${elapsed.toFixed(2)}ms`);
  console.log(`  ${opsPerSec.toLocaleString(undefined, { maximumFractionDigits: 0 })} ops/sec`);
  console.log(`  ${avgMicroseconds.toFixed(2)} µs/op`);
  return opsPerSec;
}

console.log("Patient Validation Benchmark - Original vs Optimized\n");
console.log("=".repeat(60));

// Minimal Patient
console.log("\n--- Minimal Patient (valid) ---");
console.log("Original:");
const minOrig = benchmark("original", () => validatePatient(minimalPatient));
console.log("Optimized:");
const minFast = benchmark("fast", () => validatePatientFast(minimalPatient));
console.log(`Speedup: ${(minFast / minOrig).toFixed(2)}x`);

// Complete Patient
console.log("\n--- FHIR Example Patient (valid) ---");
console.log("Original:");
const compOrig = benchmark("original", () => validatePatient(fhirExamplePatient));
console.log("Optimized:");
const compFast = benchmark("fast", () => validatePatientFast(fhirExamplePatient));
console.log(`Speedup: ${(compFast / compOrig).toFixed(2)}x`);

// Invalid Patient
console.log("\n--- Invalid Patient (multiple errors) ---");
console.log("Original:");
const invOrig = benchmark("original", () => validatePatient(invalidPatient));
console.log("Optimized:");
const invFast = benchmark("fast", () => validatePatientFast(invalidPatient));
console.log(`Speedup: ${(invFast / invOrig).toFixed(2)}x`);

// Mixed workload comparison
console.log("\n--- Mixed Workload (33% each) ---");
const mixedIterations = 300000;

console.log("Original:");
let start = performance.now();
for (let i = 0; i < mixedIterations; i++) {
  const mod = i % 3;
  if (mod === 0) validatePatient(minimalPatient);
  else if (mod === 1) validatePatient(fhirExamplePatient);
  else validatePatient(invalidPatient);
}
let elapsed = performance.now() - start;
const mixedOrig = (mixedIterations / elapsed) * 1000;
console.log(`  ${mixedIterations.toLocaleString()} iterations in ${elapsed.toFixed(2)}ms`);
console.log(`  ${mixedOrig.toLocaleString(undefined, { maximumFractionDigits: 0 })} ops/sec`);

console.log("Optimized:");
start = performance.now();
for (let i = 0; i < mixedIterations; i++) {
  const mod = i % 3;
  if (mod === 0) validatePatientFast(minimalPatient);
  else if (mod === 1) validatePatientFast(fhirExamplePatient);
  else validatePatientFast(invalidPatient);
}
elapsed = performance.now() - start;
const mixedFast = (mixedIterations / elapsed) * 1000;
console.log(`  ${mixedIterations.toLocaleString()} iterations in ${elapsed.toFixed(2)}ms`);
console.log(`  ${mixedFast.toLocaleString(undefined, { maximumFractionDigits: 0 })} ops/sec`);
console.log(`Speedup: ${(mixedFast / mixedOrig).toFixed(2)}x`);

// Memory check
console.log("\nMemory Usage:");
const mem = process.memoryUsage();
console.log(`  Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Heap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`);
