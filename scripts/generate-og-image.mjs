import sharp from "sharp";
import path from "path";

// The link-preview image (og:image / twitter:image). 1200x630 is what
// Facebook, X and search show in full — but WhatsApp crops it to a square
// from the centre, so all the text sits inside the middle 630x630 and only
// decoration lives in the outer bands. Text-only: the logo file is too
// small (~55px mark) to enlarge without blurring.
const outFile = path.resolve(import.meta.dirname, "../public/og-image.png");

const font = "Arial, Helvetica, sans-serif";
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#12224a"/>
  <circle cx="90" cy="90" r="230" fill="#2c44d1" opacity="0.35"/>
  <circle cx="1130" cy="560" r="230" fill="#2c44d1" opacity="0.3"/>
  <circle cx="1120" cy="70" r="120" fill="#f76b1c" opacity="0.16"/>
  <circle cx="80" cy="580" r="110" fill="#f76b1c" opacity="0.14"/>
  <rect x="560" y="118" width="80" height="8" rx="4" fill="#f76b1c"/>
  <text x="600" y="255" text-anchor="middle" font-family="${font}" font-size="118" font-weight="800" fill="#ffffff" letter-spacing="3">FITNESS</text>
  <text x="600" y="375" text-anchor="middle" font-family="${font}" font-size="118" font-weight="800" fill="#f76b1c" letter-spacing="3">ZONE</text>
  <text x="600" y="446" text-anchor="middle" font-family="${font}" font-size="36" font-weight="700" fill="#ffffff">Dietplans &amp; Home Workouts</text>
  <text x="600" y="492" text-anchor="middle" font-family="${font}" font-size="36" font-weight="700" fill="#ffffff">for Women</text>
  <text x="600" y="556" text-anchor="middle" font-family="${font}" font-size="26" font-weight="700" fill="#ffc93c">fitnesszone.ltd</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outFile);
console.log("Generated public/og-image.png");
