import sharp from "sharp";
import path from "path";

const srcLogo = path.resolve(import.meta.dirname, "../src/assets/logo.jpeg");
const outDir = path.resolve(import.meta.dirname, "../public");
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// The source file has a lot of built-in white margin around the mark itself
// (a ~170x177 mark on a 500x500 canvas) — composing it straight onto an
// icon canvas would read as a tiny, sparse icon on a home screen. Trim that
// margin first, then re-pad deliberately for each icon's own safe zone.
const trimmedLogo = () => sharp(srcLogo).trim();

const makeIcon = async (canvasSize, contentRatio, fileName) => {
  const contentSize = Math.round(canvasSize * contentRatio);
  const logoBuffer = await trimmedLogo()
    .resize(contentSize, contentSize, { fit: "contain", background: WHITE })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: WHITE,
    },
  })
    .composite([
      {
        input: logoBuffer,
        left: Math.round((canvasSize - contentSize) / 2),
        top: Math.round((canvasSize - contentSize) / 2),
      },
    ])
    .png()
    .toFile(path.join(outDir, fileName));
};

const run = async () => {
  // Regular icons: fill most of the canvas — these aren't cropped by the OS.
  await makeIcon(192, 0.88, "icon-192.png");
  await makeIcon(512, 0.88, "icon-512.png");
  // Maskable: the OS crops to a shape (circle, squircle, etc.), so the mark
  // must sit inside the safe zone — the inner ~80% of the canvas.
  await makeIcon(512, 0.7, "maskable-512.png");

  console.log("Generated icon-192.png, icon-512.png, maskable-512.png");
};

run();
