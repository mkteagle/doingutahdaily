// scripts/generate-favicons.js
import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputSvg = path.join(process.cwd(), "app/icon.svg");
const outputDir = path.join(process.cwd(), "app");

async function generateFavicons() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(inputSvg);

    // Generate favicon.ico (32x32)
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFormat("png")
      .toFile(path.join(outputDir, "favicon.ico"));

    // Generate apple-icon.png (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .toFormat("png")
      .toFile(path.join(outputDir, "apple-icon.png"));

    console.log("Favicons generated successfully!");
  } catch (error) {
    console.error("Error generating favicons:", error);
  }
}

generateFavicons();
