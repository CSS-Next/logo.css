#!/usr/bin/env -S deno run -A
// @ts-check

import { Resvg } from "npm:@resvg/resvg-js";
import {
  ImageMagick,
  initialize,
  MagickColor,
  MagickFormat,
} from "https://deno.land/x/imagemagick_deno@0.0.31/mod.ts";

const [png] = await Promise.all(
  ["css.svg", "css.light.svg", "css.dark.svg"].map(async (path) => {
    const png = await svg2png(path);
    const out = path.replace(".svg", ".png");
    await Deno.writeFile(out, png);
    console.log(`Generated ${out}`);
    return png;
  }),
);

await initialize();

await ImageMagick.read(png, async (image) => {
  // Alpha is not supported in JPEG
  image.colorAlpha(new MagickColor(102, 51, 153, 1));
  // so we cannot get the rounded corners
  const filename = "css.square.jpg";
  await image.write(
    MagickFormat.Jpeg,
    (data) => Deno.writeFile(filename, data),
  );
  console.log(`Generated ${filename}`);
});

await ImageMagick.read(png, async (image) => {
  const filename = "css.jxl";
  await image.write(
    MagickFormat.Jxl,
    (data) => Deno.writeFile(filename, data),
  );
  console.log(`Generated ${filename}`);
});

await ImageMagick.read(png, async (image) => {
  const filename = "css.avif";
  await image.write(
    MagickFormat.Avif,
    (data) => Deno.writeFile(filename, data),
  );
  console.log(`Generated ${filename}`);
});

await ImageMagick.read(png, async (image) => {
  const filename = "css.webp";
  await image.write(
    MagickFormat.WebP,
    (data) => Deno.writeFile(filename, data),
  );
  console.log(`Generated ${filename}`);
});

await ImageMagick.read(png, async (image) => {
  // this is the maximum size for ICO
  image.resize(128, 128);
  const filename = "css.ico";
  await image.write(
    MagickFormat.Jpeg,
    (data) => Deno.writeFile(filename, data),
  );
  console.log(`Generated ${filename}`);
});

/**
 * @param {string} path
 * @returns {Promise<Uint8Array>}
 */
async function svg2png(path) {
  const svg = await Deno.readTextFile(path);
  const resvg = new Resvg(svg, { font: { loadSystemFonts: false } });
  return resvg.render().asPng();
}
