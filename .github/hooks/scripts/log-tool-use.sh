#!/usr/bin/env bash
# preToolUse hook — logs every tool the Copilot Coding Agent attempts to use.
# Receives a JSON payload on stdin:
#   { "session_id": "...", "tool_name": "...", "tool_input": { ... } }
# Must print a JSON decision to stdout:
#   { "decision": "allow" }   — permit the tool call
#   { "decision": "block", "reason": "..." }  — deny and surface reason

set -euo pipefail

LOG_DIR="$(dirname "$0")/../logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/tools.log"

PAYLOAD=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

SESSION_ID=$(echo "$PAYLOAD" | grep -o '"session_id":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
TOOL_NAME=$(echo "$PAYLOAD"  | grep -o '"tool_name":"[^"]*"'  | cut -d'"' -f4 || echo "unknown")

# Sanitise tool_input: collapse newlines and truncate to 300 chars to keep logs readable
TOOL_INPUT=$(echo "$PAYLOAD" | grep -o '"tool_input":{[^}]*}' | tr -d '\n' | cut -c1-300 || echo "{}")

printf '[%s] PRE_TOOL_USE  | session_id=%s | tool=%s | input=%s\n' \
  "$TIMESTAMP" "$SESSION_ID" "$TOOL_NAME" "$TOOL_INPUT" \
  >> "$LOG_FILE"

# Allow all tools — change decision to "block" with a reason to restrict specific tools.
printf '{"decision":"allow"}\n'
exit 0
