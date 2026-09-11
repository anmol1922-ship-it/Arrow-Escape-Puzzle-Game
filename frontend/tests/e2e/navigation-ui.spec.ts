import { expect, test } from "@playwright/test";

test("branded navigation exposes progression and rejects locked levels", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Find the clear path." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Every arrow has a way out." }),
  ).toBeVisible({
    timeout: 3000,
  });
  await page.getByRole("button", { name: /Levels/ }).click();
  await expect(
    page.getByRole("heading", { name: "Choose your path." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Open Horizon, locked/ }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: /First Steps/ }),
  ).toHaveAttribute("data-level-state", "current");
});
