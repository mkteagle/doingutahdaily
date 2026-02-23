import fs from "fs-extra";
import path from "path";

async function copyImages() {
  const contentDir = path.join(process.cwd(), "content");
  const publicDir = path.join(process.cwd(), "public");

  try {
    // Get all blog directories
    const blogDir = path.join(contentDir, "blog");
    const postDirs = await fs.readdir(blogDir);

    // Create the base assets/blog directory in public
    await fs.ensureDir(path.join(publicDir, "assets", "blog"));

    for (const postDir of postDirs) {
      const sourcePath = path.join(blogDir, postDir);
      const stat = await fs.stat(sourcePath);

      if (stat.isDirectory()) {
        // Create corresponding directory in public/assets/blog
        const targetDir = path.join(publicDir, "assets", "blog", postDir);
        await fs.ensureDir(targetDir);

        // Read all files in the post directory
        const files = await fs.readdir(sourcePath);

        // Copy image files
        for (const file of files) {
          if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
            const sourceFile = path.join(sourcePath, file);
            const targetFile = path.join(targetDir, file);
            await fs.copy(sourceFile, targetFile);
            console.log(`✓ Copied: ${postDir}/${file}`);
          }
        }
      }
    }

    console.log("\n✅ All images copied successfully");
  } catch (error) {
    console.error("\n❌ Error copying images:", error);
    process.exit(1);
  }
}

copyImages();
