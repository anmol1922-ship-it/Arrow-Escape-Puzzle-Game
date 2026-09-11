import { expect, test } from "@playwright/test";

test("persists completion and settings on the same device", async ({
  page,
}) => {
  await page.goto("/levels");
  await page.getByRole("button", { name: /First Steps/ }).click();
  await page.getByRole("button", { name: /row 2, column 2/ }).click();
  await page.getByRole("button", { name: /row 2, column 1/ }).click();
  await page.getByRole("button", { name: /row 1, column 4/ }).click();
  await expect(
    page.getByRole("heading", { name: "Clean escape." }),
  ).toBeVisible();
  await page.goto("/levels");
  await expect(
    page.getByRole("button", { name: /First Steps, easy/ }),
  ).toContainText("★");
  await page.goto("/settings");
  await page.getByRole("checkbox", { name: /Sound effects/ }).uncheck();
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: /Sound effects/ }),
  ).not.toBeChecked();
});
