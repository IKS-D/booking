import {
  deleteUser,
  signInUsingEmailAndPassword,
  signOut,
  signUpUsingEmailAndPassword,
} from "@/actions/auth/authQueries";
import { getListingById } from "@/actions/listings/listingsQueries";
import { insertReservation } from "@/actions/reservations/reservationsQueries";
import getCurrentUser, {
  deleteHost,
  getCurrentUserProfile,
  getHostIdByReservationId,
  getHostProfileById,
  getUserProfileById,
  hostProfileExists,
  insertHost,
  insertProfile,
  updateHost,
  updateProfile,
  userProfileExists,
} from "@/actions/users/usersQueries";
import { describe, it, expect, vi, afterAll } from "vitest";
import * as usersQueries from "@/actions/users/usersQueries";
import * as listingsQueries from "@/actions/listings/listingsQueries";
import { PostgrestError } from "@supabase/supabase-js";
import {
  RequestCookie,
  ResponseCookie,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/supabase/server";

// Data for creating a new test user
const newTestEmail = "newtestuser@iksd.vercel.app";
const newTestPassword = "password123";

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

describe("Users Queries", () => {
  afterAll(async () => {
    // delete new test user

    // sign in as the test user
    const { error } = await signInUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
    });

    await deleteUser();
  });

  it("should get the current user successfully", async () => {
    const { error } = await signInUsingEmailAndPassword({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });
    expect(error).toBeNull();

    try {
      const user = await getCurrentUser();
      expect(user).not.toBeNull();

      expect(user?.email).toBeDefined();
      expect(user?.email == process.env.TEST_USER_EMAIL!).toBe(true);
    } finally {
      // Cleanup the user sign in after the test
      await signOut();
    }
  });

  it("should get the current user's profile successfully", async () => {
    const { error } = await signInUsingEmailAndPassword({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });
    expect(error).toBeNull();

    try {
      const userProfile = await getCurrentUserProfile();
      expect(userProfile).not.toBeNull();

      expect(userProfile?.first_name == "Sigis").toBe(true);
      expect(userProfile?.last_name == "Sigaitis").toBe(true);
    } finally {
      // Cleanup the user sign in after the test
      await signOut();
    }
  });

  it("should return null as the current user's profile", async () => {
    const getCurrentUserMock = vi
      .spyOn(usersQueries, "default")
      .mockResolvedValue(null);

    const userProfile = await getCurrentUserProfile();

    expect(userProfile).toBeNull();

    getCurrentUserMock.mockReset();
  });

  it("should confirm that a user's profile exists successfully", async () => {
    const response = await userProfileExists(process.env.TEST_USER_UID!);

    expect(response).toBe(true);
  });

  it("should deny that a user's profile exists successfully", async () => {
    const response = await userProfileExists(
      "00000000-0000-0000-0000-000000000000"
    );

    expect(response).toBe(false);
  });

  it("should get the user profile by id successfully", async () => {
    const { data, error } = await getUserProfileById(
      process.env.TEST_USER_UID!
    );

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data?.first_name == "Sigis" && data?.last_name == "Sigaitis").toBe(
      true
    );
  });

  it("should insert a profile for a new user successfully", async () => {
    // Create a new user
    const { responseData, error } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });
    expect(error).toBeNull();

    try {
      // Try inserting a profile for the new user
      const { profile, error } = await insertProfile({
        userId: responseData.user?.id!,
        firstName: "Labis",
        lastName: "Labutis",
        dateOfBirth: "2000-01-01",
        phoneNumber: "+37000000000",
        photo: "",
        country: "Lithuania",
        city: "Vilnius",
      });

      expect(error).toBeNull();
    } finally {
      // Cleanup the user
      await deleteUser();
    }
  });

  it("should update the test user's profile successfully", async () => {
    const { data: previousProfileData } = await getUserProfileById(
      process.env.TEST_USER_UID!
    );
    const previousProfile = {
      userId: process.env.TEST_USER_UID!,
      firstName: previousProfileData!.first_name,
      lastName: previousProfileData!.last_name,
      dateOfBirth: previousProfileData!.birth_date,
      phoneNumber: previousProfileData!.phone,
      photo: previousProfileData!.photo,
      country: previousProfileData!.country,
      city: previousProfileData!.city,
    };

    const newProfileData = {
      userId: process.env.TEST_USER_UID!,
      firstName: "ChangedName",
      lastName: "ChangedLastName",
      dateOfBirth: "1999-05-19",
      phoneNumber: "+37099999999",
      photo: "Changed picture",
      country: "Changed country",
      city: "Changed city",
    };

    try {
      const { profile, error } = await updateProfile(newProfileData);
      expect(error).toBeNull();
    } finally {
      // Reset the profile data
      await updateProfile(previousProfile);
    }
  });

  it("should delete a user's profile", async () => {
    const { error: registrationError } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    expect(registrationError).toBeNull();

    const { error: deletionError } = await deleteUser();
    expect(deletionError).toBeNull();
  });

  it("should confirm that a user's host profile exists successfully", async () => {
    const response = await hostProfileExists(process.env.TEST_USER_UID!);

    expect(response).toBe(true);
  });

  it("should deny that a host's profile exists successfully", async () => {
    const response = await hostProfileExists(
      "00000000-0000-0000-0000-000000000000"
    );

    expect(response).toBe(false);
  });

  it("should get the host profile by id successfully", async () => {
    const { data, error } = await getHostProfileById(
      process.env.TEST_USER_UID!
    );

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(
      data?.personal_code == "213124324234234" &&
        data?.bank_account == "LT546645645647"
    ).toBe(true);
  });

  it("should insert a host profile for a new user successfully", async () => {
    try {
      // Create a new user
      const { responseData, error: signUpError } =
        await signUpUsingEmailAndPassword({
          email: newTestEmail,
          password: newTestPassword,
          confirmPassword: newTestPassword,
        });

      expect(signUpError).toBeNull();

      // Try inserting a profile for the new user
      const { host, error } = await insertHost({
        userId: responseData.user?.id!,
        personalCode: "000000000",
        bankAccount: "LT546645645647",
      });

      expect(error).toBeNull();
      expect(host).not.toBeNull();
    } finally {
      // Cleanup the usera
      await deleteHost();
      await deleteUser();
    }
  });

  it("should update the test user's host profile successfully", async () => {
    const { data: previousProfileData } = await getHostProfileById(
      process.env.TEST_USER_UID!
    );
    const previousProfile = {
      userId: process.env.TEST_USER_UID!,
      personalCode: previousProfileData!.personal_code,
      bankAccount: previousProfileData!.bank_account,
    };

    const newProfileData = {
      userId: process.env.TEST_USER_UID!,
      personalCode: "999999999",
      bankAccount: "LT121212121212",
    };

    try {
      const { host, error } = await updateHost(newProfileData);
      expect(error).toBeNull();
    } finally {
      // Reset the profile data
      await updateHost(previousProfile);
    }
  });

  it("should delete a user's host profile", async () => {
    // Create a new user
    const { responseData } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    await signInUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
    });

    // Insert a host profile for the new user
    await insertHost({
      userId: responseData.user?.id!,
      personalCode: "000000000",
      bankAccount: "LT546645645647",
    });

    try {
      const { error } = await deleteHost();
      expect(error == null || error == undefined).toBe(true);
    } finally {
      // Cleanup the usera
      await deleteUser();
    }
  });

  it("should catch a PostgrestError when deleting a user's host profile", async () => {
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

    // Create a new user
    const { responseData } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    await signInUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
    });

    // Insert a host profile for the new user
    await insertHost({
      userId: responseData.user?.id!,
      personalCode: "000000000",
      bankAccount: "LT546645645647",
    });

    try {
      const { error } = await deleteHost();
      expect(error).not.toBeNull();
      expect(error!.message).toBe("Listings error");
    } finally {
      // Cleanup the usera
      getPersonalListingsMock.mockRestore();
      //await deleteHost();
      await deleteUser();
    }
  });

  it("should catch a custom error when deleting a user's host profile", async () => {
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

    // Create a new user
    const { responseData } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    await signInUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
    });

    // Insert a host profile for the new user
    await insertHost({
      userId: responseData.user?.id!,
      personalCode: "000000000",
      bankAccount: "LT546645645647",
    });

    try {
      const { error } = await deleteHost();
      expect(error).not.toBeNull();
      expect(error!.message).toBe("User has listings");
    } finally {
      // Cleanup the usera
      getPersonalListingsMock.mockRestore();
      // await deleteHost();
      await deleteUser();
    }
  });

  it("should get the correct host id from the reservation id", async () => {
    const { data: listingData } = await getListingById(1);
    const { reservation } = await insertReservation({
      listingId: listingData!.id,
      userId: process.env.TEST_USER_UID!,
      orderedServices: [],
      startDate: "2023-01-01",
      endDate: "2023-01-02",
      totalPrice: 100,
    });

    try {
      const { data, error } = await getHostIdByReservationId(reservation!.id);
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data == listingData!.host_id).toBe(true);
    } finally {
      await (await createSupabaseServerClient())
        .from("reservations")
        .delete()
        .eq("id", reservation!.id);
    }
  });
});
