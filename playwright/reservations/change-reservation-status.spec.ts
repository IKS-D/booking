import { test, expect } from "@playwright/test";

test("Change reservation status", async ({ page }) => {
  const reservationId = "540";

  await page.goto("/reservations/host");

  const noReservationsLocator = page.locator("text=You have no reservations");

  if (await noReservationsLocator.isVisible()) {
    return;
  }

  await page.locator("td:nth-child(8) > .relative > span").nth(1).click();

  const toastLocator = page.getByText(/^Reservation \d+ confirmed!$/);

  await expect(toastLocator).toBeVisible();
});
