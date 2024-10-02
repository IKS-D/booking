import { userProfileExists } from "@/actions/users/usersQueries";
import { expect, it } from "vitest";

it("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});

it("user profile exists", async () => {
  const exists = await userProfileExists(
    "70198215-84d6-4bac-a225-5641d4045855"
  );

  expect(exists).toBeTruthy();
});
