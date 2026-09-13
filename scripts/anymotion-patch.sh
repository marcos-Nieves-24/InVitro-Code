#!/usr/bin/env bash
#
# anymotion-patch.sh — Apply & verify required patches to the globally-installed
# @anymotion-agent/anymotion package.
#
# Patches:
#   1. x-opencode-session header — adds session ID + user-agent for OpenCode Go API
#   2. page.goto timeout — increases Puppeteer navigation timeout 30s → 120s
#
# Safe to run multiple times (idempotent). Detects already-patched files.
#
# Usage:
#   bash scripts/anymotion-patch.sh              # auto-detect anymotion path
#   bash scripts/anymotion-patch.sh /abs/path    # explicit path to package root
#
set -euo pipefail

# ── Locate the Anymotion package ──────────────────────────────────────────────
find_anymotion_root() {
  if [[ -n "${1:-}" && -d "$1" ]]; then
    echo "$1"
    return
  fi
  # Try the global node_modules path (nvm / npm global)
  local candidate
  candidate="$(npm root -g 2>/dev/null)/@anymotion-agent/anymotion"
  if [[ -d "$candidate" ]]; then
    echo "$candidate"
    return
  fi
  # Fallback: common nvm path
  for v in /home/*/.nvm/versions/node/*/lib/node_modules/@anymotion-agent/anymotion; do
    if [[ -d "$v" ]]; then echo "$v"; return; fi
  done
  echo "" >&2
  echo "✗ Could not locate @anymotion-agent/anymotion in global node_modules." >&2
  echo "  Pass the package root as the first argument, or install it first:" >&2
  echo "    npm install -g @anymotion-agent/anymotion" >&2
  exit 1
}

ROOT="$(find_anymotion_root "${1:-}")"
AGENT_DIR="$ROOT/src/agent"
TOOLS_DIR="$ROOT/src/agent/tools"

echo "📦 Anymotion package: $ROOT"
echo ""

PATCHED=0
SKIPPED=0

patch_file() {
  # patch_file <file> <search> <replace> <label>
  local file="$1" search="$2" replace="$3" label="$4"
  if [[ ! -f "$file" ]]; then
    echo "  ⚠ $label — file not found: $file (skipped)"
    SKIPPED=$((SKIPPED + 1))
    return
  fi
  if grep -qF "$replace" "$file" 2>/dev/null; then
    echo "  ✓ $label — already patched"
    SKIPPED=$((SKIPPED + 1))
    return
  fi
  if ! grep -qF "$search" "$file" 2>/dev/null; then
    echo "  ⚠ $label — search string not found in $file (skipped)"
    SKIPPED=$((SKIPPED + 1))
    return
  fi
  # macOS sed requires '' after -i; GNU sed does not. Handle both.
  if sed --version >/dev/null 2>&1; then
    sed -i "s|${search}|${replace}|g" "$file"
  else
    sed -i '' "s|${search}|${replace}|g" "$file"
  fi
  echo "  ✓ $label — patched"
  PATCHED=$((PATCHED + 1))
}

# ── Patch 1: x-opencode-session header ────────────────────────────────────────
echo "── Patch 1: x-opencode-session header ──"

# Create the session header helper module (idempotent)
SESSION_FILE="$AGENT_DIR/opencode-session.js"
if [[ -f "$SESSION_FILE" ]]; then
  echo "  ✓ opencode-session.js — already exists"
else
  cat > "$SESSION_FILE" << 'SESSION_EOF'
/**
 * opencode-session.js — Adds the x-opencode-session header required by
 * the OpenCode Go / Zen proxy. Session ID is generated once per process.
 */
import crypto from "node:crypto";

const SESSION_ID = crypto.randomUUID();

export function opencodeSessionHeaders(provider) {
  if (provider === "opencode-go" || provider === "opencode-zen") {
    return {
      "x-opencode-session": SESSION_ID,
      "user-agent": `Anymotion/1.1.2 (opencode-session/${SESSION_ID.slice(0, 8)})`,
    };
  }
  return {};
}
SESSION_EOF
  echo "  ✓ opencode-session.js — created"
  PATCHED=$((PATCHED + 1))
fi

# Patch agent-loop.js — import + spread headers
AL="$AGENT_DIR/agent-loop.js"
if grep -q 'opencodeSessionHeaders\|opencode-session' "$AL" 2>/dev/null; then
  echo "  ✓ agent-loop.js — already patched"
else
  # Add import
  if grep -q 'withStallGuard' "$AL"; then
    sed -i "0,/^import.*withStallGuard/s|^import.*withStallGuard|&\nimport { opencodeSessionHeaders } from \"./opencode-session.js\";|" "$AL"
    echo "  ✓ agent-loop.js — import added"
    PATCHED=$((PATCHED + 1))
  else
    echo "  ⚠ agent-loop.js — could not find withStallGuard import (skipped)"
  fi
  # Spread headers into the headers object (after Authorization line)
  AL_SEARCH="'Authorization': \`Bearer \${apiKey}\`,"
  AL_REPLACE="'Authorization': \`Bearer \${apiKey}\`,\n    ...opencodeSessionHeaders(provider)"
  patch_file "$AL" "$AL_SEARCH" "$AL_REPLACE" "agent-loop.js session headers"
fi

# Patch ai-engine.js — import + spread headers
AE="$AGENT_DIR/ai-engine.js"
if grep -q 'opencodeSessionHeaders\|opencode-session' "$AE" 2>/dev/null; then
  echo "  ✓ ai-engine.js — already patched"
else
  if grep -q 'withStallGuard' "$AE"; then
    sed -i "0,/^import.*withStallGuard/s|^import.*withStallGuard|&\nimport { opencodeSessionHeaders } from \"./opencode-session.js\";|" "$AE"
    echo "  ✓ ai-engine.js — import added"
    PATCHED=$((PATCHED + 1))
  else
    echo "  ⚠ ai-engine.js — could not find withStallGuard import (skipped)"
  fi
  AE_SEARCH="'Authorization': \`Bearer \${apiKey}\`,"
  AE_REPLACE="'Authorization': \`Bearer \${apiKey}\`,\n    ...opencodeSessionHeaders(provider)"
  patch_file "$AE" "$AE_SEARCH" "$AE_REPLACE" "ai-engine.js session headers"
fi

# ── Patch 2: page.goto timeout 30s → 120s ────────────────────────────────────
echo ""
echo "── Patch 2: Puppeteer page.goto timeout ──"

MT="$TOOLS_DIR/motion-tools.js"
patch_file "$MT" "timeout: 30_000" "timeout: 120_000" "motion-tools.js page.goto timeout"

# ── Summary ────────────────────────────────────────────────────────────────────
echo ""
echo "── Result ──"
echo "  Patched: $PATCHED  |  Already OK / Skipped: $SKIPPED"
if [[ $PATCHED -gt 0 ]]; then
  echo "  ✓ Patches applied. Restart any running Anymotion processes."
else
  echo "  ✓ All patches already in place."
fi
