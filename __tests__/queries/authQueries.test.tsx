import { describe, it, expect, vi } from "vitest";
import { deleteUser, signInUsingEmailAndPassword, signOut, signUpUsingEmailAndPassword  } from "@/actions/auth/authQueries";

// Mock the cookies storage to bypass the requestAsyncStorage issue and check sign in and other info
let mockCookieStorage : Record<string, string> = {}
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn((name: string) => mockCookieStorage[name] ? { value: mockCookieStorage[name] } : null),
    set: vi.fn(({ name, value }: { name: string; value: string }) => {
      mockCookieStorage[name] = value;  // store any cookies in the mock storage
    }),
    remove: vi.fn(({ name }: { name: string }) => {
      delete mockCookieStorage[name];  // Remove the cookie from memory
    }),
  })),
}));

describe("Auth Queries", () => {
  // Get the subdomain name form the public supabase url (used for auth token finding)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const url = new URL(supabaseUrl);
  const subdomain = url.hostname.split('.')[0];
  const authCookieKey = "sb-" + subdomain + "-auth-token";

  // Data for creating a new test user
  const newTestEmail = "newtest@iksd.vercel.app";
  const newTestPassword = "password123";

  it("should sign up a user successfully", async () => {
    const { responseData, error } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    expect(responseData).not.toBeNull();
    expect(error).toBeNull();

    if (responseData != null && responseData.user != null) {
      expect(responseData.user.email).toBe(newTestEmail);
    }

    await deleteUser();
  });

  it("should sign a user in successfully", async () => {
    const { error } = await signInUsingEmailAndPassword({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });

    // Ensure there was no error in passing the request
    expect(error).toBeNull();

    // Ensure the authentication cookie was set
    
    const authCookie = mockCookieStorage[authCookieKey];
    expect(authCookie).toBeDefined();

    // Sign the user out after the test
    await signOut();
  });

  it("should sign out a signed it user successfully", async () => {
    await signInUsingEmailAndPassword({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });

    const { error } = await signOut();

    expect(error).toBeNull;

    const authCookie = mockCookieStorage[authCookieKey];
    expect(authCookie == undefined || authCookie == '').toBe(true);
  });

  it("should delete a signed up user successfully", async () => {
    await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    const { error } = await deleteUser();

    expect(error == null || error == undefined).toBe(true);

    const authCookie = mockCookieStorage[authCookieKey];
    expect(authCookie == undefined || authCookie == '').toBe(true);
  });

});
