import { expect, test } from "@playwright/test";

test("AI coach failure stays friendly and playable", async ({ page }) => {
  await page.goto("/levels");
  await page.getByRole("button", { name: /First Steps/ }).click();
  await page.getByRole("button", { name: "Ask coach" }).click();
  await expect(page.locator(".hint-message")).toContainText(/path|hint|clear/i);
  await expect(
    page.getByText(/500|traceback|API key|Gemma error/i),
  ).toHaveCount(0);
  await page.getByRole("button", { name: /row 2, column 2/ }).click();
  await expect(page.locator(".stat-strip strong").nth(1)).toHaveText("1/3");
});
