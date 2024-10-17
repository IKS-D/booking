import { test, expect } from "@playwright/test";

test("Cancel reservation", async ({ page }) => {
  await page.goto("/reservations");

  const cancelButton = page
    .locator(
      'button:has-text("Cancel reservation"):not([data-disabled="true"])'
    )
    .first();

  await cancelButton.click();

  await page.waitForSelector('[role="dialog"]');

  await page.getByRole("button", { name: "Yes" }).click();

  const toastLocator = page.getByText(`Reservation cancelled successfully`);

  await expect(toastLocator).toBeVisible();
});
