import { test, expect } from "@playwright/test";
import { a } from "vitest/dist/chunks/suite.CcK46U-P";

test("Remove listing", async ({ page }) => {

    await page.goto("/listings/personal");

    await page.locator('span.text-lg.text-danger.cursor-pointer svg').last().click();

    await page.getByRole("button", { name: "Yes" }).click();

    const toastLocator = page.getByText(
        `Listing deleted successfully`
    );

    await expect(toastLocator).toBeVisible();
});
