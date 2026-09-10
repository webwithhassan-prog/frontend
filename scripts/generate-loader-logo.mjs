import sharp from "sharp";
import path from "path";

const srcLogo = path.resolve(import.meta.dirname, "../src/assets/logo.jpeg");
const outFile = path.resolve(import.meta.dirname, "../src/assets/logo-mark.png");
const CANVAS_SIZE = 300;
const FILL_RATIO = 0.92;
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const run = async () => {
  const contentSize = Math.round(CANVAS_SIZE * FILL_RATIO);
  const trimmed = await sharp(srcLogo)
    .trim()
    .resize(contentSize, contentSize, { fit: "contain", background: WHITE })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      channels: 4,
      background: WHITE,
    },
  })
    .composite([
      {
        input: trimmed,
        left: Math.round((CANVAS_SIZE - contentSize) / 2),
        top: Math.round((CANVAS_SIZE - contentSize) / 2),
      },
    ])
    .png()
    .toFile(outFile);

  console.log("Generated logo-mark.png");
};

run();
