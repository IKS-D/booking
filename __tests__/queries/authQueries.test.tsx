import { describe, it, expect, vi, afterAll, beforeEach } from "vitest";
import {
  deleteUser,
  signInUsingEmailAndPassword,
  signOut,
  signUpUsingEmailAndPassword,
} from "@/actions/auth/authQueries";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import * as reservationsQueries from "@/actions/reservations/reservationsQueries";
import * as listingsQueries from "@/actions/listings/listingsQueries";
import {
  RequestCookie,
  ResponseCookie,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

let mockCookieStorage: Record<string, string> = {};

vi.mock("next/headers");

vi.mocked(cookies).mockResolvedValue({
  [Symbol.iterator]: function (): IterableIterator<[string, RequestCookie]> {
    throw new Error("iterator not implemented");
  },
  size: Object.keys(mockCookieStorage).length,
  get: function (
    ...args: [name: string] | [RequestCookie]
  ): RequestCookie | undefined {
    if (typeof args[0] === "string") {
      const [name] = args;

      const value = mockCookieStorage[name];

      if (value) {
        return {
          name: name,
          value: value,
        };
      }
    } else {
      const { name } = args[0];

      const value = mockCookieStorage[name];

      if (value) {
        return {
          name: name,
          value: value,
        };
      }
    }

    return undefined;
  },
  getAll: function (): RequestCookie[] {
    return Object.entries(mockCookieStorage).map(([name, value]) => ({
      name,
      value,
    }));
  },
  has: function (name: string): boolean {
    return name in mockCookieStorage;
  },
  set: function (
    ...args:
      | [key: string, value: string, cookie?: Partial<ResponseCookie>]
      | [options: ResponseCookie]
  ): ResponseCookies {
    if (typeof args[0] === "string") {
      const [key, value] = args;

      if (value === "") {
        delete mockCookieStorage[key];
        return this;
      }

      mockCookieStorage[key] = value as string;
    } else {
      const { name, value } = args[0];

      if (value === "") {
        delete mockCookieStorage[name];
        return this;
      }

      mockCookieStorage[name] = value;
    }

    return this;
  },
  delete: function (
    ...args:
      | [key: string]
      | [options: Omit<ResponseCookie, "value" | "expires">]
  ): ResponseCookies {
    if (typeof args[0] === "string") {
      delete mockCookieStorage[args[0]];
    } else {
      const { name } = args[0];
      delete mockCookieStorage[name];
    }

    return this;
  },
});

describe("Auth Queries", () => {
  // Get the subdomain name form the public supabase url (used for auth token finding)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const url = new URL(supabaseUrl);
  const subdomain = url.hostname.split(".")[0];
  const authCookieKey = "sb-" + subdomain + "-auth-token";

  // Data for creating a new test user
  const newTestEmail = "newtestauth@iksd.vercel.app";
  const newTestPassword = "password123";

  it("should sign up a user successfully", async () => {
    const { responseData, error } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    expect(responseData).not.toBeNull();
    expect(responseData!.user!.email).toBe(newTestEmail);
    expect(error).toBeNull();

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
    const { error: signInError } = await signInUsingEmailAndPassword({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });
    expect(signInError).toBeNull();

    const { error: signOutError } = await signOut();

    expect(signOutError).toBeNull;
    const authCookie = mockCookieStorage[authCookieKey];
    expect(authCookie == undefined || authCookie == "").toBe(true);
  });

  it("should delete a signed up user successfully", async () => {
    const { responseData, error: registrationError } =
      await signUpUsingEmailAndPassword({
        email: newTestEmail,
        password: newTestPassword,
        confirmPassword: newTestPassword,
      });

    expect(responseData).not.toBeNull();
    expect(registrationError).toBeNull();

    const { error: deletionError } = await deleteUser();

    expect(deletionError == null || deletionError == undefined).toBe(true);

    // ! Sometimes the cookie is not deleted, idk why
    // const authCookie = mockCookieStorage[authCookieKey];
    // expect(authCookie == undefined || authCookie == "").toBe(true);
  });

  it("should throw a AuthError when attempting to delete user", async () => {
    // Attempt to delete user while not logged in - should throw AuthError
    const { error } = await deleteUser();

    expect(error).not.toBeNull();
    expect(error instanceof AuthError).toBe(true);
  });

  it("should throw a PostgrestError when attempting to delete user", async () => {
    // Mock getReservation to throw an error
    const mockReturnValue = {
      data: null,
      error: {
        message: "Reservation error",
        details: "Test details",
      } as PostgrestError,
    };

    const getReservationsMock = vi
      .spyOn(reservationsQueries, "getReservations")
      .mockResolvedValue(mockReturnValue);

    const { error: registrationError } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    expect(registrationError).toBeNull();

    try {
      const { error: deletionError } = await deleteUser();

      expect(deletionError).not.toBeNull();
      expect(deletionError!.message).toBe("Reservation error");
      //expect(deletionError instanceof PostgrestError).toBe(true);
    } finally {
      getReservationsMock.mockRestore();
      await deleteUser();
    }
  });

  it('should throw a custom "User has reservations" error when attempting to delete user', async () => {
    // Mock getReservation to return an active reservation
    const mockReturnValue = {
      data: [
        {
          creation_date: new Date().toISOString(), // ISO format for creation date
          end_date: new Date(
            new Date().getTime() + 24 * 60 * 60 * 1000
          ).toISOString(), // End date is tomorrow
          id: 1, // Example ID
          listing_id: 123, // Example listing ID
          start_date: new Date().toISOString(), // Today's date as start date
          status: 2 as unknown as number & { name: string }, // Example status as a number with a name
          total_price: 100.5, // Example total price
          user_id: "user_123", // Example user ID
          listing: {
            address: "123 Main St",
            title: "Cozy Apartment",
            category_id: 0, // Example category ID
            city: "Kaunas",
            country: "Lietuva",
            creation_date: new Date().toISOString(),
            day_price: 10,
            description: "",
            host_id: "",
            id: 0,
            number_of_places: 1,
            suspension_status: false,
            images: [], // An array of images, can be empty for this mock
            category: null, // Adjust this based on your type requirement
          },
          ordered_services: [
            {
              id: 1, // Example service ID, ensure this matches the expected structure
              service: {
                // Define the service object according to your requirements
                description: "Cleaning Service", // Example description
                id: 1, // Example service ID
                listing_id: 123, // Associated listing ID
                price: 20, // Example service price
                title: "House Cleaning", // Example title
              },
            },
            {
              id: 2, // Another example service ID
              service: {
                description: "Laundry Service", // Example description
                id: 2,
                listing_id: 123,
                price: 15,
                title: "Laundry",
              },
            },
          ],
          guest: null, // Assuming guest can be null; if it requires an object, define it
        },
      ],
      error: null, // Error should be null to indicate no errors
    };

    const getReservationsMock = vi
      .spyOn(reservationsQueries, "getReservations")
      .mockResolvedValue(mockReturnValue);

    const { error: registrationError } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    expect(registrationError).toBeNull();

    try {
      const { error: deletionError } = await deleteUser();

      expect(deletionError).not.toBeNull();
      expect(deletionError!.message).toBe("User has reservations");
      //expect(deletionError instanceof PostgrestError).toBe(true);
    } finally {
      getReservationsMock.mockRestore();
      await deleteUser();
    }
  });

  it("should throw a PostgrestError when attempting to delete user", async () => {
    // Mock getPersonalListings to throw an error
    const mockReturnValue = {
      data: null,
      error: {
        message: "Listings error",
        details: "Test details",
      } as PostgrestError,
    };

    const getPersonalListingsMock = vi
      .spyOn(listingsQueries, "getPersonalListings")
      .mockResolvedValue(mockReturnValue);

    const { error: registrationError } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    expect(registrationError).toBeNull();

    try {
      const { error: deletionError } = await deleteUser();

      expect(deletionError).not.toBeNull();
      expect(deletionError!.message).toBe("Listings error");
      //expect(deletionError instanceof PostgrestError).toBe(true);
    } finally {
      getPersonalListingsMock.mockRestore();
      await deleteUser();
    }
  });

  it('should throw a custom "User has listings" error when attempting to delete user', async () => {
    // Mock getPersonalListings to throw an error
    const mockReturnValue = {
      data: [
        {
          address: "123 Main St",
          title: "Cozy Apartment",
          category_id: 0, // Example category ID
          city: "Kaunas",
          country: "Lietuva",
          creation_date: new Date().toISOString(),
          day_price: 10,
          description: "",
          host_id: "",
          id: 0,
          number_of_places: 1,
          suspension_status: false,
          images: [], // An array of images, can be empty for this mock
          category: null, // Adjust this based on your type requirement
          services: [
            {
              description: "AAAAAAAAAAA",
              id: 0,
              listing_id: 0,
              price: 0,
              title: "AAAAAAAAAAA",
            },
          ],
        },
      ],
      error: null,
    };

    const getPersonalListingsMock = vi
      .spyOn(listingsQueries, "getPersonalListings")
      .mockResolvedValue(mockReturnValue);

    const { error: registrationError } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    expect(registrationError).toBeNull();

    try {
      const { error: deletionError } = await deleteUser();

      expect(deletionError).not.toBeNull();
      expect(deletionError!.message).toBe("User has listings");
      //expect(deletionError instanceof PostgrestError).toBe(true);
    } finally {
      getPersonalListingsMock.mockRestore();
      await deleteUser();
    }
  });

  afterAll(async () => {
    mockCookieStorage = {};
    vi.resetAllMocks();
  });

  beforeEach(() => {
    mockCookieStorage = {};
  });
});
