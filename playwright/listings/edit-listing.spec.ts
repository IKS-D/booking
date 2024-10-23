import { test, expect } from "@playwright/test";
import { a } from "vitest/dist/chunks/suite.CcK46U-P";

test("Edit listing", async ({ page }) => {

    await page.goto("/listings/personal");

    await page.getByLabel('2085').getByRole('img').click();

    await page.fill('input[aria-label="Title"]', 'New edited name');

    await page.fill('input[aria-label="Max guests"]', '6');

    await page.fill('input[aria-label="Price for a day"]', '200');

    const fileInput = await page.locator('#multiple_files')

    await fileInput.setInputFiles("playwright/test_assets/test.jpg");

    await page.getByRole("button", { name: "Submit" }).click();

    const toastLocator = page.getByText(
        `Listing edited successfully`
    );

    await expect(toastLocator).toBeVisible();
});
