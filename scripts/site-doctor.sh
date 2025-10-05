#!/usr/bin/env bash
set -euo pipefail
MODE="${1:-audit}"   # audit | fix-layout | fix-motion | fix-hero | fix-phones | all
ts(){ date +"%Y%m%d-%H%M%S"; }
bkp(){ [ -f "$1" ] && cp "$1" "$1.bak.$(ts)" || true; }

say(){ printf "\n\033[1m▶ %s\033[0m\n" "$*"; }
ok(){  printf "  ✓ %s\n" "$*"; }
warn(){ printf "  ⚠ %s\n" "$*"; }
info(){ printf "  • %s\n" "$*"; }

HEADS=(src/layouts/Base.astro src/layouts/BlogPost.astro src/components/BaseHead.astro src/pages/index.astro)
INDEX="src/pages/index.astro"
LAY="src/layouts/Base.astro"

audit(){
  say "Astro pages using <head> (candidates)"
  grep -RIl "</head>" src 2>/dev/null | sed 's/^/  head: /' || true

  say "Backups that Astro might warn about"
  find src/pages -maxdepth 1 -type f -name '*.bak.*' -print | sed 's/^/  bak: /' || echo "  (none)"

  say "Layout flow (does Base.astro have <main> & footer order?)"
  if [ -f "$LAY" ]; then
    grep -n "<main" "$LAY" || warn "No <main> in $LAY"
    awk '/<main/{in=1} /<\/main>/{in=0} in&&/<footer/ && !p {print "  ⚠ footer appears inside <main> in "FILENAME; p=1}' "$LAY" || true
  else
    warn "$LAY not found"
  fi

  say "Linked assets (motion & layout)"
  for f in "${HEADS[@]}"; do
    [ -f "$f" ] || continue
    printf "  %s\n" "$f"
    grep -nE '/css/(motion|reveal|layout-basics|fix-footer)\.css' "$f" || echo "    (no extra CSS linked)"
    grep -nE '/js/(motion|reveal)\.js' "$f" || echo "    (no motion js linked)"
  done

  say "Files present"
  ls -1 public/css/motion.css public/js/motion.js 2>/dev/null | sed 's/^/  asset: /' || echo "  (no motion pack files here)"
  ls -1 public/css/layout-basics.css 2>/dev/null | sed 's/^/  asset: /' || true

  say "Hero checks (scramble / rotator)"
  if [ -f "$INDEX" ]; then
    grep -n 'data-scramble=' "$INDEX" || echo "  (no data-scramble in index)"
    grep -n '<span class="rotator"' "$INDEX" || true
  else warn "$INDEX not found"; fi

  say "WhatsApp & JSON-LD normalisation"
  grep -RIn "https://wa\.me/" src public 2>/dev/null | sed 's/^/  wa: /' | head -n 6 || echo "  (no wa.me links?)"
  grep -RIn '"telephone"' src public 2>/dev/null | sed 's/^/  tel: /' | head -n 6 || true

  say "Netlify/Vercel form routes sanity"
  grep -RIn '<form' src/pages src/components 2>/dev/null | sed 's/^/  form: /' | head -n 8 || true

  say "Done."
}

fix_layout(){
  [ -f "$LAY" ] || { warn "$LAY not found"; return; }
  bkp "$LAY"

  # Ensure <main> wraps <slot>
  if ! grep -q '<main' "$LAY"; then
    awk 'BEGIN{done=0}
      /<slot[[:space:]>]/ && done==0 { print "  <main>"; print "    "$0; print "  </main>"; done=1; next }
      { print }' "$LAY" > "$LAY.tmp" && mv "$LAY.tmp" "$LAY"
    ok "Wrapped <slot> with <main> in $LAY"
  else
    ok "<main> exists in $LAY"
  fi

  # Move footer after </main> if inside main
  awk '
    BEGIN{inm=0;cap=0}
    /<main/{inm=1}
    /<\/main/{inm=0}
    /<footer[^>]*>/ && inm==1 {cap=1; hold=$0 ORS; next}
    cap==1{
      hold=hold $0 ORS
      if ($0 ~ /<\/footer>/){ cap=0; next }
      next
    }
    {print}
    END{ if(hold!="") print hold }
  ' "$LAY" > "$LAY.tmp"; mv "$LAY.tmp" "$LAY"; ok "Footer placed after </main> (if needed)."

  # Link minimal layout CSS
  mkdir -p public/css
  cat > public/css/layout-basics.css <<'CSS'
html, body { height: 100%; }
body { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1 0 auto; }
CSS
  for f in "${HEADS[@]}"; do
    [ -f "$f" ] || continue
    bkp "$f"
    grep -q '/css/layout-basics.css' "$f" && continue
    awk 'BEGIN{done=0}
      /<\/head>/ && !done { print "  <!-- @layout-basics -->\n  <link rel=\"stylesheet\" href=\"/css/layout-basics.css\">"; print; done=1; next }
      { print }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  done
  ok "Linked layout-basics.css"
}

