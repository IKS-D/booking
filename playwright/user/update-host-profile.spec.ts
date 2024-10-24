import { test, expect } from "@playwright/test";

test("Update profile", async ({ page }) => {
  await page.goto("/profile");

  await page.getByRole("link", { name: "Edit host profile" }).click();
  await expect(page).toHaveURL("/profile/host/edit");

  await page.locator('input[name="personalCode"]').fill("213124324234234");

  await page.locator('input[name="bankAccount"]').fill("LT546645645647");

  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL("/profile");

  const toastLocator = page.getByText(
    `Host profile updated successfully!`
  );

  await expect(toastLocator).toBeVisible();
});
