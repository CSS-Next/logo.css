// @ts-check

import { Resvg } from "npm:@resvg/resvg-js";
import {
  ImageMagick,
  initialize,
  MagickFormat,
} from "https://deno.land/x/imagemagick_deno@0.0.31/mod.ts";

const svg = await Deno.readTextFile("css.svg");
const resvg = new Resvg(svg, { font: { loadSystemFonts: false } });
const png = resvg.render()
  .asPng();

await initialize();

const formats = [
  MagickFormat.Png,
  MagickFormat.Jpeg,
  MagickFormat.Jxl,
  MagickFormat.Avif,
  MagickFormat.WebP,
  MagickFormat.Ico,
];

for (const format of formats) {
  const filename = `css.${format.toLowerCase()}`;
  await ImageMagick.read(png, (image) => {
    if (format === MagickFormat.Ico) {
      image.resize(128, 128);
    }
    return image.write(
      format,
      (data) => Deno.writeFile(filename, data),
    );
  });

  console.log(`Generated ${filename}`);
}
