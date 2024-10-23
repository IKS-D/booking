import { test, expect } from "@playwright/test";
import { a } from "vitest/dist/chunks/suite.CcK46U-P";

test("View listing", async ({ page }) => {

    await page.goto("/listings");

    await page.locator('a[href^="/listings/"]').last().click();

    const title = await page.locator('h2').textContent();

    expect(title).toContain('Test Listing');

    const chartLocator = page.locator('div[aria-label="A chart."]');

    await expect(chartLocator).toBeVisible();
});
