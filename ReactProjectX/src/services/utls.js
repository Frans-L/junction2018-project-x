function desaturate(color, grey) {
  const fixedGrey = Math.max(Math.min(grey || 1, 1), 0);
  const colors = color
    .slice(4, -1)
    .split(',')
    .map(Number);
  const greyness = colors.reduce((p, c) => p + c) / 3;

  const newColor = colors.map(c => Math.round(c * (1 - fixedGrey) + greyness * fixedGrey));

  return `rgb(${newColor.join(',')})`;
}
