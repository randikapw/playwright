import { Page } from '@playwright/test';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

export async function saveScreenshot(
  page: Page,
  filePath: string,
  options = {
    fullPage: false,
    createDirIfNotExist: true
  }
): Promise<void> {
  try {
    // Ensure the directory exists
    if (options.createDirIfNotExist) {
      const dir = dirname(filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }

    // Take screenshot
    const screenBuffer = await page.screenshot({ 
      type: 'png',
      path: filePath,
      fullPage: options.fullPage
    });

  } catch (error) {
    throw new Error(`Failed to save screenshot to ${filePath}: ${error.message}`);
  }
} 