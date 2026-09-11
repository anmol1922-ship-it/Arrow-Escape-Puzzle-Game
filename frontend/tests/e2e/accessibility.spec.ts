import { expect, test } from "@playwright/test";

test("keyboard focus, live feedback, and reduced motion remain usable", async ({
  page,
}) => {
  await page.goto("/levels");
  await page.getByRole("button", { name: /First Steps/ }).click();
  const blockedArrow = page.getByRole("button", { name: /row 2, column 1/ });
  await blockedArrow.focus();
  await expect(blockedArrow).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".board-status")).toContainText("blocked");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("body")).toBeVisible();
});
