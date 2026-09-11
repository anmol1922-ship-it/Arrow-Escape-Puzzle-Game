import { expect, test } from "@playwright/test";

test("launches home, shows locked progression, and starts Level 1", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Every arrow has a way out." }),
  ).toBeVisible({ timeout: 3000 });
  await page.getByRole("button", { name: /Levels/ }).click();
  await expect(
    page.getByRole("button", { name: /Open Horizon, locked/ }),
  ).toBeDisabled();
  await page.getByRole("button", { name: /First Steps/ }).click();
  await expect(page.locator(".game-board")).toBeVisible();
});
