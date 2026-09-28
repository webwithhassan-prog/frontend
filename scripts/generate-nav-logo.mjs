import sharp from "sharp";
import path from "path";

// The navbar's logo. logo.jpeg is the mark on a solid white square with
// wide margins; over the translucent sticky header that white box shows as
// a square whenever a coloured section scrolls underneath. This trims the
// margins and turns the white background transparent, easing the
// anti-aliased edge pixels out of white so no light fringe is left.
const srcLogo = path.resolve(import.meta.dirname, "../src/assets/logo.jpeg");
const outFile = path.resolve(import.meta.dirname, "../src/assets/logo-nav.png");
// The mark is only ~55px inside the 160px source, so this upscales; 128px
// covers the navbar's 40px at 3x screens.
const HEIGHT = 128;

const OPAQUE_BELOW = 185; // darkest channel at or below this: solid pixel
const CLEAR_ABOVE = 245; // darkest channel at or above this: background

const run = async () => {
  const { data, info } = await sharp(srcLogo)
    .trim({ threshold: 20 })
    .resize({ height: HEIGHT, fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (min >= CLEAR_ABOVE) {
      data[i + 3] = 0;
    } else if (min > OPAQUE_BELOW) {
      const alpha = (CLEAR_ABOVE - min) / (CLEAR_ABOVE - OPAQUE_BELOW);
      data[i + 3] = Math.round(alpha * 255);
      // Undo the blend with white: C = a*F + (1 - a)*255.
      for (let c = 0; c < 3; c++) {
        const f = 255 - (255 - data[i + c]) / alpha;
        data[i + c] = Math.max(0, Math.min(255, Math.round(f)));
      }
    }
  }

  await sharp(data, { raw: info })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(outFile);
  console.log(`Generated logo-nav.png (${info.width}x${info.height})`);
};

run();
