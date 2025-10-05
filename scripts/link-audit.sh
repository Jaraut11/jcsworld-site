#!/usr/bin/env bash
set -euo pipefail

red(){ printf "\033[31m%s\033[0m\n" "$*"; }
grn(){ printf "\033[32m%s\033[0m\n" "$*"; }
ylw(){ printf "\033[33m%s\033[0m\n" "$*"; }

fail=0

# Build unless skipped
if [ "${LINK_AUDIT_SKIP_BUILD:-}" != "1" ] && [ -f package.json ]; then
  if command -v jq >/dev/null 2>&1 && jq -e '.scripts.build' package.json >/dev/null 2>&1; then
    ylw "→ Running build so compiled output can be audited too…"
    npm run -s build >/dev/null || true
  fi
fi

# Collect files to scan
FILES="$(mktemp)"; trap 'rm -f "$FILES"' EXIT
find src dist .vercel -type f \( -name '*.astro' -o -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.md' -o -name '*.mdx' -o -name '*.html' -o -name '*.mjs' \) \
  -print > "$FILES"

# Helper: scan a list of files with a Perl/PCRE pattern and print each file once on first match
scan_files() {
  local pattern="$1" out="$(mktemp)"; trap 'rm -f "$out"' RETURN
  while IFS= read -r f; do
    [ -s "$f" ] || continue
    perl -0777 -ne "if (m{$pattern}s) { print \$ARGV, qq{\n}; exit }" "$f" 2>/dev/null || true
  done < "$FILES" | sort -u
}

# 1) Bare wa.me **anchors** (missing ?text=)  — ignore JSON-LD etc.
bare_files="$(scan_files '<a[^>]+href="https://wa\.me/918920152372(?!\?text=)[^"]*"')"
if [ -n "$bare_files" ]; then
  red "❌ Bare wa.me anchors (missing ?text=) found in:"
  printf '   • %s\n' $bare_files
  fail=1
else
  grn "✅ No bare wa.me anchors"
fi

# 2) wa.me anchors missing rel="noopener"
norel_files="$(scan_files '<a[^>]+href="https://wa\.me/918920152372[^"]*"(?![^>]*\brel=)')"
if [ -n "$norel_files" ]; then
  red "❌ wa.me anchors missing rel=\"noopener\" in:"
  printf '   • %s\n' $norel_files
  fail=1
else
  grn '✅ All wa.me anchors have rel="noopener"'
fi

# 3) og:site_name exact value
if [ -f src/components/BaseHead.astro ]; then
  if grep -q '<meta property="og:site_name" content="JCS — Accounts, HR & Compliance"' src/components/BaseHead.astro; then
    grn "✅ og:site_name is correct"
  else
    red "❌ og:site_name not set to 'JCS — Accounts, HR & Compliance' in src/components/BaseHead.astro"
    fail=1
  fi
fi

# 4) Warn about stray backups in src/pages
if [ -d src/pages ]; then
  bak_list="$(find src/pages -maxdepth 1 -type f -name '*.bak*' 2>/dev/null | sort -u || true)"
  if [ -n "$bak_list" ]; then
    ylw "⚠️  Backup-like files in src/pages (rename with leading underscore or move to _backups/):"
    printf '   • %s\n' $bak_list
  fi
fi

exit $fail
