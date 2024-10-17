import { test, expect } from "@playwright/test";

test("Change reservation status", async ({ page }) => {
  const reservationId = "540";

  await page.goto("/reservations/host");

  await page.getByLabel(reservationId).getByRole("img").click();

  const toastLocator = page.getByText(
    `Reservation ${reservationId} confirmed!`
  );

  await expect(toastLocator).toBeVisible();
});
