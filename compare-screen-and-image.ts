import { Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export async function compareScreenWithImage(
  page: Page,
  referenceImageBuffer: Buffer,
  options = {
    threshold: 0.1,      // Matching threshold (0-1), lower means more strict
    allowedDiffPercent: 5  // Maximum allowed difference percentage
  }
): Promise<{ matches: boolean; diffPercentage: number }> {
  // Get current screenshot as PNG buffer
  const screenBuffer = await page.screenshot({ type: 'png' });
  
  // Convert buffers to PNG instances
  const currentImage = PNG.sync.read(screenBuffer);
  const referenceImage = PNG.sync.read(referenceImageBuffer);

  // Create output PNG for diff
  const { width, height } = currentImage;
  const diffImage = new PNG({ width, height });

  // Compare images using pixelmatch
  const diffPixels = pixelmatch(
    currentImage.data,
    referenceImage.data,
    diffImage.data,
    width,
    height,
    {
      threshold: options.threshold,
      includeAA: true,  // Handle anti-aliased pixels
      alpha: 0.1,       // Alpha channel tolerance
    }
  );

  // Calculate difference percentage
  const totalPixels = width * height;
  const diffPercentage = (diffPixels / totalPixels) * 100;

  return {
    matches: diffPercentage <= options.allowedDiffPercent,
    diffPercentage
  };
}
