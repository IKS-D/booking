"use client"

import React from "react";
import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import { AnimatePresence } from "framer-motion";
import { useMultiplestepForm } from "@/hooks/useMultiplestepForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Categories, Listing, getListingCategories, insertListing } from "@/actions/listings/getListings";

interface CreateListingFormProps {
  user: User;
}

export default function CreateListingForm({
  user,
}: CreateListingFormProps){

    const [formData, setFormData] = React.useState<Partial<Listing>>({});
    const [categories, setCategories] = React.useState<Categories>([]);
    const [errors, setErrors] = React.useState<Partial<Listing>>({});
    const [titleError, setTitleError] = React.useState(false);
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [countryError, setCountryError] = React.useState(false);
    const [cityError, setCityError] = React.useState(false);
    const [addressError, setAddressError] = React.useState(false);
    const [categoryError, setCategoryError] = React.useState(false);
    const [guestError, setGuestError] = React.useState(false);
    const [priceError, setPriceError] = React.useState(false);
  
    const router = useRouter();

    React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categories, error } = await getListingCategories();

        if (error) {
          toast.error("Error fetching categories");
          return;
        }

        setCategories(categories || []);

      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Something went wrong");
      }
    };

      fetchData();
    }, []);

    const handleFormSubmit = async () => {

      const { error } = await insertListing({
        listing: formData,
        user_id: user.id,
      });

      if (error) {
        toast.error("Something went wrong");
        return;
      }

      router.push("/listings/personal/");
      toast.success("Listing created successfully");
    };

    const validateStep = () => {
      // Implement validation logic for each step
      if (currentStepIndex === 0) {
        let hasErrors = false;
          if (!formData.title) {
              setTitleError(true);
              hasErrors = true;
          }
          if (!formData.description) {
              setDescriptionError(true);
              hasErrors = true;
          }

          return !hasErrors;
      }
      if (currentStepIndex === 1) {
        let hasErrors = false;
          if (!formData.country) {
            setCountryError(true);
            hasErrors = true;
          }

          if (!formData.city) {
              setCityError(true);
              hasErrors = true;
          }
          if (!formData.address) {
              setAddressError(true);
              hasErrors = true;
          }
          return !hasErrors;
      }
      if (currentStepIndex === 2) {
        let hasErrors = false;
          if (!formData.category) {
              setCategoryError(true);
              hasErrors = true;
          }
          if (!formData.number_of_places) {
              setGuestError(true);
              hasErrors = true;
          }
          if (!formData.day_price) {
              setPriceError(true);
              hasErrors = true;
          }
          return !hasErrors;
      }
      return true;
    };



    const {
      previousStep,
      currentStepIndex,
      nextStep,
      isFirstStep,
      isLastStep,
      steps,
      goTo,
      showSuccessMsg,
    } = useMultiplestepForm(4);
  
    return (
      <div
      className={`flex justify-between rounded-lg border border-neutral-700 p-4`}
    >
      <main className="w-full">
        {showSuccessMsg ? (
          <AnimatePresence mode="wait">
            {/* <SuccessMessage /> */}
          </AnimatePresence>
        ) : (
          <form
            className="w-full flex flex-col h-full p-10"
          >
            <AnimatePresence mode="wait">
              {currentStepIndex === 0 && (
                  <>
                  <Input className="mb-5"
                  isRequired
                  label="Title"
                  isInvalid={titleError}
                  value={formData.title}
                  labelPlacement="outside"
                  placeholder="The title of the listing"
                  onChange={(event) => {
                    setFormData({ ...formData, title: event.target.value })
                    setTitleError(false)
                  }}
                  />

                  <Textarea className="mb-5"
                    isRequired
                    label="Description"
                    isInvalid={descriptionError}
                    value={formData.description}
                    labelPlacement="outside"
                    placeholder="Description of the listing"
                    onChange={(event) => {
                      setFormData({ ...formData, description: event.target.value })
                      setDescriptionError(false)
                    }}
                  />
                  </>
                  
              )}

              {currentStepIndex === 1 && (
                <>
                  <Input className="mb-5 w-48"
                    isRequired
                    label="Country"
                    isInvalid={countryError}
                    value={formData.country}
                    labelPlacement="outside"
                    placeholder="The country of location"
                    onChange={(event) => {
                      setFormData({ ...formData, country: event.target.value })
                      setDescriptionError(false)
                    }}
                  />
                  <Input className="mb-5 w-48"
                    isRequired
                    label="City"
                    isInvalid={cityError}
                    value={formData.city}
                    labelPlacement="outside"
                    placeholder="The city of location"
                    onChange={(event) => {
                      setFormData({ ...formData, city: event.target.value })
                      setDescriptionError(false)
                    }}
                  />
                  <Input className="mb-5 w-96"
                    isRequired
                    isInvalid={addressError}
                    label="Address"
                    value={formData.address}
                    labelPlacement="outside"
                    placeholder="The address of the listing"
                    onChange={(event) => {
                      setAddressError(false)
                      setFormData({ ...formData, address: event.target.value })
                    }}
                  />
                </>
              )}

              {currentStepIndex === 2 && (
                <>
                <Input className="mb-5"
                  isRequired
                  label="Max guests"
                  isInvalid={guestError}
                  labelPlacement="outside"
                  type="number"
                  value={formData.number_of_places ? formData.number_of_places.toString() : ''}
                  placeholder="Maximum number of guests"
                  onChange={(event) => {
                    const value = parseInt(event.target.value, 10); // Parse input as an integer
                    setFormData({ ...formData, number_of_places: value });
                    setGuestError(false)
                  }}
                />
                <Input className="mb-5"
                  isRequired
                  label="Price for a day"
                  isInvalid={priceError}
                  labelPlacement="outside"
                  type="number"
                  placeholder="Price for one night"
                  value={formData.day_price ? formData.day_price.toString() : ''}
                  onChange={(event) => {
                    const value = parseInt(event.target.value, 10); // Parse input as an integer
                    setFormData({ ...formData, day_price: value });
                    setPriceError(false)
                  }}
                />
                <Select
                    isRequired
                    label="Category"
                    isInvalid={categoryError}
                    labelPlacement="outside"
                    placeholder="Select the category"
                    className="max-w-xs mb-5"
                    onChange={(event) =>{
                      const categoryId = parseInt(event.target.value, 10);
                      setFormData({ ...formData, category_id: categoryId})
                      setCategoryError(false)
                    }}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </Select>
                </>
              )}

              {currentStepIndex === 3 && (
                <>
                <Input className="mb-5"
                label="Photos of the listing"
                labelPlacement="outside-left"
                type="file"
                multiple
                />
                </>
              )}
            </AnimatePresence>
            <div className="w-full items-center flex justify-between">
              <div className="">
                <Button
                  onClick={previousStep}
                  type="button"
                  variant="ghost"
                  className={`${
                    isFirstStep
                      ? "invisible"
                      : "visible p-0 text-neutral-200 hover:text-white"
                  }`}
                >
                  Go Back
                </Button>
              </div>
              <div className="flex items-center">
                <Button
                  onClick={() => {
                    if (validateStep()) {
                      if (isLastStep) {
                        handleFormSubmit();
                      } else {
                        nextStep();
                      }
                    }}}
                  variant="ghost"
                  color="secondary"
                >
                  {isLastStep ? "Create new listing" : "Next Step"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
    );
  };
