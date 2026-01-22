/**
 * k6 Performance Test - FHIR Create Operation
 *
 * Run with:
 *   k6 run perf/create.k6.js
 *
 * With options:
 *   k6 run --vus 10 --duration 30s perf/create.k6.js
 *   k6 run --vus 50 --iterations 1000 perf/create.k6.js
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

// Custom metrics
const createDuration = new Trend("fhir_create_duration", true);
const createErrors = new Counter("fhir_create_errors");
const createSuccess = new Rate("fhir_create_success");

// Test configuration
export const options = {
  scenarios: {
    // Smoke test - verify it works
    smoke: {
      executor: "constant-vus",
      vus: 1,
      duration: "10s",
      startTime: "0s",
      tags: { scenario: "smoke" },
    },
    // Load test - normal load
    load: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 10 },  // Ramp up
        { duration: "30s", target: 10 },  // Stay at 10
        { duration: "10s", target: 0 },   // Ramp down
      ],
      startTime: "15s",
      tags: { scenario: "load" },
    },
    // Stress test - high load
    stress: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 50 },  // Ramp up
        { duration: "30s", target: 50 },  // Stay at 50
        { duration: "10s", target: 0 },   // Ramp down
      ],
      startTime: "70s",
      tags: { scenario: "stress" },
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1000"],  // 95% under 500ms, 99% under 1s
    fhir_create_success: ["rate>0.99"],              // 99% success rate
    fhir_create_duration: ["p(95)<400"],             // 95% create under 400ms
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const TENANT_ID = __ENV.TENANT_ID || "00000000-0000-0000-0000-000000000000";

// Generate a random patient resource
function generatePatient() {
  const id = Math.random().toString(36).substring(2, 10);
  const families = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
  const givens = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "James", "Emma"];
  const genders = ["male", "female", "other", "unknown"];

  return {
    resourceType: "Patient",
    identifier: [
      {
        system: "http://example.org/mrn",
        value: `MRN-${id}`,
      },
    ],
    name: [
      {
        family: families[Math.floor(Math.random() * families.length)],
        given: [givens[Math.floor(Math.random() * givens.length)]],
      },
    ],
    gender: genders[Math.floor(Math.random() * genders.length)],
    birthDate: `${1950 + Math.floor(Math.random() * 50)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    address: [
      {
        use: "home",
        line: [`${Math.floor(Math.random() * 9999)} Main St`],
        city: "Boston",
        state: "MA",
        postalCode: String(10000 + Math.floor(Math.random() * 89999)),
      },
    ],
  };
}

// Generate a random observation resource
function generateObservation(patientId) {
  return {
    resourceType: "Observation",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "8867-4",
          display: "Heart rate",
        },
      ],
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    valueQuantity: {
      value: 60 + Math.floor(Math.random() * 40),
      unit: "beats/minute",
      system: "http://unitsofmeasure.org",
      code: "/min",
    },
  };
}

const headers = {
  "Content-Type": "application/fhir+json",
  "X-Tenant-ID": TENANT_ID,
};

// Main test function
export default function () {
  // Create Patient
  const patient = generatePatient();
  const startTime = Date.now();

  const patientRes = http.post(`${BASE_URL}/Patient`, JSON.stringify(patient), {
    headers,
    tags: { name: "POST /Patient" },
  });

  const duration = Date.now() - startTime;
  createDuration.add(duration);

  const patientSuccess = check(patientRes, {
    "Patient create status is 201": (r) => r.status === 201,
    "Patient has id": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id !== undefined;
      } catch {
        return false;
      }
    },
    "Patient has versionId": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.meta?.versionId !== undefined;
      } catch {
        return false;
      }
    },
  });

  if (patientSuccess) {
    createSuccess.add(1);

    // Also create an Observation for the patient
    try {
      const patientBody = JSON.parse(patientRes.body);
      const observation = generateObservation(patientBody.id);

      const obsRes = http.post(`${BASE_URL}/Observation`, JSON.stringify(observation), {
        headers,
        tags: { name: "POST /Observation" },
      });

      check(obsRes, {
        "Observation create status is 201": (r) => r.status === 201,
        "Observation has patient reference": (r) => {
          try {
            const body = JSON.parse(r.body);
            return body.subject?.reference?.includes("Patient/");
          } catch {
            return false;
          }
        },
      });
    } catch (e) {
      // Ignore observation errors, patient creation is the main test
    }
  } else {
    createSuccess.add(0);
    createErrors.add(1);
    console.error(`Create failed: ${patientRes.status} - ${patientRes.body}`);
  }

  // Small sleep to prevent overwhelming
  sleep(0.1);
}

// Setup - runs once before the test
export function setup() {
  // Verify server is reachable
  const res = http.get(`${BASE_URL}/metadata`, { headers });
  if (res.status !== 200) {
    throw new Error(`Server not reachable: ${res.status}`);
  }
  console.log(`Testing against ${BASE_URL}`);
  return { baseUrl: BASE_URL };
}

// Teardown - runs once after the test
export function teardown(data) {
  console.log(`Test completed against ${data.baseUrl}`);
}

// Handle summary
export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    metrics: {
      requests: data.metrics.http_reqs?.values?.count || 0,
      duration_avg: data.metrics.http_req_duration?.values?.avg || 0,
      duration_p95: data.metrics.http_req_duration?.values["p(95)"] || 0,
      duration_p99: data.metrics.http_req_duration?.values["p(99)"] || 0,
      create_success_rate: data.metrics.fhir_create_success?.values?.rate || 0,
      create_errors: data.metrics.fhir_create_errors?.values?.count || 0,
    },
  };

  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "perf/results.json": JSON.stringify(summary, null, 2),
  };
}

// Text summary helper
function textSummary(data, opts) {
  const lines = [
    "",
    "=".repeat(60),
    "FHIR Create Performance Test Results",
    "=".repeat(60),
    "",
    `Total Requests:     ${data.metrics.http_reqs?.values?.count || 0}`,
    `Success Rate:       ${((data.metrics.fhir_create_success?.values?.rate || 0) * 100).toFixed(2)}%`,
    `Errors:             ${data.metrics.fhir_create_errors?.values?.count || 0}`,
    "",
    "Response Times:",
    `  Average:          ${(data.metrics.http_req_duration?.values?.avg || 0).toFixed(2)}ms`,
    `  Median:           ${(data.metrics.http_req_duration?.values?.med || 0).toFixed(2)}ms`,
    `  p(95):            ${(data.metrics.http_req_duration?.values["p(95)"] || 0).toFixed(2)}ms`,
    `  p(99):            ${(data.metrics.http_req_duration?.values["p(99)"] || 0).toFixed(2)}ms`,
    `  Max:              ${(data.metrics.http_req_duration?.values?.max || 0).toFixed(2)}ms`,
    "",
    "Create Operation:",
    `  Average:          ${(data.metrics.fhir_create_duration?.values?.avg || 0).toFixed(2)}ms`,
    `  p(95):            ${(data.metrics.fhir_create_duration?.values["p(95)"] || 0).toFixed(2)}ms`,
    "",
    "=".repeat(60),
    "",
  ];
  return lines.join("\n");
}
