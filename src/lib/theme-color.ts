/** Reads a colour from the shared theme in `globals.css`. */
export function readThemeColor(cssVariableName: string, fallbackColor: string) {
  if (typeof window === "undefined") return fallbackColor;
  const themeColor = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVariableName)
    .trim();
  return themeColor || fallbackColor;
}

function hexChannel(hex: string, start: number) {
  return Number.parseInt(hex.slice(start, start + 2), 16);
}

/** Blends two `#rrggbb` theme colours. `amount` 0 stays at `fromColor`. */
export function mixThemeColors(fromColor: string, toColor: string, amount: number) {
  const normalize = (color: string) => {
    const hex = color.trim().replace("#", "");
    return hex.length === 3
      ? hex
          .split("")
          .map((character) => character + character)
          .join("")
      : hex;
  };
  const from = normalize(fromColor);
  const to = normalize(toColor);
  if (from.length !== 6 || to.length !== 6) return fromColor;
  const blend = (start: number) =>
    Math.round(
      hexChannel(from, start) +
        (hexChannel(to, start) - hexChannel(from, start)) * amount,
    );
  return `rgb(${blend(0)} ${blend(2)} ${blend(4)})`;
}
