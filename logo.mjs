if (import.meta.main) {
  const settings = {
    w1: 16,
    h1: 19,
    h2: 19,
    t1: 8,
    t2: 12,
    t3: 24,
    r: 42,
    s: 16,
    k: 24,
  };
  await Deno.writeTextFile(
    "css.svg",
    draw({
      ...settings,
      fg: "white",
      bg: "rebeccapurple",
      id: "css",
      title: "CSS Logo",
      description:
        "A purple square with rounded corners and the letters CSS inside in white",
    }),
  );
  await Deno.writeTextFile(
    "css.square.svg",
    draw({
      ...settings,
      r: 0,
      fg: "white",
      bg: "rebeccapurple",
      id: "css-square",
      title: "CSS Logo Square",
      description: "A purple square and the letters CSS inside in white",
    }),
  );
  await Deno.writeTextFile(
    "css.light.svg",
    draw({
      ...settings,
      fg: "black",
      bg: "white",
      id: "css-light",
      title: "CSS Logo Light",
      description:
        "A white square with rounded corners and the letters CSS inside in black",
    }),
  );
  await Deno.writeTextFile(
    "css.dark.svg",
    draw({
      ...settings,
      fg: "white",
      bg: "black",
      id: "css-dark",
      title: "CSS Logo Dark",
      description:
        "A black square with rounded corners and the letters CSS inside in white",
    }),
  );
}

/**
 * Draw the CSS logo
 *
 * [Explore as an interactive version]( https://codepen.io/mxdvl/pen/zYgbKBe)
 *
 * @param {object} settings
 * @param {number} settings.id
 * @param {number} settings.title
 * @param {number} settings.description
 *
 * @param {string} settings.fg foreground color
 * @param {string} settings.bg background color
 *
 * @param {number} settings.w1 width
 *
 * @param {number} settings.h1 first height
 * @param {number} settings.h2 second height
 *
 * @param {number} settings.t1 first tension
 * @param {number} settings.t2 second tension
 * @param {number} settings.t3 third tension
 *
 * @param {number} settings.s stroke thickness
 * @param {number} settings.k letter kerning
 * @param {number} settings.r corner radius
 *
 * @returns {string} The SVG output
 */
export function draw({
  id,
  title,
  description,
  fg,
  bg,
  w1,
  h1,
  h2,
  t1,
  t2,
  t3,
  s,
  r,
  k,
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -120 240 240" width="240" fill="none" role="img" aria-labelledby="${id}-title ${id}-description">
  <title id="css-dark-title">${title}</title>
  <desc id="css-dark-description">${description}</desc>
  <path d="M-120,-120
      H${120 - r}
		  A ${r} ${r} 0 0 1 ${120} ${-120 + r}
			V${120 - r}
		  A ${r} ${r} 0 0 1 ${120 - r} ${120}
		  H${-120 + r}
		  A ${r} ${r} 0 0 1 ${-120} ${120 - r}
		  Z
  " fill="${bg}" />
  <g class="CSS"
    stroke-width="${s}" stroke="${fg}"
    transform="translate(${120 - k - w1} ${120 - h1 - h2 - k})"
  >
    <path class="C"
      transform="translate(-${w1 * 4 + k * 2} 0)"
      d="${drawC({ h1, h2, w1, t1, t2, t3 })}"
    />
    <path class="S"
      transform="translate(-${w1 * 2 + k * 1} 0)"
      d="${drawS({ h1, h2, w1, t1, t2, t3 })}"
    />
    <path class="S"
      transform="translate(-${w1 * 0 + k * 0} 0)"
      d="${drawS({ h1, h2, w1, t1, t2, t3 })}"
    />
  </g>
</svg>`;
}

/**
 * @param {object} options
 * @param {number} options.h1 vertical position of A, C, D & F
 * @param {number} options.h2 vertical position of B & E
 *
 * @param {number} options.w1 horizontal position of A, C, D & F
 *
 * @param {number} options.t1 outward control point of A, C, D & F
 * @param {number} options.t2 horizontal control point of B & E
 *
 * ```
 * .  ╋━w1━┫            ┯ ┯ D F
 * ╭──╴B╶──╮  ┳    t1 : │ │ │ │
 * │       │  h2        A C ┷ ┷
 * C       A  ╋
 * │          h1   t2 : ┠─╴B╶─┨
 * │   ╋      ┻         ┠─╴E╶─┨
 * │
 * D       F
 * │       │
 * ╰──╴E╶──╯
 * ```
 */
function drawC({ h1, h2, w1, t1, t2 }) {
  const [Ax, Ay] = [w1, -h1];
  const [Bx, By] = [0, -(h1 + h2)];
  const [Cx, Cy] = [-w1, -h1];
  const [Dx, Dy] = [-w1, h1];
  const [Ex, Ey] = [0, h1 + h2];
  const [Fx, Fy] = [w1, h1];
  return [
    `M ${[Ax, Ay]}`,
    `C ${[Ax, Ay - t1]} ${[Bx + t2, By]} ${[Bx, By]}`,
    `C ${[Bx - t2, By]} ${[Cx, Cy - t1]} ${[Cx, Cy]}`,
    `L ${[Dx, Dy]}`,
    `C ${[Dx, Dy + t1]} ${[Ex - t2, Ey]} ${[Ex, Ey]}`,
    `C ${[Ex + t2, Ey]} ${[Fx, Fy + t1]} ${[Fx, Fy]}`,
  ].join(" \n");
}

/**
 * @param {object} options
 * @param {number} options.h1 vertical position of A, C, D & F
 *
 * @param {number} options.h2 vertical position of B & E
 * @param {number} options.w1 horizontal position of A, C, D & F
 *
 * @param {number} options.t1 outward control point of A, C, D & F
 * @param {number} options.t2 horizontal control point of B & E
 * @param {number} options.t3 inward control point of C & D
 *
 * ```
 * .  ╋━w1━┫            ┯ ┯ D F
 * ╭──╴B╶──╮  ┳    t1 : │ │ │ │
 * │       │  h2        A C ┷ ┷
 * C       A  ╋
 * │          h1   t2 : ┠─╴B╶─┨
 * ╰───╂───╮  ┻         ┠─╴E╶─┨
 * .       │
 * F       D            C  ┯
 * │       │       t3 : │  │
 * ╰──╴E╶──╯            ┷  D
 * ```
 */
function drawS({ h1, h2, w1, t1, t2, t3 }) {
  const [Ax, Ay] = [w1, -h1];
  const [Bx, By] = [0, -(h1 + h2)];
  const [Cx, Cy] = [-w1, -h1];
  const [Dx, Dy] = [w1, h1];
  const [Ex, Ey] = [0, h1 + h2];
  const [Fx, Fy] = [-w1, h1];
  return [
    `M ${[Ax, Ay]}`,
    `C ${[Ax, Ay - t1]} ${[Bx + t2, By]} ${[Bx, By]}`,
    `C ${[Bx - t2, By]} ${[Cx, Cy - t1]} ${[Cx, Cy]}`,
    `C ${[Cx, Cy + t3]} ${[Dx, Dy - t3]} ${[Dx, Dy]}`,
    `C ${[Dx, Dy + t1]} ${[Ex + t2, Ey]} ${[Ex, Ey]}`,
    `C ${[Ex - t2, Ey]} ${[Fx, Fy + t1]} ${[Fx, Fy]}`,
  ].join(" \n");
}
