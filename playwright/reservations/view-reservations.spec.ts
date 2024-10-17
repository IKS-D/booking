import { test } from "@playwright/test";

test("View reservations", async ({ page }) => {
  await page.goto("/reservations");

  await page.waitForSelector('[alt="Listing"], [text="No reservations found"]');
});
