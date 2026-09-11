import { expect, test } from "@playwright/test";

test("offline P1 flow supports blocked and valid moves through completion", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Every arrow has a way out." }),
  ).toBeVisible({ timeout: 3000 });
  await context.setOffline(true);
  await page.getByRole("button", { name: /Play now/ }).click();
  await page.getByRole("button", { name: /First Steps/ }).click();
  await page.getByRole("button", { name: /row 2, column 1/ }).click();
  await expect(page.getByRole("status")).toContainText("blocked");
  await expect(page.locator(".stat-strip strong").nth(1)).toHaveText("0/3");
  await page.getByRole("button", { name: /row 2, column 2/ }).click();
  await page.getByRole("button", { name: /row 2, column 1/ }).click();
  await page.getByRole("button", { name: /row 1, column 4/ }).click();
  await expect(
    page.getByRole("heading", { name: "Clean escape." }),
  ).toBeVisible();
  await expect(page.locator(".result-grid")).toContainText("BEST SCORE");
});
