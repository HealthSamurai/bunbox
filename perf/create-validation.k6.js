import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const successRate = new Rate('success_rate');
const createDuration = new Trend('create_duration');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// FHIR R4 example patient (realistic payload)
const patientPayload = JSON.stringify({
  resourceType: "Patient",
  identifier: [
    {
      use: "usual",
      type: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "MR" }] },
      system: "urn:oid:1.2.36.146.595.217.0.1",
      value: "12345",
      period: { start: "2001-05-06" },
      assigner: { display: "Acme Healthcare" }
    }
  ],
  active: true,
  name: [
    { use: "official", family: "Chalmers", given: ["Peter", "James"] },
    { use: "usual", given: ["Jim"] }
  ],
  telecom: [
    { use: "home" },
    { system: "phone", value: "(03) 5555 6473", use: "work", rank: 1 },
    { system: "phone", value: "(03) 3410 5613", use: "mobile", rank: 2 }
  ],
  gender: "male",
  birthDate: "1974-12-25",
  deceasedBoolean: false,
  address: [
    {
      use: "home",
      type: "both",
      text: "534 Erewhon St PeasantVille, Rainbow, Vic 3999",
      line: ["534 Erewhon St"],
      city: "PleasantVille",
      district: "Rainbow",
      state: "Vic",
      postalCode: "3999",
      period: { start: "1974-12-25" }
    }
  ],
  contact: [
    {
      relationship: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0131", code: "N" }] }],
      name: { family: "du Marché", given: ["Bénédicte"] },
      telecom: [{ system: "phone", value: "+33 (237) 998327" }],
      address: {
        use: "home",
        type: "both",
        line: ["534 Erewhon St"],
        city: "PleasantVille",
        state: "Vic",
        postalCode: "3999"
      },
      gender: "female",
      period: { start: "2012" }
    }
  ],
  managingOrganization: { reference: "Organization/1" }
});

const headers = {
  'Content-Type': 'application/fhir+json',
};

export const options = {
  scenarios: {
    create_patients: {
      executor: 'constant-vus',
      vus: 100,
      duration: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<100'],
    success_rate: ['rate>0.99'],
  },
};

export default function () {
  const res = http.post(`${BASE_URL}/Patient`, patientPayload, { headers });

  const success = check(res, {
    'status is 201': (r) => r.status === 201,
    'has id': (r) => {
      try {
        return JSON.parse(r.body).id !== undefined;
      } catch {
        return false;
      }
    },
  });

  successRate.add(success);
  createDuration.add(res.timings.duration);
}

export function setup() {
  // Check current validation status
  const statusRes = http.get(`${BASE_URL}/$validation-status`);
  console.log(`Validation status: ${statusRes.body}`);
  return {};
}

export function handleSummary(data) {
  const reqsPerSec = data.metrics.http_reqs.values.rate.toFixed(0);
  const avgDuration = data.metrics.http_req_duration.values.avg.toFixed(2);
  const p95Duration = data.metrics.http_req_duration.values['p(95)'].toFixed(2);
  const successPct = (data.metrics.success_rate.values.rate * 100).toFixed(2);

  console.log('\n=== Patient Create Performance ===');
  console.log(`Requests/sec: ${reqsPerSec}`);
  console.log(`Avg duration: ${avgDuration}ms`);
  console.log(`P95 duration: ${p95Duration}ms`);
  console.log(`Success rate: ${successPct}%`);
  console.log(`Total requests: ${data.metrics.http_reqs.values.count}`);

  return {};
}
