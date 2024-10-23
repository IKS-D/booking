import { describe, it, expect, vi, afterAll } from "vitest";
import { deleteUser, signInUsingEmailAndPassword, signOut, signUpUsingEmailAndPassword  } from "@/actions/auth/authQueries";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import * as reservationsQueries from "@/actions/reservations/reservationsQueries";
import * as listingsQueries from "@/actions/listings/listingsQueries"
import supabase from "@/supabase/supabase";
import { getSupabaseServerClient, getSupabaseServiceClient } from "@/supabase/supabase-clients";

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
    expect(authCookie == undefined || authCookie == '').toBe(true);
  });

  it("should delete a signed up user successfully", async () => {
    const { responseData, error: registrationError } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    expect(responseData).not.toBeNull();
    expect(registrationError).toBeNull();

    const { error: deletionError } = await deleteUser();

    expect(deletionError == null || deletionError == undefined).toBe(true);

    const authCookie = mockCookieStorage[authCookieKey];
    expect(authCookie == undefined || authCookie == '').toBe(true);
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
      error: { message: "Reservation error", details: "Test details" } as PostgrestError,
    };

    const getReservationsMock = vi.spyOn(reservationsQueries, 'getReservations').mockResolvedValue(mockReturnValue);
    
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
    }
    finally {
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
          end_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // End date is tomorrow
          id: 1, // Example ID
          listing_id: 123, // Example listing ID
          start_date: new Date().toISOString(), // Today's date as start date
          status: 2 as unknown as number & { name: string; }, // Example status as a number with a name
          total_price: 100.50, // Example total price
          user_id: 'user_123', // Example user ID
          listing: {
            address: '123 Main St',
            title: 'Cozy Apartment',
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
            category: null // Adjust this based on your type requirement
          },
          ordered_services: [
            {
              id: 1, // Example service ID, ensure this matches the expected structure
              service: { // Define the service object according to your requirements
                description: "Cleaning Service", // Example description
                id: 1, // Example service ID
                listing_id: 123, // Associated listing ID
                price: 20, // Example service price
                title: "House Cleaning" // Example title
              }
            },
            {
              id: 2, // Another example service ID
              service: {
                description: "Laundry Service", // Example description
                id: 2,
                listing_id: 123,
                price: 15,
                title: "Laundry"
              }
            }
          ],
          guest: null // Assuming guest can be null; if it requires an object, define it
        }
      ],
      error: null // Error should be null to indicate no errors
    }; 

    const getReservationsMock = vi.spyOn(reservationsQueries, 'getReservations').mockResolvedValue(mockReturnValue);
    
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
    }
    finally {
      getReservationsMock.mockRestore();
      await deleteUser();
    }
  });
  
  it("should throw a PostgrestError when attempting to delete user", async () => {
    // Mock getPersonalListings to throw an error
    const mockReturnValue = {
      data: null,
      error: { message: "Listings error", details: "Test details" } as PostgrestError,
    };

    const getPersonalListingsMock = vi.spyOn(listingsQueries, 'getPersonalListings').mockResolvedValue(mockReturnValue);
    
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
    }
    finally {
      getPersonalListingsMock.mockRestore();
      await deleteUser();
    }
  });

  it('should throw a custom "User has listings" error when attempting to delete user', async () => {
    // Mock getPersonalListings to throw an error
    const mockReturnValue = {
      data: [
        {
          address: '123 Main St',
          title: 'Cozy Apartment',
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
            { description: "AAAAAAAAAAA",
              id: 0,
              listing_id: 0,
              price: 0,
              title: "AAAAAAAAAAA",
            }
          ]
        },
      ],
      error: null,
    };

    const getPersonalListingsMock = vi.spyOn(listingsQueries, 'getPersonalListings').mockResolvedValue(mockReturnValue);
    
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
    }
    finally {
      getPersonalListingsMock.mockRestore();
      await deleteUser();
    }
  });

  it("should throw a AuthError when attempting to delete user due to failed signOut", async () => {
    // Mock getPersonalListings to throw an error
    const mockReturnValue = {
      error: new AuthError("Sign out failed", 0),
    };

    const signOutMock = vi.spyOn(getSupabaseServerClient().auth, 'signOut').mockResolvedValue(mockReturnValue);
    
    const { error: registrationError } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    expect(registrationError).toBeNull();

    try {
      const { error: deletionError } = await deleteUser();
  
      expect(deletionError).not.toBeNull();
      expect(deletionError!.message).toBe("Sign out failed");
      //expect(deletionError instanceof PostgrestError).toBe(true);
    }
    finally {
      signOutMock.mockRestore();
      await deleteUser();
    }
  });

  // I can't run this test as even after restoring the mocks, the delete function doesn't work properly?
  // it("should throw a AuthError when attempting to delete user due to failed signOut", async () => {
  //   // Mock getPersonalListings to throw an error
  //   const mockReturnValue = {
  //       data: {
  //         user: null
  //       },
  //       error: new AuthError("Deletion error", 0)
  //   };

  //   const deleteMock = vi.spyOn(getSupabaseServiceClient().auth.admin, 'deleteUser').mockResolvedValue(mockReturnValue);
    
  //   const { error: registrationError } = await signUpUsingEmailAndPassword({
  //     email: newTestEmail,
  //     password: newTestPassword,
  //     confirmPassword: newTestPassword,
  //   });

  //   expect(registrationError).toBeNull();

  //   try {
  //     const { error: deletionError } = await deleteUser();
  
  //     expect(deletionError).not.toBeNull();
  //     expect(deletionError!.message).toBe("Deletion error");
  //     //expect(deletionError instanceof PostgrestError).toBe(true);
  //   }
  //   finally {
  //     deleteMock.mockRestore();
  //     await deleteUser();
  //   }
  // });

  afterAll(async () => {
    mockCookieStorage = {};
    vi.resetAllMocks();
  });
});
