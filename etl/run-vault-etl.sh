#!/bin/bash
# run-vault-etl.sh — daily vault ETL runner for EC2 cron
# Cron entry: 0 9 * * * /home/ec2-user/facinations-etl/run-vault-etl.sh
# Logs to: /home/ec2-user/facinations-etl/etl.log

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/etl.log"
ENV_FILE="$SCRIPT_DIR/.env"

# Load environment variables
if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") INFO  run-vault-etl.sh starting" >> "$LOG_FILE"

cd "$SCRIPT_DIR"

npx ts-node src/vaultEtl.ts >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") INFO  ETL run succeeded" >> "$LOG_FILE"
else
  echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") ERROR ETL run failed with exit code $EXIT_CODE" >> "$LOG_FILE"
fi

exit $EXIT_CODE
