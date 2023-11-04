"use client"

import React from "react";
import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import { Listing, ListingCategory } from "@/types";
import { AnimatePresence } from "framer-motion";
import { useMultiplestepForm } from "@/hooks/useMultiplestepForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateListingForm: React.FC = () => {

    const [formData, setFormData] = React.useState<Partial<Listing>>({});
    const [errors, setErrors] = React.useState<Partial<Listing>>({});
    const [titleError, setTitleError] = React.useState(false);
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [cityError, setCityError] = React.useState(false);
    const [addressError, setAddressError] = React.useState(false);
    const [categoryError, setCategoryError] = React.useState(false);
    const [guestError, setGuestError] = React.useState(false);
    const [priceError, setPriceError] = React.useState(false);
  
    const router = useRouter();

    const handleFormSubmit = () => {
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
          if (!formData.max_guests) {
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

    const cities = [
      "New York",
      "Los Angeles",
      "Chicago",
      "San Francisco",
      "Miami",
      "Boston",
      "Seattle",
      "Austin",
      "Denver",
      "Atlanta",
    ];

    const categories = [
      "apartment",
      "house",
      "room",
      "flat",
    ]



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
                  <Select
                    isRequired
                    isInvalid={cityError}
                    label="City"
                    labelPlacement="outside"
                    placeholder="Select the city"
                    className="max-w-xs mb-5"
                    value={formData.city || ""} // Ensure formData.city is a string or an empty string
                    onChange={(event) => {
                        setFormData({ ...formData, city: event.target.value })
                        setCityError(false)
                    }}
                  >
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input className="mb-5"
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
                  value={formData.max_guests ? formData.max_guests.toString() : ''}
                  placeholder="Maximum number of guests"
                  onChange={(event) => {
                    const value = parseInt(event.target.value, 10); // Parse input as an integer
                    setFormData({ ...formData, max_guests: value });
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
                      setFormData({ ...formData, category: event.target.value as ListingCategory})
                      setCategoryError(false)
                    }}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
  
  export default CreateListingForm;