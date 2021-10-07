#!/bin/sh

# Hackerish way to replace backend URL during runtime
find /usr/share/nginx/html -type f -exec sed -i "s#http://localhost:8090#${BACKEND_URL:?}#g" {} \+

# Run default entrypoint
source /docker-entrypoint.sh "$@"