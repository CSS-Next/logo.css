#!/usr/bin/env -S deno run -A
// @ts-check

import sharp from "npm:sharp@0.33.5";
import { DOMParser } from "npm:linkedom@0.18.5";

/** the text contained in the source SVG file */
const text = await Deno.readTextFile("css.svg");

// Names of the SVGs to use for generation
const logoFileNames = ["css", "css.square", "css.dark", "css.light"];

// Start the generation process for each logo
for (const logoFileName of logoFileNames) {
  const svg = new DOMParser().parseFromString(text, "image/svg+xml");

  const fg = svg.getElementById("fg");
  const bg = svg.getElementById("bg");
  const title = svg.getElementById("css-logo-title");
  const description = svg.getElementById("css-logo-description");

  switch (logoFileName) {
    case "css": {
      // this is the source logo, do nothing!
      break;
    }
    case "css.light": {
      title.innerHTML = "CSS Logo Light";
      description.innerHTML =
        "A white square with rounded corners and the letters CSS inside in black";
      fg.setAttribute("fill", "black");
      bg.setAttribute("fill", "white");
      break;
    }
    case "css.dark": {
      title.innerHTML = "CSS Logo Dark";
      description.innerHTML =
        "A black square with rounded corners and the letters CSS inside in white";
      fg.setAttribute("fill", "white");
      bg.setAttribute("fill", "black");
      break;
    }
    case "css.square": {
      title.innerHTML = "CSS Logo Square";
      description.innerHTML =
        "A purple square with the letters CSS inside in white";
      bg.setAttribute("d", "M0,0H1000V1000H0Z");
      break;
    }
  }

  // Extract the type of the logo, when the type is not provided it defaults to "primary"
  const [logoName, logoType = "primary"] = logoFileName.split(".");

  // overwrite the SVG files with the updated content
  await Deno.writeTextFile(
    `${logoFileName}.svg`,
    svg.toString().replace('<?xml version="1.0" encoding="utf-8"?>', ""),
  );

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
  }

  // Generate the small SVG for the favicon
  svg.documentElement.setAttribute("width", "32");
  svg.documentElement.setAttribute("height", "32");
  fg.setAttribute("transform", "scale(1.35) translate(-230 -230)");

  const smallSVGPath = `${logoFileName}.small.svg`;
  await Deno.writeTextFile(
    smallSVGPath,
    svg.toString().replace('<?xml version="1.0" encoding="utf-8"?>', "")
  );

  // Use sharp to render the `.ico` from the small SVG
  const smallImage = await sharp(smallSVGPath);
  await smallImage
    .resize(32, 32)
    .toFile(`${outputFolder}/${logoName}.ico`);
}
