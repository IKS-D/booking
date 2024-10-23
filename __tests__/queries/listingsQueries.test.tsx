import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import image1 from "../assets/jpeg444.jpg";
import { Buffer } from 'buffer';
import supabase from "@/supabase/supabase";
import {
    getListingById,
    getListings,
    getChartInformation,
    getFilenameFromUrl,
    getPersonalListings,
    deleteListing,
    insertListing,
    updateListing,
    getListingCategories,
} from "@/actions/listings/listingsQueries";
import { StaticImageData } from "next/image";
import { FileObject } from "@supabase/storage-js";
import { getBrowsedFiles } from "./FlieList-mock-creator";




describe("Listings Queries", () => {
    const testUserId = "32f8f198-a8c3-4dec-b5db-09d5daec2918";
    const testTitle = "Test Listing";
    const testDescription = "Test Description";
    const testCountry = "Test Country";
    const testCity = "Test City";
    const testAddress = "Test Address"
    const testMaxGuests = 5;
    const testPrice = 70;
    const testCategory = 1;
    const testService = { title: "Test Service", description: "Test Description", price: 100 };
    const emptyFiles: FileList = [] as any;

    let listingId: number;
    let listing : any;

    const insertTestListing = async () => {    
        const { data: addedListing } = await insertListing({
            listing: {
                title: testTitle,
                description: testDescription,
                country: testCountry,
                city: testCity,
                address: testAddress,
                number_of_places: testMaxGuests,
                day_price: testPrice,
                category_id: testCategory
            },
            user_id: testUserId,
            files: emptyFiles , // This would need to be mocked as per your test framework's setup
            services: [testService],
        });
        
        if (!addedListing) {
            throw new Error("Inserted listing is null");
        }
        
        listingId = addedListing.id;
        return addedListing;
    };

    

    const deleteTestListing = async () => {
        const { error } = await deleteListing({ listing_id: listingId });
        if (error) {
            console.error("Error deleting listing:", error);
            throw new Error("Failed to delete listing");
        }
    };

    //Set-up phase
    beforeEach(async () => {
        vi.mock("next/cache", () => ({
            revalidatePath: vi.fn(),
        }));
        const testName = expect.getState().currentTestName;
        if (testName && !testName.includes("insertListing")) {
            listing = await insertTestListing();
            listingId = listing.id; 
        } 
    });


    //Tear-down phase
    afterEach(async () => {
        vi.restoreAllMocks();
        const testName = expect.getState().currentTestName;
        if (testName && !testName.includes("deleteListing")) {
            if (listingId) {
                try {
                  await deleteTestListing();
                } catch (error) {
                  console.error("Error in afterEach when deleting listing:", error);
                }
              }
        }  
      });

    describe("getListingById", () => {
        it("should fetch listing by ID", async () => {
            // Call the helper function to insert a listing before this test
            const { data: fetchedListing } = await getListingById(listingId);
        
            expect(fetchedListing).toEqual(
              expect.objectContaining({
                  id: listingId, // Verify that the fetched listing has the correct ID
                  title: testTitle, // You can add more checks for the listing's attributes
                  description: testDescription,
                  country: testCountry,
                  city: testCity,
                  address: testAddress,
                  number_of_places: testMaxGuests,
                  day_price: testPrice * 100, // Ensure price is converted to cents
              })
            );
        });

        it("should handle error when fetching listing with invalid ID", async () => {
            const invalidListingId = 99999; // Use an ID that doesn't exist or is out of range

            const result = await getListingById(invalidListingId);

            // Check the returned structure
            expect(result.data).toBeNull();
            expect(result.error).not.toBeNull(); 
        });
    })

    describe("insertListing", () => {
        it("should insert a new listing", async () => {
            const { data: addedListing } = await insertListing({
                listing: {
                    title: testTitle,
                    description: testDescription,
                    country: testCountry,
                    city: testCity,
                    address: testAddress,
                    number_of_places: testMaxGuests,
                    day_price: testPrice,
                    category_id: testCategory
                },
                user_id: testUserId,
                files: emptyFiles , // This would need to be mocked as per your test framework's setup
                services: [testService],
            });

            const listingId = addedListing?.id;

            expect(addedListing).toEqual(
                expect.objectContaining({
                    id: listingId,
                    title: testTitle,
                    description: testDescription,
                    country: testCountry,
                    city: testCity,
                    address: testAddress,
                    number_of_places: testMaxGuests,
                    day_price: testPrice * 100,
                })
            );
        });

        it("should handle error when inserting a listing with invalid category", async () => {
            const { data: insertedListing, error } = await insertListing({
                listing: {
                    title: testTitle,
                    description: testDescription,
                    country: testCountry,
                    city: testCity,
                    address: testAddress,
                    number_of_places: testMaxGuests,
                    day_price: testPrice,
                    category_id: 10, // Use an invalid category ID
                },
                user_id: testUserId,
                files: emptyFiles,
                services: [testService],
            });

            expect(insertedListing).toBeNull(); // Ensure the listing is not inserted
            expect(error).not.toBeNull(); // Ensure an error is returned
        });

        it("should the insert without services", async () => {
            const { data: insertedListing, error } = await insertListing({
                listing: {
                    title: testTitle,
                    description: testDescription,
                    country: testCountry,
                    city: testCity,
                    address: testAddress,
                    number_of_places: testMaxGuests,
                    day_price: testPrice,
                    category_id: testCategory,
                },
                user_id: testUserId,
                files: emptyFiles,
                services: [], // Use an empty array for services
            });

            expect(insertedListing).toBeDefined(); // Ensure the listing is not inserted

            expect(error).toBeNull(); // Ensure an error is returned
        });

        it("should handle error when service upload goes wrong", async () => {

            const mockInsertServiceError = {
                message: "Failed to insert service",
                details: "Additional error details",
                hint: "",
                code: "54321",
            };
    
            const mockInsertService = vi.fn().mockResolvedValueOnce({
                data: null, // Simulate that no service was inserted
                error: mockInsertServiceError, // Return the simulated error
            });

            const mockInsertListing = vi.fn().mockResolvedValueOnce({
                data: { id: 1 }, // Simulating a successful listing insertion
                error: null,
            });

            vi.spyOn(supabase, "from").mockImplementation((tableName: string) => {
                const queryBuilderMock = {
                    insert: vi.fn().mockImplementation(() => {
                        if (tableName === "listings") {
                            return {
                                select: vi.fn().mockReturnValue({
                                    single: vi.fn().mockResolvedValue({
                                        data: { id: 1 }, // Mock single listing data
                                        error: null,
                                    }),
                                }),
                            };
                        } else if (tableName === "services") {
                            return {
                                    data: null,
                                    error: {
                                        message: "Failed to insert service",
                                        details: "Additional error details",
                                        hint: "",
                                        code: "54321",
                                    },
                            };
                        }
                        return { data: null, error: null }; // Default return for other tables
                    }),
                    select: vi.fn(),
                    upsert: vi.fn(),
                    update: vi.fn(),
                    delete: vi.fn(),
                    headers: {},
                    url: new URL("http://localhost"),
                };
    
                return queryBuilderMock;
            });

            const { data: insertedListing, error } = await insertListing({
                listing: {
                    title: testTitle,
                    description: testDescription,
                    country: testCountry,
                    city: testCity,
                    address: testAddress,
                    number_of_places: testMaxGuests,
                    day_price: testPrice,
                    category_id: testCategory,
                },
                user_id: testUserId,
                files: emptyFiles,
                services: [testService], // Use an empty array for services
            });

            expect(insertedListing).toBeDefined(); // Ensure the listing is not inserted
            expect(error).not.toBeNull(); // Ensure an error is returned
        });
    });

    describe("getListings", () => {
        it("should fetch all listings", async () => {
            const { data: listings } = await getListings();
    
            // Check if listings is an array
            expect(Array.isArray(listings)).toBe(true);
            
            // Check if the array is not empty
            expect(listings!.length).toBeGreaterThan(0); // Assumes there should be at least one listing
    
            // Validate the general structure of each listing
            listings!.forEach(listing => {
                expect(listing).toHaveProperty('id');
                expect(listing).toHaveProperty('title');
                expect(listing).toHaveProperty('day_price');
    
                // Validate types
                expect(typeof listing.id).toBe('number'); // or 'string', depending on your ID type
                expect(typeof listing.title).toBe('string');
                expect(typeof listing.day_price).toBe('number');
            });
        });

        it("should log an error when fetching listings fails", async () => {

            // More of a stub than a mock, as it only simulates the response
            supabase.from = () => ({
                select: () => Promise.resolve({
                    data: null,
                    error: {
                        message: "Failed to fetch listing",
                        details: "Additional error details",
                        hint: "",
                        code: "12345"
                    }
                })
            }as any);
        
            // A mock for console.error
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        
            // Call the function
            const { data, error } = await getListings();
        
            // Assert that console.error was called
            expect(consoleSpy).toHaveBeenCalled();
        
            // Assert that console.error was called with the correct error object
            expect(consoleSpy).toHaveBeenCalledWith({
                message: "Failed to fetch listing",
                details: "Additional error details",
                hint: "",
                code: "12345",
            });
        
            // Assert the function's returned values
            expect(data).toBeNull();
            expect(error).not.toBeNull();
        
            // Restore the console mock
            consoleSpy.mockRestore();
        });


    });

    //Parametrized test used
    describe('getFilenameFromUrl', () => {
        it.each([
            ['http://example.com/path/to/file.jpg', 'to/file.jpg'],
            ['http://example.com/another/path/file2.png', 'path/file2.png'],
            ['http://example.com/file3.svg', 'file3.svg'],
            ['https://subdomain.example.com/folder/file4.jpeg', 'folder/file4.jpeg'],
            ['invalid-url', 'invalid-url'], // Invalid URL should just return the input
        ])('should return the correct last two parts of a URL path for %s', (url, expected) => {
            const result = getFilenameFromUrl(url);
            expect(result).toBe(expected);
        });
    });

    describe("getChartInformation", () => {
        it("should fetch chart information", async () => {
            const { data: chartInfo } = await getChartInformation(listingId);
            
            expect(chartInfo).not.toBeNull();

            expect(typeof chartInfo).toBe('object');

            expect(Object.keys(chartInfo!).length).toBeGreaterThan(0);

            for (const key in chartInfo) {
                const numKey = Number(key); // Convert key to a number
                expect(numKey).toBeGreaterThan(0); // Ensure the key is a positive number
                expect(typeof chartInfo[Number(key)]).toBe('number'); // Ensure the value is a number
            }
            
            
        });

        it("should log an error when listing has no city", async () => {
            // Mock the Supabase response to simulate an error

            vi.spyOn(supabase, "from").mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValueOnce({
                            data: { city: null }, // Simulate a listing without a city
                            error: null
                        })
                    })
                })
            } as any);
        
            // Mock console.error
            const consoleSpy = vi.spyOn(console, "error");
        
            // Call the function
            const { data, error } = await getChartInformation(1);
        
            // Assert that console.error was called
            expect(consoleSpy).toHaveBeenCalled();
          
            // Restore the console mock
            consoleSpy.mockRestore();
        });

        it("should log an error if fetching number_of_places, day_price of city goes wrong", async () => {
            // Mock the Supabase response to simulate an error


            // This could be called a mock, due to the fact that it simulates different responses based on the query
            vi.spyOn(supabase, "from").mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: (column: string, value: any) => {
                        // Mock the specific query for `city` in the first case
                        if (column === "city") {
                            return {
                                data: null, // Simulate a listing without a city
                                error:{
                                    message: "Failed to fetch listing",
                                    details: "Additional error details",
                                    hint: "",
                                    code: "12345"
                                }
                            };
                        }
                        // Mock the specific query for `id` in the second case
                        if (column === "id") {
                            return {
                                single: vi.fn().mockReturnValue({
                                    data: { city: "Sample City" }, // Simulate a listing with city data
                                    error: null,
                                }),
                            };
                        }
                        // Default return for unexpected queries
                        return {
                            data: null,
                            error: "Unexpected query",
                        };
                    },
            })}  as any);
        
            // Mock console.error
            const consoleSpy = vi.spyOn(console, "error");
        
            // Call the function
            const { data, error } = await getChartInformation(1);

            // Assert that console.error was called
            expect(consoleSpy).toHaveBeenCalled();
          
            // Restore the console mock
            consoleSpy.mockRestore();
        });


        it("should handle error when fetching chart information for invalid listingId", async () => {
            const invalidListingId = -1; // Use an ID that doesn't exist or is out of range
            
            const mockErrorResponse = {
                code: 'PGRST116',
                details: 'The result contains 0 rows',
                hint: null,
                message: 'JSON object requested, multiple (or no) rows returned',
            };

            const result = await getChartInformation(invalidListingId);

            // Check the returned structure
            expect(result.data).toBeNull();
            expect(result.error).toEqual(mockErrorResponse);
        });
    });

    describe("getListingCategories", () => {
        it("should fetch listing categories", async () => {
            const { data: categories } = await getListingCategories();
    
            // Check if categories is an array
            expect(Array.isArray(categories)).toBe(true);
            
            // Check if the array is not empty
            expect(categories!.length).toBeGreaterThan(0); // Assumes there should be at least one category
    
            // Validate the general structure of each category
            categories!.forEach(category => {
                expect(category).toHaveProperty('id');
                expect(category).toHaveProperty('name');
    
                // Validate types
                expect(typeof category.id).toBe('number'); // or 'string', depending on your ID type
                expect(typeof category.name).toBe('string');
            });
        });
    });

    describe("updateListing", () => {
        it("should update a listing", async () => {

            const updatedTitle = "Updated Title";
            const updatedDescription = "Updated Description";
            const updatedMaxGuests = 10;
            const updatedPrice = 200;

            const { updateError } = await updateListing({
                editedListing: {
                  title: updatedTitle,
                  description: updatedDescription,
                  number_of_places: updatedMaxGuests,
                  day_price: updatedPrice,
                },
                files: emptyFiles,
                listing_id: listingId,
              });

            expect(updateError).toBeNull();

            const { data: updatedListing } = await getListingById(listingId);

            expect(updatedListing).toEqual(
                expect.objectContaining({
                    title: updatedTitle,
                    description: updatedDescription,
                    number_of_places: updatedMaxGuests,
                    day_price: updatedPrice * 100,
                })
            );
        });
    });

    describe("getPersonalListings", () => {
        it("should fetch personal listings", async () => {
            const { data: personalListings } = await getPersonalListings(testUserId); // Fetch personal listings
    
            // Check if personalListings is an array
            expect(Array.isArray(personalListings)).toBe(true);
    
            // Check if the array is not empty
            expect(personalListings!.length).toBeGreaterThan(0); // Assumes there should be at least one listing
    
            // Check if every listing in personalListings has the correct user_id
            personalListings!.forEach(listing => {
                expect(listing.host_id).toBe(testUserId); // Replace 'host_id' with the actual user id field in your data model
            });
        });
    });

    describe("deleteListing", () => {
        it("should delete a listing", async () => {
            const { error } = await deleteListing({ listing_id: listingId });

            expect(error).toBeNull();

            const { data: fetchedListing } = await getListingById(listingId);

            expect(fetchedListing).toBeNull();
        });

        // In Supabase, if you try to delete a record that doesn't exist, it won't raise an error; 
        //instead, it will simply result in no rows being affected.
        it("should return an error when deleting a listing with invalid ID", async () => {

            const invalidListingId = -1; // Use an invalid ID

            const { error } = await deleteListing({ listing_id: invalidListingId });

            expect(error).toBeNull();
        });

        it("should return an error when an error is achieved when fetching reservations", async () => {
            // Mock the Supabase response to simulate an error
            vi.spyOn(supabase, "from").mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            gt: vi.fn().mockResolvedValueOnce({
                                data: null,
                                error: {
                                    message: "Failed to fetch reservations",
                                    details: "Additional error details",
                                    hint: "",
                                    code: "12345",
                                },
                            }),
                        }),
                    }),
                }),
            } as any);
        
            // Call the function
            const { error } = await deleteListing({ listing_id: 1 });
        
            // Assert that an error was returned
            expect(error).not.toBeNull();
        });

        it('should return an error if there are active reservations', async () => {
            // Mock Supabase to return active reservations

            // This could be called a stub, due to the fact that it only simulates a response and doesn't have any logic
            vi.spyOn(supabase, 'from').mockReturnValue({
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    gt: vi.fn().mockResolvedValueOnce({
                      data: [{ id: 1 }, { id: 2 }], // Mock active reservations
                      error: null,
                    }),
                  }),
                }),
              }),
            } as any);
        
            const result = await deleteListing({ listing_id: 1 });
        
            expect(result.error).toBe('Cannot delete listing with active reservations');
        });

        it("should return an error when an error is achieved when fetching photos", async () => {
            // Mock the Supabase response for reservations query to simulate success
            
            vi.spyOn(supabase, "from").mockImplementation((tableName: string) => {
                const queryBuilderMock = {
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockImplementation((column: string, value: any) => {
                            if (tableName === "reservations") {
                                if (column === "listing_id") {
                                    return {
                                        eq: vi.fn().mockReturnValue({
                                            gt: vi.fn().mockResolvedValueOnce({
                                                data: [], // No active reservations
                                                error: null,
                                            }),
                                        }),
                                    };
                                }
                            } else if (tableName === "photos") {
                                if (column === "listing_id") {
                                    return {
                                        data: null,
                                        error: {
                                            message: "Failed to fetch photos",
                                            details: "Additional error details",
                                            hint: "",
                                            code: "67890",
                                        },
                                    };
                                }
                            }
                            return {}; // Default case if column or table doesn't match
                        }),
                    }),
                    // Include other properties of PostgrestQueryBuilder to match the type
                    insert: vi.fn(),
                    upsert: vi.fn(),
                    update: vi.fn(),
                    delete: vi.fn(),
                    headers: {},
                    url: new URL("http://localhost"),
                };
            
                return queryBuilderMock;
            });
        
            // Call the function
            const { error } = await deleteListing({ listing_id: 1 });
        
            // Assert that an error was returned
            expect(error).not.toBeNull();
            expect(error).toEqual({
                message: "Failed to fetch photos",
                details: "Additional error details",
                hint: "",
                code: "67890",
            });
        });
        
        it("should return an error when an error is achieved when deleting the listing", async () => {
            // Mock the Supabase response for reservations query to simulate success
            vi.spyOn(supabase, "from").mockImplementation((tableName: string) => {
                const queryBuilderMock = {
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockImplementation((column: string, value: any) => {
                            if (tableName === "reservations") {
                                if (column === "listing_id") {
                                    return {
                                        eq: vi.fn().mockReturnValue({
                                            gt: vi.fn().mockResolvedValueOnce({
                                                data: [], // No active reservations
                                                error: null,
                                            }),
                                        }),
                                    };
                                }
                            } else if (tableName === "photos") {
                                if (column === "listing_id") {
                                    return {
                                        data: [],
                                        error: null,
                                    };
                                }
                            }
                            return {}; // Default case if column or table doesn't match
                        }),
                    }),

                    delete: vi.fn().mockReturnValue({
                        eq: vi.fn().mockResolvedValueOnce({
                            error: {
                                message: "Failed to delete listing",
                                details: "Additional error details",
                                hint: "",
                                code: "54321",
                            },
                        }),
                    }),

                    // Include other properties of PostgrestQueryBuilder to match the type
                    insert: vi.fn(),
                    upsert: vi.fn(),
                    update: vi.fn(),
                    headers: {},
                    url: new URL("http://localhost"),
                };
            
                return queryBuilderMock;
            });
        
            // Call the function
            const { error } = await deleteListing({ listing_id: 1 });
        
            // Assert that an error was returned
            expect(error).not.toBeNull();
            expect(error).toEqual({
                message: "Failed to delete listing",
                details: "Additional error details",
                hint: "",
                code: "54321",
            });
        });
    });
});
 