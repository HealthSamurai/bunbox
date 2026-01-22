# Bunbox

High-performance FHIR R4 Server built with [Bun](https://bun.sh) and PostgreSQL.

## Features

- **FHIR R4 Compliant** - CRUD operations, search, versioning, history
- **Multi-tenant** - Tenant isolation via `X-Tenant-ID` header
- **Fast** - 12K creates/sec, 30K reads/sec
- **Validated** - Patient validation at 2M validations/sec with only 3.7% overhead
- **PostgreSQL JSONB** - Flexible schema with efficient querying

## Quick Start

```bash
# Start PostgreSQL
docker-compose up -d

# Install dependencies
bun install

# Initialize database
psql postgres://postgres:postgres@localhost:54321/bunbox < schema.sql

# Run server
bun src/index.ts
```

Server runs at http://localhost:3000

## API

```bash
# Create Patient
curl -X POST http://localhost:3000/Patient \
  -H "Content-Type: application/fhir+json" \
  -d '{"resourceType": "Patient", "name": [{"family": "Smith"}]}'

# Read Patient
curl http://localhost:3000/Patient/{id}

# Update Patient
curl -X PUT http://localhost:3000/Patient/{id} \
  -H "Content-Type: application/fhir+json" \
  -d '{"resourceType": "Patient", "name": [{"family": "Jones"}]}'

# Delete Patient
curl -X DELETE http://localhost:3000/Patient/{id}

# Search
curl http://localhost:3000/Patient?_count=10

# History
curl http://localhost:3000/Patient/{id}/_history

# Capability Statement
curl http://localhost:3000/metadata
```

### Multi-tenancy

```bash
curl -H "X-Tenant-ID: tenant-uuid" http://localhost:3000/Patient
```

## Testing

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/fhir-crud.test.ts
```

## Performance Testing

```bash
# Install k6
brew install k6

# Run create benchmark
k6 run perf/create.k6.js

# Run read benchmark
k6 run perf/read.k6.js

# Run validation benchmark
bun perf/validate-patient.bench.ts
```

## Project Structure

```
src/
  index.ts           # HTTP server
  db.ts              # Database connection & helpers
  fhir/
    crud.ts          # CRUD operations
    history.ts       # Versioning
    validate-patient-fast.ts  # Optimized validation

tests/               # Acceptance tests
perf/                # k6 load tests & benchmarks
scripts/             # Schema generation
schema.sql           # PostgreSQL schema (147 FHIR resources)
```

## Performance

| Operation | Throughput | Latency (avg) |
|-----------|------------|---------------|
| Create (with validation) | 12K req/s | 8.1ms |
| Create (no validation) | 12.5K req/s | 7.8ms |
| Read | 30K req/s | 3.3ms |
| Validation only | 2M ops/s | 0.5µs |

## License

MIT
