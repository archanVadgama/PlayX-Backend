#!/usr/bin/env bash
# sessionStart hook — records when a Copilot Coding Agent session begins.
# Receives a JSON payload on stdin:
#   { "session_id": "...", "user": "...", "task": "..." }

set -euo pipefail

LOG_DIR="$(dirname "$0")/../logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/sessions.log"

PAYLOAD=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

SESSION_ID=$(echo "$PAYLOAD" | grep -o '"session_id":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
USER_FIELD=$(echo "$PAYLOAD" | grep -o '"user":"[^"]*"'       | cut -d'"' -f4 || echo "unknown")
TASK=$(echo "$PAYLOAD"       | grep -o '"task":"[^"]*"'       | cut -d'"' -f4 || echo "unknown")

printf '[%s] SESSION_START | session_id=%s | user=%s | task=%s\n' \
  "$TIMESTAMP" "$SESSION_ID" "$USER_FIELD" "$TASK" \
  >> "$LOG_FILE"

# Hook must exit 0 to allow the session to proceed.
exit 0
