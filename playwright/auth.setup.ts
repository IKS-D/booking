import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel("Password").fill(process.env.TEST_USER_PASSWORD!);

  await page
    .getByRole("button", { name: "Sign in with email and password" })
    .click();

  await page.waitForURL("/");

  await page.context().storageState({ path: authFile });
});
