
import { test, expect } from '@playwright/test';

test.describe('Whiteboard Functionality', () => {
  test('drawing and clear button works', async ({ page }) => {
    await page.goto('/');

    // Wait for canvas to be loaded
    await page.waitForSelector('canvas');

    // Get canvas element
    const canvas = page.locator('#whiteboard');

    // Take a screenshot of the empty canvas for comparison
    await expect(canvas).toHaveScreenshot('empty-canvas.png');

    // Get canvas bounding box
    const canvasBox = await canvas.boundingBox();

    expect(canvasBox).not.toBeNull();

    // Draw a simple line
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();

    // Verify drawing
    await expect(canvas).toHaveScreenshot('drawn-canvas.png');

    // Click the clear button
    await page.click('#clear');

    // Verify canvas is clear
    await expect(canvas).toHaveScreenshot('empty-canvas.png');
  });
});
