import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import image1 from "../assets/jpeg444.jpg";
import { Buffer } from 'buffer';
import supabase from "@/supabase/supabase";
import {
    getListingById,
    getListings,
    getChartInformation,
    getPersonalListings,
    deleteListing,
    insertListing,
    updateListing,
    getListingCategories,
} from "@/actions/listings/listingsQueries";
import { StaticImageData } from "next/image";

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
  }));

  
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

    describe("getListingById", () => {
        it("should fetch listing by ID", async () => {
            // Call the helper function to insert a listing before this test
            listing = await insertTestListing();
            listingId = listing.id;

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

            await deleteTestListing();
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
            listing = await insertTestListing();
            listingId = listing.id;
            expect(listing).toEqual(
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

            await deleteTestListing();
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
    });

    describe("getChartInformation", () => {
        it("should fetch chart information", async () => {
            listing = await insertTestListing();
            listingId = listing.id;

            const { data: chartInfo } = await getChartInformation(listingId);

            await deleteTestListing();
            
            expect(chartInfo).not.toBeNull();

            expect(typeof chartInfo).toBe('object');

            expect(Object.keys(chartInfo!).length).toBeGreaterThan(0);

            for (const key in chartInfo) {
                const numKey = Number(key); // Convert key to a number
                expect(numKey).toBeGreaterThan(0); // Ensure the key is a positive number
                expect(typeof chartInfo[Number(key)]).toBe('number'); // Ensure the value is a number
            }
            
            
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
            listing = await insertTestListing();
            listingId = listing.id;

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

            await deleteTestListing();
        });
    });

    describe("getPersonalListings", () => {
        it("should fetch personal listings", async () => {
    
            await insertTestListing(); // Insert a test listing associated with testUserId
    
            const { data: personalListings } = await getPersonalListings(testUserId); // Fetch personal listings
    
            await deleteTestListing(); // Clean up by deleting the test listing
    
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
            listing = await insertTestListing();
            listingId = listing.id;

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
    });
});
 