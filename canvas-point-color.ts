export async function getCanvasPointColor(
  page: Page,
  canvasSelector: string,
  x: number,
  y: number
): Promise<{ r: number; g: number; b: number; a: number }> {
  // First ensure the canvas exists
  const canvasLocator = page.locator(canvasSelector);
  await canvasLocator.waitFor({ state: 'attached' });

  // Get the color data using page.evaluate
  const color = await canvasLocator.evaluate(
    (canvas: HTMLCanvasElement, { xPos, yPos }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get 2D context from canvas');
      }

      const imageData = ctx.getImageData(xPos, yPos, 1, 1);
      const [r, g, b, a] = imageData.data;

      return {
        r: r,
        g: g,
        b: b,
        a: a / 255  // Convert alpha to 0-1 range
      };
    },
    { xPos: x, yPos: y }
  );

  return color;
}
