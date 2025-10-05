set -e

echo "→ Linking theme polish CSS…"
F="src/layouts/Base.astro"
[ -f "$F" ] || { echo "Missing $F"; exit 1; }
cp "$F" "$F.bak.$(date +%Y%m%d-%H%M%S)"

# Remove any existing jcs-tweaks link (to avoid duplicates), then insert it
# after layout-basics.css if present, otherwise before </head>
sed -i '' -e '/\/css\/jcs-tweaks\.css/d' "$F"
if grep -q '/css/layout-basics\.css' "$F"; then
  sed -i '' -e '/\/css\/layout-basics\.css/ a\
  <link rel="stylesheet" href="/css/jcs-tweaks.css">
' "$F"
else
  sed -i '' -e '/<\/head>/ i\
  <link rel="stylesheet" href="/css/jcs-tweaks.css">
' "$F"
fi

echo "→ Ensuring theme tint styles exist…"
mkdir -p public/css
cat >> public/css/jcs-tweaks.css <<'CSS'
/* --- JCS THEME TINTS v2 --- */
:root{--ink:#0f172a;--bdr:rgba(15,23,42,.12)}
/* Service cards: soft brand wash (not flat white) */
.service-card{
  background: linear-gradient(180deg, rgba(79,70,229,.04), rgba(124,58,237,.03));
  border: 1px solid var(--bdr);
}
/* Testimonials: subtle tint */
.card.testimonial,.testimonial{
  background: linear-gradient(180deg, rgba(79,70,229,.05), rgba(124,58,237,.03));
  border: 1px solid rgba(15,23,42,.14);
}
/* Section backgrounds to match your gradient brand */
section.services{ background: #fafaff; }
section.process { background: #f7f7ff; }
.stats .stat strong{ text-shadow: 0 1px 0 rgba(0,0,0,.06); }

/* Buttons pop (but stay on-brand) */
.btn-primary{ box-shadow: 0 10px 30px rgba(79,70,229,.22); }
.btn-primary:hover{ transform: translateY(-1px); }

/* Softer reveal feel (works with motion.js) */
.r{ opacity:0; transform:translateY(12px); }
.r.in{ opacity:1; transform:none; transition: opacity .55s ease, transform .55s ease; }

/* Kill big white gap after hero */
section.hero{ padding-block-end: clamp(24px, 4vw, 56px); }
section.hero + section{ margin-block-start: 0 !important; }
CSS

echo "→ Cleaning duplicate 'mag' classes on CTAs…"
for f in \
  src/pages/index.astro \
  src/components/HeroAnimated.astro \
  src/components/HeroVideo.astro \
  src/components/ContactForm.astro
do
  [ -f "$f" ] && sed -i '' -E 's/\bmag([[:space:]]+mag)+/mag/g' "$f" || true
done

echo "→ Verifying:"
grep -n '/css/jcs-tweaks.css' src/layouts/Base.astro || true
grep -R -- '<a [^>]*class="[^"]*btn[^"]*mag' -n src | sed -n '1,20p' || true
grep -R -- 'data-scramble=' -n src | sed -n '1,12p' || true

echo "→ Build & preview…"
npm run build
npm run preview -- --port 4000
