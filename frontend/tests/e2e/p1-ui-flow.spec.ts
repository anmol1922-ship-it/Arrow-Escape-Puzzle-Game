import { expect, test } from "@playwright/test";

test("P1 board feedback is immediate, directional, and offline-capable", async ({
  page,
  context,
}) => {
  await page.goto("/home");
  await context.setOffline(true);
  await page.getByRole("button", { name: /Play now/ }).click();
  await page.getByRole("button", { name: /First Steps/ }).click();

  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const blocked = page.getByRole("button", {
    name: /row 2, column 1.*right/i,
  });
  await blocked.click();
  await expect(blocked).toHaveClass(/arrow-state-blocked/);
  await expect(page.getByRole("status")).toContainText("blocked");
  await expect(blocked).not.toHaveClass(/arrow-state-blocked/);

  const clear = page.getByRole("button", {
    name: /row 2, column 2.*right/i,
  });
  await clear.click();
  await expect(page.locator('[data-testid="departure-a2"]')).toHaveClass(
    /arrow-state-escaping/,
  );
  await expect(page.locator('[data-testid="departure-a2"]')).toBeVisible();
  expect(consoleErrors).toEqual([]);
});
