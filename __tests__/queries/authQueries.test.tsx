import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { signUpUsingEmailAndPassword  } from "@/actions/auth/authQueries";
import { cookies } from "next/headers";
import { CookieOptions, createServerClient } from "@supabase/ssr";

// Mock only the cookies function to bypass the requestAsyncStorage issue
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(() => null), // Mock that no cookies are available
    set: vi.fn(),           // Mock cookie set to do nothing
    remove: vi.fn(),        // Mock cookie remove to do nothing
  })),
}));

describe("Auth Queries", () => {
  const testEmail = "test@example.com";
  const testPassword = "password123";
  const testConfirmPassword = "password123";

  // Save the id of the user that is created
  // so that it could be deleted after each test
  let createdUserId: string | null = null;
  
  afterEach(async () => {
    if (createdUserId) {
      // Only attempt to delete if a user was created
      const cookieStore = cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,  // Use the service key for admin actions
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.set({ name, value: "", ...options });
            },
          },
        }
      );

      // Delete the created user after the test
      await supabase.auth.admin.deleteUser(createdUserId);
      createdUserId = null;
    }

    vi.resetAllMocks();
  });

  it("should sign up a user successfully", async () => {
    const { responseData, error } = await signUpUsingEmailAndPassword({
      email: testEmail,
      password: testPassword,
      confirmPassword: testConfirmPassword,
    });

    // Since you're using the real Supabase client, you expect actual response from your database
    expect(responseData).not.toBeNull();
    expect(error).toBeNull();

    if (responseData != null && responseData.user != null) {
      expect(responseData.user.email).toBe(testEmail);
      // Store the user ID for clean-up
      createdUserId = responseData.user.id;
    }
  });
});
