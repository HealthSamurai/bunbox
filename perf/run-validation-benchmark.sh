#!/bin/bash

BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "=== Patient Create Benchmark: With vs Without Validation ==="
echo ""

# Test WITHOUT validation
echo ">>> Disabling validation..."
curl -s -X POST "$BASE_URL/\$toggle-validation" \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
echo ""

echo ">>> Running benchmark WITHOUT validation..."
k6 run --quiet perf/create-validation.k6.js 2>&1 | tail -20

echo ""
echo "---"
echo ""

# Test WITH validation
echo ">>> Enabling validation..."
curl -s -X POST "$BASE_URL/\$toggle-validation" \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
echo ""

echo ">>> Running benchmark WITH validation..."
k6 run --quiet perf/create-validation.k6.js 2>&1 | tail -20

echo ""
echo "=== Benchmark Complete ==="
