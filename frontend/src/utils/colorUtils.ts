/**
 * Color utility functions for the Practice Journal App
 */

/**
 * Determines if a color is light or dark based on its luminance
 * @param hexColor - Hex color code (e.g. #FFFFFF)
 * @returns true if the color is light, false if it's dark
 */
export function isLightColor(hexColor: string): boolean {
  // Remove the hash if it exists
  const color = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate luminance using the formula: 0.299*R + 0.587*G + 0.114*B
  // This gives more weight to green as human eyes are more sensitive to it
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // If luminance is greater than 0.5, the color is considered light
  return luminance > 0.5;
}

/**
 * Gets the appropriate text color (black or white) based on background color
 * @param backgroundColor - Hex color code of the background
 * @returns '#000000' for dark text or '#FFFFFF' for light text
 */
export function getTextColorForBackground(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}
