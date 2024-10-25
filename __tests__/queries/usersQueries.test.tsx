// import {
//   deleteUser,
//   signInUsingEmailAndPassword,
//   signOut,
//   signUpUsingEmailAndPassword,
// } from "@/actions/auth/authQueries";
// import { getListingById } from "@/actions/listings/listingsQueries";
// import { insertReservation } from "@/actions/reservations/reservationsQueries";
// import getCurrentUser, {
//   deleteHost,
//   getCurrentUserProfile,
//   getHostIdByReservationId,
//   getHostProfileById,
//   getUserProfileById,
//   hostProfileExists,
//   insertHost,
//   insertProfile,
//   updateHost,
//   updateProfile,
//   userProfileExists,
// } from "@/actions/users/usersQueries";
// import supabase from "@/supabase/client";
// import { describe, it, expect, vi, afterAll } from "vitest";
// import * as usersQueries from "@/actions/users/usersQueries";
// import * as listingsQueries from "@/actions/listings/listingsQueries";
// import { createSupabaseServerClient } from "@/supabase/server";
// import { PostgrestError } from "@supabase/supabase-js";
// import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

// // Mock the cookies storage to bypass the requestAsyncStorage issue and check sign in and other info
// // let mockCookieStorage: Record<string, string> = {};
// // vi.mock("next/headers", () => ({
// //   cookies: vi.fn(() => ({
// //     get: vi.fn((name: string) =>
// //       mockCookieStorage[name] ? { value: mockCookieStorage[name] } : null
// //     ),
// //     set: vi.fn(({ name, value }: { name: string; value: string }) => {
// //       mockCookieStorage[name] = value; // store any cookies in the mock storage
// //     }),
// //     remove: vi.fn(({ name }: { name: string }) => {
// //       delete mockCookieStorage[name]; // Remove the cookie from memory
// //     }),
// //   })),
// // }));

// let mockCookieStorage: Record<string, string> = {};

// vi.mock("next/headers", async () => ({
//   cookies: vi.fn().mockResolvedValue({
//     getAll: vi.fn(() => {
//       console.log(
//         "Fetching all cookies from mockCookieStorage:",
//         mockCookieStorage
//       );
//       return Object.entries(mockCookieStorage).map(([name, value]) => ({
//         name,
//         value,
//       }));
//     }),

//     setAll: vi.fn(
//       (cookiesToSet: { name: string; value: string; options?: any }[]) => {
//         console.log("Setting multiple cookies:", cookiesToSet);
//         cookiesToSet.forEach(({ name, value, options }) => {
//           if (name && value !== undefined) {
//             mockCookieStorage[name] = value;
//           } else {
//             console.warn("Invalid cookie entry skipped:", { name, value });
//           }
//         });
//       }
//     ),
//     get: vi.fn((name: string) => {
//       const value = mockCookieStorage[name];
//       console.log(`Fetching cookie by name '${name}':`, value);
//       return value ? { value } : null;
//     }),
//     set: vi.fn(
//       ({
//         key,
//         value,
//       }: {
//         key: string;
//         value: string;
//         cookie?: Partial<ResponseCookie>;
//       }) => {
//         if (key && value !== undefined) {
//           mockCookieStorage[key] = value;
//           console.log(`Cookie set - ${key}:`, value);
//         } else {
//           console.warn("Attempted to set an invalid cookie:", { key, value });
//         }
//       }
//     ),
//     remove: vi.fn(({ name }: { name: string }) => {
//       if (name in mockCookieStorage) {
//         delete mockCookieStorage[name];
//         console.log(`Cookie removed - ${name}`);
//       } else {
//         console.warn("Attempted to remove a non-existent cookie:", name);
//       }
//     }),
//   }),
// }));

// describe("Users Queries", () => {
//   // Data for creating a new test user
//   const newTestEmail = "newtestuser@iksd.vercel.app";
//   const newTestPassword = "password123";

//   it("should get the current user successfully", async () => {
//     const { error } = await signInUsingEmailAndPassword({
//       email: process.env.TEST_USER_EMAIL!,
//       password: process.env.TEST_USER_PASSWORD!,
//     });
//     expect(error).toBeNull();

//     try {
//       const user = await getCurrentUser();
//       expect(user).not.toBeNull();

//       expect(user?.email).toBeDefined();
//       expect(user?.email == process.env.TEST_USER_EMAIL!).toBe(true);
//     } finally {
//       // Cleanup the user sign in after the test
//       await signOut();
//     }
//   });

//   it("should get the current user's profile successfully", async () => {
//     const { error } = await signInUsingEmailAndPassword({
//       email: process.env.TEST_USER_EMAIL!,
//       password: process.env.TEST_USER_PASSWORD!,
//     });
//     expect(error).toBeNull();

//     try {
//       const userProfile = await getCurrentUserProfile();
//       expect(userProfile).not.toBeNull();

//       expect(userProfile?.first_name == "Sigis").toBe(true);
//       expect(userProfile?.last_name == "Sigaitis").toBe(true);
//     } finally {
//       // Cleanup the user sign in after the test
//       await signOut();
//     }
//   });

