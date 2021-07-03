#!/bin/bash
# Bash strict mode: http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail

# Download latest OpenAPI file
wget "https://raw.githubusercontent.com/JenswBE/go-commerce/main/docs/openapi.yml"

# Expand YAML
docker run --rm -v "$(pwd):/local" python bash -c "pip install ruamel.yaml.cmd && yaml merge-expand /local/openapi.yml /local/openapi.yml.tmp"

# Generate models
docker run --user ${UID} --rm -v "$(pwd):/local" \
openapitools/openapi-generator-cli generate \
-i /local/openapi.yml.tmp \
-g typescript-axios \
-o /local/openapi \
--additional-properties supportsES6=true

# Remove temporary files
rm -f openapi.yml*