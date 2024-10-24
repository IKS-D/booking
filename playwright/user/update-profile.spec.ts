import { test, expect } from "@playwright/test";

test("Update profile", async ({ page }) => {
  await page.goto("/profile");

  await page.getByRole("link", { name: "Edit user profile" }).click();
  await expect(page).toHaveURL("/profile/user/edit");

  await page.locator('input[name="country"]').fill("Lithuania");

  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL("/profile");

  const toastLocator = page.getByText(
    `Profile updated successfully!`
  );

  await expect(toastLocator).toBeVisible();
});
