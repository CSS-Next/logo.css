#!/usr/bin/env -S deno run -A
// @ts-check

import sharp from "npm:sharp@0.33.5";

// Names of the SVGs to use for generation
const logoFileNames = ["css", "css.square", "css.dark", "css.light"];

// Start the generation process for each logo
for (const logoFileName of logoFileNames) {
  // Extract the type of the logo, when the type is not provided it defaults to "primary"
  const [logoName, logoType = "primary"] = logoFileName.split(".");

  // Load the SVG file into sharp
  const image = await sharp(`${logoFileName}.svg`);

  // Specify and prepare the output folder
  const outputFolder = `./${logoType}`;

  // Remove the output folder if it exists
  try {
    await Deno.remove(outputFolder, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  await Deno.mkdir(outputFolder);

  const formats = ["png", "webp", "avif"];

  // Generate the different formats for the logo
  for (const format of formats) {
    const result = image.toFormat(format, {
      lossless: true,
    });

    result.resize(1000, 1000).toFile(`${outputFolder}/${logoName}.${format}`);

    if (format === "png") {
      result.resize(32, 32).toFile(`${outputFolder}/${logoName}.ico`);
    }
  }
}
