# FHIR Server Specification

Minimal FHIR R4 server implementation using Bun and PostgreSQL JSONB.

## Goals

- Simple, maintainable codebase
- FHIR R4 compliance for core operations
- Leverage PostgreSQL JSONB for flexible storage
- Good search performance via GIN indexes

## Database Schema

Table per resource type. Tables created dynamically on first use.

- `id` and `version_id` use UUIDv7 (timestamp-based, sortable)
- `tenant_id` on every table for multi-tenancy
- `patient_id` on patient-related resources for efficient queries

### Base Resource (e.g., Patient)

```sql
CREATE TABLE patient (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,  -- UUIDv7 generated in app
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX patient_gin_idx ON patient USING GIN(resource jsonb_path_ops);
```

### Patient-Related Resource (e.g., Observation, Encounter, Condition)

```sql
CREATE TABLE observation (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX observation_patient_idx ON observation(tenant_id, patient_id);
CREATE INDEX observation_gin_idx ON observation USING GIN(resource jsonb_path_ops);
```

UUIDv7 format: timestamp (48 bits) + random (74 bits) → naturally sortable by time.

### Patient-Related Resources

Resources with `patient_id` column (have subject/patient reference):
- Observation, Encounter, Condition, Procedure, MedicationRequest, DiagnosticReport, AllergyIntolerance, Immunization, CarePlan, etc.

Resources without `patient_id`:
- Patient, Practitioner, Organization, Location, Medication, etc.

## Versioning Strategy

History table per resource type (same columns as main table):

```sql
CREATE TABLE patient_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

CREATE TABLE observation_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);
```

On UPDATE: copy old row to history, generate new UUIDv7 for version_id in main table.

Timestamp extracted from UUIDv7—no separate created_at/updated_at needed.

## API Endpoints

```
GET    /:type/:id           → read
GET    /:type/:id/_history  → history
GET    /:type               → search
POST   /:type               → create
PUT    /:type/:id           → update
DELETE /:type/:id           → delete
POST   /                    → transaction bundle
GET    /metadata            → capability statement
```

## Search Implementation

Build SQL dynamically using JSONB operators and functions. No separate search_param table.

### JSONB Query Patterns

All queries scoped by `tenant_id`. Patient-related queries can use `patient_id` for efficiency.

```sql
-- GET /Patient?name=smith (string search)
SELECT resource FROM patient
WHERE tenant_id = $tenant AND resource @> '{"name": [{"family": "smith"}]}';

-- GET /Patient?name:contains=smi (partial match)
SELECT resource FROM patient
WHERE tenant_id = $tenant AND resource->>'name' ILIKE '%smi%';

-- GET /Observation?subject=Patient/123 (reference, uses patient_id index)
SELECT resource FROM observation
WHERE tenant_id = $tenant AND patient_id = '123';

-- GET /Observation?code=http://loinc.org|12345 (token with system)
SELECT resource FROM observation
WHERE tenant_id = $tenant AND resource @> '{"code": {"coding": [{"system": "http://loinc.org", "code": "12345"}]}}';

-- GET /Patient?birthdate=gt1990-01-01 (date comparison)
SELECT resource FROM patient
WHERE tenant_id = $tenant AND (resource->>'birthDate')::date > '1990-01-01';

-- GET /Observation?value-quantity=gt100 (number comparison)
SELECT resource FROM observation
WHERE tenant_id = $tenant AND (resource->'valueQuantity'->>'value')::numeric > 100;
```

### Supported Search Parameters

- `_id` - resource id (WHERE id = ...)
- `_lastUpdated` - extract timestamp from version_id UUIDv7
- String params → `@>` containment or `ILIKE`
- Token params → `@>` containment with system/code
- Reference params → `@>` containment
- Date params → cast and compare
- Number params → cast and compare

## Project Structure

```
/
├── index.ts           # Bun.serve entry point, routes
├── db.ts              # Database connection (Bun.sql)
├── fhir/
│   ├── crud.ts        # create, read, update, delete
│   ├── search.ts      # search parameter parsing & query building
│   ├── history.ts     # versioning logic
│   └── bundle.ts      # transaction bundle processing
├── schema.sql         # Database schema
└── spec.md            # This file
```

## Open Questions

1. **Tenant resolution**: How is tenant_id determined? (Header, URL path like `/tenant/:id/...`, JWT claim?)
2. **Validation**: Validate resources against FHIR schema on write?
3. **Table creation**: Dynamic (on first use) or predefined set?
4. **Auth**: Skip for now, add later?

## Phase 1 Scope (MVP)

- [ ] Table-per-type schema with history tables
- [ ] Multi-tenant with tenant_id on all tables
- [ ] patient_id on patient-related resources
- [ ] CRUD operations
- [ ] Search via dynamic SQL with JSONB functions
- [ ] No auth, no validation
- [ ] GET /metadata returning basic CapabilityStatement

---

**Please review and let me know your preferences on the open questions.**
