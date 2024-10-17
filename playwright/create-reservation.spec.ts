import { test, expect } from "@playwright/test";

test("Create reservation", async ({ page }) => {
  await page.goto("/listings");

  await page.getByAltText("Listing").first().click();
  await expect(page).toHaveURL(/listings\/.*/);

  await page.getByRole("button", { name: "Make a reservation" }).click();

  await page.getByRole("button", { name: "Pick a date" }).click();

  await page.locator('button[name="next-month"]').click();

  await page.getByRole("gridcell", { name: "12" }).click();
  await page.getByRole("gridcell", { name: "15" }).click();

  await page.getByRole("button", { name: "Next Step" }).click();

  await page.getByRole("button", { name: "Next Step" }).click();

  await page
    .getByRole("button", { name: "Confirm reservation and Pay" })
    .click();

  await page.waitForURL(new RegExp("^https://bank.paysera.com/popup/pay/"));

  await page
    .locator('input[name="p_email"], input[id="pEmail"]')
    .fill(process.env.TEST_USER_EMAIL!);

  await page.getByRole("button", { name: "Tęsti mokėjimą" }).click();

  await page
    .locator('[data-payment-name="hanza"]', { hasText: 'AB "Swedbank" bankas' })
    .click();

  await page.waitForURL(/\/payment\/success\?data=.*/);

  await expect(page).toHaveURL(/\/payment\/success\?data=.*/);
});
