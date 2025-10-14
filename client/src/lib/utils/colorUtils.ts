export function getVibrancyMultiplier(streak: number): number {
  // Progressive vibrancy based on streak
  // 0 days = 0% vibrancy (grayscale)
  // 30 days = 100% vibrancy (full color)
  return Math.min(1, streak / 30);
}

export function getProgressiveColor(
  baseHue: number, 
  streak: number, 
  baseSaturation = 0.6, 
  baseLightness = 0.5
): string {
  const vibrancy = getVibrancyMultiplier(streak);
  const saturation = baseSaturation * vibrancy;
  const lightness = baseLightness + (vibrancy * 0.2);
  
  return `hsl(${baseHue}, ${saturation * 100}%, ${lightness * 100}%)`;
}

export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s, l];
}

export function interpolateColors(color1: string, color2: string, factor: number): string {
  // Simple color interpolation between two HSL colors
  const [h1, s1, l1] = hexToHsl(color1.startsWith('#') ? color1 : '#808080');
  const [h2, s2, l2] = hexToHsl(color2.startsWith('#') ? color2 : '#ff6b6b');
  
  const h = h1 + (h2 - h1) * factor;
  const s = s1 + (s2 - s1) * factor;
  const l = l1 + (l2 - l1) * factor;
  
  return `hsl(${h}, ${s * 100}%, ${l * 100}%)`;
}
