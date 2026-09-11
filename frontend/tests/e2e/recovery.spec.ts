import { expect, test } from "@playwright/test";

test("pauses and offers a resume path after refresh", async ({ page }) => {
  await page.goto("/levels");
  await page.getByRole("button", { name: /First Steps/ }).click();
  await page.getByRole("button", { name: /Pause game/ }).click();
  await expect(page.getByRole("dialog", { name: "Paused" })).toBeVisible();
  await page.getByRole("button", { name: "Resume" }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: /Pick up where you left off/ }),
  ).toBeVisible();
});