//   it("should return null as the current user's profile", async () => {
//     const getCurrentUserMock = vi
//       .spyOn(usersQueries, "default")
//       .mockResolvedValue(null);

//     const userProfile = await getCurrentUserProfile();

//     expect(userProfile).toBeNull();

//     getCurrentUserMock.mockReset();
//   });

//   it("should confirm that a user's profile exists successfully", async () => {
//     const response = await userProfileExists(process.env.TEST_USER_UID!);

//     expect(response).toBe(true);
//   });

//   it("should deny that a user's profile exists successfully", async () => {
//     const response = await userProfileExists(
//       "00000000-0000-0000-0000-000000000000"
//     );

//     expect(response).toBe(false);
//   });

//   it("should get the user profile by id successfully", async () => {
//     const { data, error } = await getUserProfileById(
//       process.env.TEST_USER_UID!
//     );

//     expect(error).toBeNull();
//     expect(data).not.toBeNull();
//     expect(data?.first_name == "Sigis" && data?.last_name == "Sigaitis").toBe(
//       true
//     );
//   });

//   it("should insert a profile for a new user successfully", async () => {
//     // Create a new user
//     const { responseData, error } = await signUpUsingEmailAndPassword({
//       email: newTestEmail,
//       password: newTestPassword,
//       confirmPassword: newTestPassword,
//     });
//     expect(error).toBeNull();

//     try {
//       // Try inserting a profile for the new user
//       const { profile, error } = await insertProfile({
//         userId: responseData.user?.id!,
//         firstName: "Labis",
//         lastName: "Labutis",
//         dateOfBirth: "2000-01-01",
//         phoneNumber: "+37000000000",
//         photo: "",
//         country: "Lithuania",
//         city: "Vilnius",
//       });

//       expect(error).toBeNull();
//     } finally {
//       // Cleanup the user
//       await deleteUser();
//     }
//   });

//   it("should update the test user's profile successfully", async () => {
//     const { data: previousProfileData } = await getUserProfileById(
//       process.env.TEST_USER_UID!
//     );
//     const previousProfile = {
//       userId: process.env.TEST_USER_UID!,
//       firstName: previousProfileData!.first_name,
//       lastName: previousProfileData!.last_name,
//       dateOfBirth: previousProfileData!.birth_date,
//       phoneNumber: previousProfileData!.phone,
//       photo: previousProfileData!.photo,
//       country: previousProfileData!.country,
//       city: previousProfileData!.city,
//     };

//     const newProfileData = {
//       userId: process.env.TEST_USER_UID!,
//       firstName: "ChangedName",
//       lastName: "ChangedLastName",
//       dateOfBirth: "1999-05-19",
//       phoneNumber: "+37099999999",
//       photo: "Changed picture",
//       country: "Changed country",
//       city: "Changed city",
//     };

//     try {
//       const { profile, error } = await updateProfile(newProfileData);
//       expect(error).toBeNull();
//     } finally {
//       // Reset the profile data
//       await updateProfile(previousProfile);
//     }
//   });

//   it("should delete a user's profile", async () => {
//     const { error: registrationError } = await signUpUsingEmailAndPassword({
//       email: newTestEmail,
//       password: newTestPassword,
//       confirmPassword: newTestPassword,
//     });

//     expect(registrationError).toBeNull();

//     const { error: deletionError } = await deleteUser();
//     expect(deletionError).toBeNull();
//   });

//   it("should confirm that a user's host profile exists successfully", async () => {
//     const response = await hostProfileExists(process.env.TEST_USER_UID!);

//     expect(response).toBe(true);
//   });

//   it("should deny that a host's profile exists successfully", async () => {
//     const response = await hostProfileExists(
//       "00000000-0000-0000-0000-000000000000"
//     );

//     expect(response).toBe(false);
//   });

//   it("should get the host profile by id successfully", async () => {
//     const { data, error } = await getHostProfileById(
//       process.env.TEST_USER_UID!
//     );

//     expect(error).toBeNull();
//     expect(data).not.toBeNull();
//     expect(
//       data?.personal_code == "213124324234234" &&
//         data?.bank_account == "LT546645645647"
//     ).toBe(true);
//   });

//   it("should insert a host profile for a new user successfully", async () => {
//     try {
//       // Create a new user
//       const { responseData, error: signUpError } =
//         await signUpUsingEmailAndPassword({
//           email: newTestEmail,
//           password: newTestPassword,
//           confirmPassword: newTestPassword,
//         });

//       expect(signUpError).toBeNull();

//       // Try inserting a profile for the new user
//       const { host, error } = await insertHost({
//         userId: responseData.user?.id!,
//         personalCode: "000000000",
//         bankAccount: "LT546645645647",
//       });

//       expect(error).toBeNull();
//       expect(host).not.toBeNull();
//     } finally {
//       // Cleanup the usera
//       await deleteHost();
//       await deleteUser();
//     }
//   });

