#!/bin/bash
# Bash strict mode: http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail

# Download latest OpenAPI file
wget "https://raw.githubusercontent.com/JenswBE/go-commerce/main/docs/openapi.yml"

# Generate models
docker run --user ${UID} --rm -v "$(pwd):/local" \
openapitools/openapi-generator-cli generate \
-i /local/openapi.yml \
-g typescript-axios \
-o /local/api \
--additional-properties supportsES6=true

# Remove temporary file
rm -f openapi.yml