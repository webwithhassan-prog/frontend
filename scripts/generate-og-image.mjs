import sharp from "sharp";
import path from "path";

// The link-preview image (og:image / twitter:image) for WhatsApp, Facebook,
// X and search. 1200x630 is the size those platforms crop to. Text-only:
// the logo file is too small (~55px mark) to enlarge without blurring.
const outFile = path.resolve(import.meta.dirname, "../public/og-image.png");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#12224a"/>
  <circle cx="1080" cy="90" r="260" fill="#2c44d1" opacity="0.35"/>
  <circle cx="1150" cy="600" r="180" fill="#f76b1c" opacity="0.18"/>
  <rect x="96" y="176" width="72" height="8" rx="4" fill="#f76b1c"/>
  <text x="96" y="290" font-family="Arial, Helvetica, sans-serif" font-size="104" font-weight="800" fill="#ffffff" letter-spacing="2">FITNESS <tspan fill="#f76b1c">ZONE</tspan></text>
  <text x="96" y="370" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="#ffffff">Dietplans &amp; Home Workouts for Women</text>
  <text x="96" y="432" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#eaf1ff" opacity="0.8">Female trainers · Live sessions from home · One platform</text>
  <text x="96" y="548" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#ffc93c">fitnesszone.ltd</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outFile);
console.log("Generated public/og-image.png");
