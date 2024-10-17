import { deleteUser, signInUsingEmailAndPassword, signOut, signUpUsingEmailAndPassword } from "@/actions/auth/authQueries";
import { getListingById } from "@/actions/listings/listingsQueries";
import { insertReservation } from "@/actions/reservations/reservationsQueries";
import getCurrentUser, { deleteHost, getCurrentUserProfile, getHostIdByReservationId, getHostProfileById, getUserProfileById, hostProfileExists, insertHost, insertProfile, updateHost, updateProfile, userProfileExists } from "@/actions/users/usersQueries";
import supabase from "@/supabase/supabase";
import { describe, it, expect, vi } from "vitest";

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

describe("User Queries", () => { 
  // Data for creating a new test user
  const newTestEmail = "newtest@iksd.vercel.app";
  const newTestPassword = "password123";

  it("should get the current user successfully", async () => {
    await signInUsingEmailAndPassword({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });

    try {
      const user = await getCurrentUser();
      expect(user).not.toBeNull();
  
      expect(user?.email).toBeDefined()
      expect(user?.email == process.env.TEST_USER_EMAIL!).toBe(true);
    }
    finally {
      // Cleanup the user sign in after the test
      await signOut();
    }
  });

  it("should get the current user's profile successfully", async () => {
    await signInUsingEmailAndPassword({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });

    try {
      const userProfile = await getCurrentUserProfile();
      expect(userProfile).not.toBeNull();
  
      expect(userProfile?.first_name == "Sigis").toBe(true);
      expect(userProfile?.last_name == "Sigaitis").toBe(true);
    }
    finally {
      // Cleanup the user sign in after the test
      await signOut();
    }
  });

  it("should confirm that a user's profile exists successfully", async () => {
    const response = await userProfileExists(process.env.TEST_USER_UID!);

    expect(response).toBe(true);
  });

  it("should get the user profile by id successfully", async () => {
    const { data, error } = await getUserProfileById(process.env.TEST_USER_UID!);
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data?.first_name == "Sigis" && data?.last_name == "Sigaitis").toBe(true);
  });

  it("should insert a profile for a new user successfully", async () => {
    // Create a new user
    const { responseData, error } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

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
    }
    finally {
      // Cleanup the user
      await deleteUser();
    }
  });

  it("should update the test user's profile successfully", async () => {
    const { data: previousProfileData } = await getUserProfileById(process.env.TEST_USER_UID!);
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
    }
    finally {
      // Reset the profile data
      await updateProfile(previousProfile);
    }
  });

  it("should delete a user's profile", async () => {
    // Create a new user
    await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    const { error } = await deleteUser();
    expect(error == null || error == undefined).toBe(true);
  });

  it("should confirm that a user's host profile exists successfully", async () => {
    const response = await hostProfileExists(process.env.TEST_USER_UID!);

    expect(response).toBe(true);
  });

  it("should get the host profile by id successfully", async () => {
    const { data, error } = await getHostProfileById(process.env.TEST_USER_UID!);
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data?.personal_code == "213124324234234" && data?.bank_account == "LT546645645647").toBe(true);
  });

  it("should insert a host profile for a new user successfully", async () => {
    // Create a new user
    const { responseData, error } = await signUpUsingEmailAndPassword({
      email: newTestEmail,
      password: newTestPassword,
      confirmPassword: newTestPassword,
    });

    try {
      // Try inserting a profile for the new user
      const { host, error } = await insertHost({
        userId: responseData.user?.id!,
        personalCode: "000000000",
        bankAccount: "LT546645645647",
      });
  
      expect(error).toBeNull();
    }
    finally {
      // Cleanup the usera
      await deleteHost();
      await deleteUser();
    }
  });

  it("should update the test user's host profile successfully", async () => {
    const { data: previousProfileData } = await getHostProfileById(process.env.TEST_USER_UID!);
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
    }
    finally {
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

    // Insert a host profile for the new user
    await insertHost({
      userId: responseData.user?.id!,
      personalCode: "000000000",
      bankAccount: "LT546645645647",
    });

    try {
      const { error } = await deleteHost();
      expect(error == null || error == undefined).toBe(true);
    } 
    finally {
      // Cleanup the usera
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
    }
    finally {
      await supabase.from("reservations").delete().eq("id", reservation!.id);
    }
  });
});