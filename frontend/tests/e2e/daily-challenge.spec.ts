import { expect, test } from "@playwright/test";

test("daily challenge is presented separately from standard levels", async ({
  page,
}) => {
  await page.goto("/daily");
  await expect(
    page.getByRole("heading", { name: "Daily challenge" }),
  ).toBeVisible();
  await expect(page.getByText(/Works offline/)).toBeVisible();
  await page.getByRole("button", { name: /Start today|Play again/ }).click();
  await expect(page.locator(".game-board")).toBeVisible();
});
