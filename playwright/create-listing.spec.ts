import { test, expect } from "@playwright/test";
import { a } from "vitest/dist/chunks/suite.CcK46U-P";

test("Create listing", async ({ page }) => {


    await page.goto("/listings/personal");

    await page.click('a[href="/listings/personal/create"]');

    await page.fill('input[aria-label="Title"]', "My new listing");

    await page.fill('textarea[aria-label="Description"]', "This is a description");

    await page.getByRole("button", { name: "Next Step" }).click();

    await page.fill('input[aria-label=Country]', "Lithuania");

    await page.fill('input[aria-label=City]', "Vilnius");

    await page.fill('input[aria-label=Address]', "Gedimino pr.");

    await page.getByRole("button", { name: "Next Step" }).click();

    await page.fill('input[aria-label="Max guests"]', '5');

    await page.fill('input[aria-label="Price for a day"]', '50');

    const dropdown = page.getByLabel('Select the category');

    await dropdown.click();

    await page.waitForSelector('li[role="option"][data-key="2"]', { state: 'visible' });

    await page.click('li[role="option"][data-key="2"]');

    await page.getByRole("button", { name: "Next Step" }).click();

    const fileInput = await page.locator('#multiple_files')

    await fileInput.setInputFiles("playwright/test_assets/test.jpg");

    await page.getByRole("button", { name: "Next Step" }).click();

    await page.getByRole('button', { name: 'Add' }).click();

    await page.fill('input[aria-label="Name of additional service"]', "Service 1");

    await page.fill('input[aria-label="Short description"]', "This is a short description");

    await page.fill('input[aria-label="Price for one night"]', '5');

    await page.getByRole("button", { name: "Create new listing" }).click();

    await expect(page).toHaveURL(/\/listings\/personal/);

});
