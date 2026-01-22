/**
 * k6 Performance Test - FHIR Read Operation
 *
 * Run with:
 *   k6 run perf/read.k6.js
 *   k6 run --vus 100 --duration 30s perf/read.k6.js
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

// Custom metrics
const readDuration = new Trend("fhir_read_duration", true);
const readErrors = new Counter("fhir_read_errors");
const readSuccess = new Rate("fhir_read_success");

export const options = {
  scenarios: {
    smoke: {
      executor: "constant-vus",
      vus: 1,
      duration: "5s",
      startTime: "0s",
      tags: { scenario: "smoke" },
    },
    load: {
      executor: "constant-vus",
      vus: 50,
      duration: "20s",
      startTime: "10s",
      tags: { scenario: "load" },
    },
    stress: {
      executor: "constant-vus",
      vus: 200,
      duration: "20s",
      startTime: "35s",
      tags: { scenario: "stress" },
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<100", "p(99)<200"],
    fhir_read_success: ["rate>0.99"],
    fhir_read_duration: ["p(95)<50"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const TENANT_ID = __ENV.TENANT_ID || "00000000-0000-0000-0000-000000000000";

const headers = {
  "Content-Type": "application/fhir+json",
  "X-Tenant-ID": TENANT_ID,
};

// Setup - load 1000 random patient IDs
export function setup() {
  console.log("Loading patient IDs from database...");

  const patientIds = [];

  // Fetch patients in batches using _count and _offset
  const batchSize = 100;
  const totalToFetch = 1000;

  for (let offset = 0; offset < totalToFetch; offset += batchSize) {
    const res = http.get(
      `${BASE_URL}/Patient?_count=${batchSize}&_offset=${offset}`,
      { headers }
    );

    if (res.status !== 200) {
      console.error(`Failed to fetch patients: ${res.status}`);
      continue;
    }

    try {
      const bundle = JSON.parse(res.body);
      if (bundle.entry && bundle.entry.length > 0) {
        for (const entry of bundle.entry) {
          if (entry.resource && entry.resource.id) {
            patientIds.push(entry.resource.id);
          }
        }
      }
    } catch (e) {
      console.error(`Failed to parse response: ${e}`);
    }
  }

  console.log(`Loaded ${patientIds.length} patient IDs`);

  if (patientIds.length === 0) {
    throw new Error("No patient IDs loaded. Run create test first.");
  }

  return { patientIds };
}

// Main test function - read random patient
export default function (data) {
  const { patientIds } = data;

  // Pick random patient ID
  const randomIndex = Math.floor(Math.random() * patientIds.length);
  const patientId = patientIds[randomIndex];

  const startTime = Date.now();

  const res = http.get(`${BASE_URL}/Patient/${patientId}`, {
    headers,
    tags: { name: "GET /Patient/:id" },
  });

  const duration = Date.now() - startTime;
  readDuration.add(duration);

  const success = check(res, {
    "status is 200": (r) => r.status === 200,
    "has patient id": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id === patientId;
      } catch {
        return false;
      }
    },
    "has resourceType": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.resourceType === "Patient";
      } catch {
        return false;
      }
    },
  });

  if (success) {
    readSuccess.add(1);
  } else {
    readSuccess.add(0);
    readErrors.add(1);
    console.error(`Read failed: ${res.status} for Patient/${patientId}`);
  }
}

export function teardown(data) {
  console.log(`Test completed. Used ${data.patientIds.length} patient IDs.`);
}

export function handleSummary(data) {
  const lines = [
    "",
    "=".repeat(60),
    "FHIR Read Performance Test Results",
    "=".repeat(60),
    "",
    `Total Requests:     ${data.metrics.http_reqs?.values?.count || 0}`,
    `Success Rate:       ${((data.metrics.fhir_read_success?.values?.rate || 0) * 100).toFixed(2)}%`,
    `Errors:             ${data.metrics.fhir_read_errors?.values?.count || 0}`,
    "",
    "Response Times:",
    `  Average:          ${(data.metrics.http_req_duration?.values?.avg || 0).toFixed(2)}ms`,
    `  Median:           ${(data.metrics.http_req_duration?.values?.med || 0).toFixed(2)}ms`,
    `  p(95):            ${(data.metrics.http_req_duration?.values["p(95)"] || 0).toFixed(2)}ms`,
    `  p(99):            ${(data.metrics.http_req_duration?.values["p(99)"] || 0).toFixed(2)}ms`,
    `  Max:              ${(data.metrics.http_req_duration?.values?.max || 0).toFixed(2)}ms`,
    "",
    "Read Operation:",
    `  Average:          ${(data.metrics.fhir_read_duration?.values?.avg || 0).toFixed(2)}ms`,
    `  p(95):            ${(data.metrics.fhir_read_duration?.values["p(95)"] || 0).toFixed(2)}ms`,
    "",
    `Throughput:         ${(data.metrics.http_reqs?.values?.rate || 0).toFixed(2)} req/s`,
    "",
    "=".repeat(60),
    "",
  ];

  return {
    stdout: lines.join("\n"),
    "perf/read-results.json": JSON.stringify({
      timestamp: new Date().toISOString(),
      metrics: {
        requests: data.metrics.http_reqs?.values?.count || 0,
        rps: data.metrics.http_reqs?.values?.rate || 0,
        duration_avg: data.metrics.http_req_duration?.values?.avg || 0,
        duration_p95: data.metrics.http_req_duration?.values["p(95)"] || 0,
        duration_p99: data.metrics.http_req_duration?.values["p(99)"] || 0,
        success_rate: data.metrics.fhir_read_success?.values?.rate || 0,
        errors: data.metrics.fhir_read_errors?.values?.count || 0,
      },
    }, null, 2),
  };
}