fix_motion(){
  # Expect motion pack to be in public/css/motion.css & public/js/motion.js
  if [ ! -f public/css/motion.css ] || [ ! -f public/js/motion.js ]; then
    warn "motion.css/js not both present. Skipping link."
  else
    for f in "${HEADS[@]}"; do
      [ -f "$f" ] || continue
      bkp "$f"
      grep -q '/css/motion.css' "$f" || awk 'BEGIN{d=0} /<\/head>/ && !d { print "  <link rel=\"stylesheet\" href=\"/css/motion.css\">"; print; d=1; next } {print}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
      grep -q '/js/motion.js' "$f"  || awk 'BEGIN{d=0} /<\/head>/ && !d { print "  <script defer src=\"/js/motion.js\"></script>"; print; d=1; next } {print}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    done
    ok "Ensured motion assets linked"
  fi
}

fix_hero(){
  [ -f "$INDEX" ] || { warn "$INDEX not found"; return; }
  bkp "$INDEX"
  # Replace old rotator span → scramble
  if grep -q '<span class="rotator"' "$INDEX"; then
    sed -i '' -E 's#<span class="rotator"[^>]*>[^<]*</span>#<span data-scramble="Penalties|Interest|Anxiety">Penalties</span>#' "$INDEX"
    ok "Replaced old rotator → data-scramble"
  fi
  # If hero has no scramble, append a safe heading at the end (non-destructive)
  if ! grep -q 'data-scramble=' "$INDEX"; then
    printf '\n<!-- @hero-scramble -->\n<h1 class="r">Stop <span data-scramble="Penalties|Interest|Anxiety">Penalties</span>, File On Time.</h1>\n' >> "$INDEX"
    ok "Appended minimal scramble heading (you can move it inside hero later)"
  else
    ok "Scramble already present"
  fi
}

fix_phones(){
  say "Normalizing WhatsApp links & JSON-LD to +918920152372"
  # wa.me
  grep -RIl "https://wa\.me/" src public 2>/dev/null | while read -r f; do
    bkp "$f"; sed -i '' -E 's#https://wa\.me/[0-9]+#https://wa.me/918920152372#g' "$f"
  done
  # telephone
  grep -RIl '"telephone"' src public 2>/dev/null | while read -r f; do
    bkp "$f"; sed -i '' -E 's/"telephone"\s*:\s*"\+?91[0-9]{10}"/"telephone": "+918920152372"/g' "$f"
  done
  # sameAs WA
  grep -RIl '"sameAs"' src public 2>/dev/null | while read -r f; do
    bkp "$f"; sed -i '' -E 's#https://wa\.me/[0-9]+#https://wa.me/918920152372#g' "$f"
  done
  ok "Numbers normalized"
}

fix_backups(){
  # Prefix backups so Astro ignores them
  find src/pages -maxdepth 1 -type f -name '*.bak.*' -print0 2>/dev/null | while IFS= read -r -d '' f; do
    base="$(basename "$f")"; dir="$(dirname "$f")"
    [[ "$base" == _* ]] || mv "$f" "$dir/_$base"
  done
  ok "Page backups hidden from Astro"
}

case "$MODE" in
  audit)       audit ;;
  fix-layout)  fix_layout ;;
  fix-motion)  fix_motion ;;
  fix-hero)    fix_hero ;;
  fix-phones)  fix_phones ;;
  all)         fix_layout; fix_motion; fix_hero; fix_phones; fix_backups; audit ;;
  *)           echo "Usage: scripts/site-doctor.sh [audit|fix-layout|fix-motion|fix-hero|fix-phones|all]"; exit 2 ;;
esac
