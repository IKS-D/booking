import { test, expect } from "@playwright/test";

/* 
! Tests in one file because of order of execution
! Required tests execution order:
!    1. Create listing
!    2. View listing
!    3. Edit listing
!    4. Remove listing 
*/

test("1. Create listing", async ({ page }) => {
  await page.goto("/listings/personal");

  await page.click('a[href="/listings/personal/create"]');

  await page.fill('input[aria-label="Title"]', "Test Listing");

  await page.fill(
    'textarea[aria-label="Description"]',
    "This is a description"
  );

  await page.getByRole("button", { name: "Next Step" }).click();

  await page.fill("input[aria-label=Country]", "Lithuania");

  await page.fill("input[aria-label=City]", "Vilnius");

  await page.fill("input[aria-label=Address]", "Gedimino pr.");

  await page.getByRole("button", { name: "Next Step" }).click();

  await page.fill('input[aria-label="Max guests"]', "5");

  await page.fill('input[aria-label="Price for a day"]', "50");

  const dropdown = page.getByLabel("Select the category");

  await dropdown.click();

  await page.waitForSelector('li[role="option"][data-key="2"]', {
    state: "visible",
  });

  await page.click('li[role="option"][data-key="2"]');

  await page.getByRole("button", { name: "Next Step" }).click();

  const fileInput = await page.locator("#multiple_files");

  await fileInput.setInputFiles("playwright/test_assets/test.jpg");

  await page.getByRole("button", { name: "Next Step" }).click();

  await page.getByRole("button", { name: "Add" }).click();

  await page.fill(
    'input[aria-label="Name of additional service"]',
    "Service 1"
  );

  await page.fill(
    'input[aria-label="Short description"]',
    "This is a short description"
  );

  await page.fill('input[aria-label="Price for one night"]', "5");

  await page.getByRole("button", { name: "Create new listing" }).click();

  await expect(page).toHaveURL(/\/listings\/personal/);
});

test("2. View listing", async ({ page }) => {
  await page.goto("/listings");

  await page.locator('a[href^="/listings/"]').last().click();

  await expect(page).toHaveURL(/listings\/.*/);

  const chartLocator = page.locator('div[aria-label="A chart."]');

  await expect(chartLocator).toBeVisible();
});

test("3. Edit listing", async ({ page }) => {
  await page.goto("/listings/personal");

  await page
    .locator("span.text-lg.text-success.cursor-pointer svg")
    .last()
    .click();

  await page.fill('input[aria-label="Title"]', "New edited name");

  await page.fill('input[aria-label="Max guests"]', "6");

  await page.fill('input[aria-label="Price for a day"]', "200");

  const fileInput = await page.locator("#multiple_files");

  await fileInput.setInputFiles("playwright/test_assets/test.jpg");

  await page.getByRole("button", { name: "Submit" }).click();

  const toastLocator = page.getByText(`Listing edited successfully`);

  await expect(toastLocator).toBeVisible();
});

test("4. Remove listing", async ({ page }) => {
  await page.goto("/listings/personal");

  await page
    .locator("span.text-lg.text-danger.cursor-pointer svg")
    .last()
    .click();

  await page.getByRole("button", { name: "Yes" }).click();

  const toastLocator = page.getByText(`Listing deleted successfully`);

  await expect(toastLocator).toBeVisible();
});