//   it("should update the test user's host profile successfully", async () => {
//     const { data: previousProfileData } = await getHostProfileById(
//       process.env.TEST_USER_UID!
//     );
//     const previousProfile = {
//       userId: process.env.TEST_USER_UID!,
//       personalCode: previousProfileData!.personal_code,
//       bankAccount: previousProfileData!.bank_account,
//     };

//     const newProfileData = {
//       userId: process.env.TEST_USER_UID!,
//       personalCode: "999999999",
//       bankAccount: "LT121212121212",
//     };

//     try {
//       const { host, error } = await updateHost(newProfileData);
//       expect(error).toBeNull();
//     } finally {
//       // Reset the profile data
//       await updateHost(previousProfile);
//     }
//   });

//   it("should delete a user's host profile", async () => {
//     // Create a new user
//     const { responseData } = await signUpUsingEmailAndPassword({
//       email: newTestEmail,
//       password: newTestPassword,
//       confirmPassword: newTestPassword,
//     });

//     // Insert a host profile for the new user
//     await insertHost({
//       userId: responseData.user?.id!,
//       personalCode: "000000000",
//       bankAccount: "LT546645645647",
//     });

//     try {
//       const { error } = await deleteHost();
//       expect(error == null || error == undefined).toBe(true);
//     } finally {
//       // Cleanup the usera
//       await deleteUser();
//     }
//   });

//   it("should catch a PostgrestError when deleting a user's host profile", async () => {
//     // Mock getPersonalListings to throw an error
//     const mockReturnValue = {
//       data: null,
//       error: {
//         message: "Listings error",
//         details: "Test details",
//       } as PostgrestError,
//     };

//     const getPersonalListingsMock = vi
//       .spyOn(listingsQueries, "getPersonalListings")
//       .mockResolvedValue(mockReturnValue);

//     // Create a new user
//     const { responseData } = await signUpUsingEmailAndPassword({
//       email: newTestEmail,
//       password: newTestPassword,
//       confirmPassword: newTestPassword,
//     });

//     // Insert a host profile for the new user
//     await insertHost({
//       userId: responseData.user?.id!,
//       personalCode: "000000000",
//       bankAccount: "LT546645645647",
//     });

//     try {
//       const { error } = await deleteHost();
//       expect(error).not.toBeNull();
//       expect(error!.message).toBe("Listings error");
//     } finally {
//       // Cleanup the usera
//       getPersonalListingsMock.mockRestore();
//       await deleteHost();
//       await deleteUser();
//     }
//   });

//   it("should catch a custom error when deleting a user's host profile", async () => {
//     // Mock getPersonalListings to throw an error
//     const mockReturnValue = {
//       data: [
//         {
//           address: "123 Main St",
//           title: "Cozy Apartment",
//           category_id: 0, // Example category ID
//           city: "Kaunas",
//           country: "Lietuva",
//           creation_date: new Date().toISOString(),
//           day_price: 10,
//           description: "",
//           host_id: "",
//           id: 0,
//           number_of_places: 1,
//           suspension_status: false,
//           images: [], // An array of images, can be empty for this mock
//           category: null, // Adjust this based on your type requirement
//           services: [
//             {
//               description: "AAAAAAAAAAA",
//               id: 0,
//               listing_id: 0,
//               price: 0,
//               title: "AAAAAAAAAAA",
//             },
//           ],
//         },
//       ],
//       error: null,
//     };

//     const getPersonalListingsMock = vi
//       .spyOn(listingsQueries, "getPersonalListings")
//       .mockResolvedValue(mockReturnValue);

//     // Create a new user
//     const { responseData } = await signUpUsingEmailAndPassword({
//       email: newTestEmail,
//       password: newTestPassword,
//       confirmPassword: newTestPassword,
//     });

//     // Insert a host profile for the new user
//     await insertHost({
//       userId: responseData.user?.id!,
//       personalCode: "000000000",
//       bankAccount: "LT546645645647",
//     });

//     try {
//       const { error } = await deleteHost();
//       expect(error).not.toBeNull();
//       expect(error!.message).toBe("User has listings");
//     } finally {
//       // Cleanup the usera
//       getPersonalListingsMock.mockRestore();
//       await deleteHost();
//       await deleteUser();
//     }
//   });

//   it("should get the correct host id from the reservation id", async () => {
//     const { data: listingData } = await getListingById(1);
//     const { reservation } = await insertReservation({
//       listingId: listingData!.id,
//       userId: process.env.TEST_USER_UID!,
//       orderedServices: [],
//       startDate: "2023-01-01",
//       endDate: "2023-01-02",
//       totalPrice: 100,
//     });

//     try {
//       const { data, error } = await getHostIdByReservationId(reservation!.id);
//       expect(error).toBeNull();
//       expect(data).toBeDefined();
//       expect(data == listingData!.host_id).toBe(true);
//     } finally {
//       await supabase.from("reservations").delete().eq("id", reservation!.id);
//     }
//   });

//   afterAll(() => {
//     mockCookieStorage = {};
//     vi.resetAllMocks();
//   });
// });
