import { expect, test } from "@playwright/test";

const viewports = [
  [360, 640],
  [375, 667],
  [390, 844],
  [412, 915],
  [768, 1024],
  [1280, 720],
  [1366, 768],
  [1440, 900],
  [1920, 1080],
] as const;

for (const [width, height] of viewports) {
  test(`has no horizontal overflow at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/home");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(
      await page.evaluate(() => document.documentElement.clientWidth),
    );
    await page.getByRole("button", { name: /Play now/ }).click();
    await page.getByRole("button", { name: /First Steps/ }).click();
    const board = page.locator(".game-board");
    const box = await board.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(width);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(
      await page.evaluate(() => document.documentElement.clientWidth),
    );
  });
}
