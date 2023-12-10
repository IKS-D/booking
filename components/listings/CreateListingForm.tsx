"use client";

import React from "react";
import { Button, Input, Textarea, Select, SelectItem, select } from "@nextui-org/react";
import { AnimatePresence } from "framer-motion";
import { useMultiplestepForm } from "@/hooks/useMultiplestepForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Categories, Listing, ServiceInput, getListingCategories, insertListing } from "@/actions/listings/getListings";
import FileUpload from "./FileUpload";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate-path";
import DynamicForm from "./DynamicForm";
import { Database, Tables, Enums } from "../../supabase/database-generated.types";
import { Label } from "@radix-ui/react-label";

interface CreateListingFormProps {
  user: User;
}

export default function CreateListingForm({
  user,
}: CreateListingFormProps) {

  const [formData, setFormData] = React.useState<Partial<Listing>>({});
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
  const [services, setServices] = React.useState<ServiceInput[]>([]);
  const [categories, setCategories] = React.useState<Categories>([]);
  const [titleError, setTitleError] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState(false);
  const [countryError, setCountryError] = React.useState(false);
  const [cityError, setCityError] = React.useState(false);
  const [addressError, setAddressError] = React.useState(false);
  const [categoryError, setCategoryError] = React.useState(false);
  const [guestError, setGuestError] = React.useState(false);
  const [priceError, setPriceError] = React.useState(false);
  const [serviceErrors, setServiceErrors] = React.useState<boolean[][]>([]);


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
      files: selectedFiles!,
      services: services!,
    });

    if (error) {
      toast.error("Something went wrong");
      return;
    }
    router.push("/listings/personal/");
    router.refresh();
    toast.success("Listing created successfully");
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      // Handle the files (either a single file or multiple files)
      setSelectedFiles(files)
    } else {
      // Handle the case where no files are selected
      console.log('No files selected');
    }
  };

  const handleInputChange = (index: number, field: keyof ServiceInput, value: string | number | undefined) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value};
  
    setServices(updatedServices);
  };
  

  const addService = () => {
    setServices([...services, { title: '', description: '', price: -1 }]);

    setServiceErrors([...serviceErrors, [false, false, false]])
  };

  const removeService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);

    const updatedErrors = [...serviceErrors];
    updatedErrors.splice(index, 1);
    setServiceErrors(updatedErrors);
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
      if (!formData.category_id) {
        setCategoryError(true);
        hasErrors = true;
      }
      if (!formData.number_of_places || formData.number_of_places < 1) {
        setGuestError(true);
        hasErrors = true;
      }
      if (!formData.day_price || formData.day_price < 1) {
        setPriceError(true);
        hasErrors = true;
      }
      return !hasErrors;
    }

    if (currentStepIndex === 4) {
      let hasErrors = false;
      let newErrors = [...serviceErrors];

      services.forEach((service, index) => {
        // If the array at the current index doesn't exist, create an empty array
        newErrors[index] = newErrors[index] || [];

        console.log(index);

        if (service.title === '') {
          console.log("gerai");
          newErrors[index][0] = true;
          hasErrors = true;
        }
        if (service.description === '') {
          console.log("gerai");
          newErrors[index][1] = true;
          hasErrors = true;
        }
        if (service.price === -1 || service.price < 1) {
          console.log("gerai");
          newErrors[index][2] = true;
          hasErrors = true;
        }
      });

      // Update the state with the entire newErrors array
      setServiceErrors(newErrors);
      console.log(newErrors);

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
  } = useMultiplestepForm(5);

  return (
    <div
      className={`flex justify-between rounded-lg border border-neutral-700 p-4`}
    >
      <main className="w-full">
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
                  min="1"
                  value={formData.number_of_places ? formData.number_of_places.toString() : ''}
                  placeholder="Maximum number of guests"
                  onChange={(event) => {
                    const value = parseInt(event.target.value, 10); // Parse input as an integer
                    setFormData({ ...formData, number_of_places: value });
                    setGuestError(false)
                  }}
                />
                <Input
                  className="mb-5"
                  isRequired
                  label="Price for a day"
                  min="1"
                  isInvalid={priceError}
                  labelPlacement="outside"
                  type="number"
                  step="0.01"
                  placeholder="Price for one night"
                  value={formData.day_price ? formData.day_price.toString() : ''}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    const regex = /^\d+(\.\d{0,2})?$/;  // Allow up to two decimal places
                    if (rawValue === '' || regex.test(rawValue)) {
                      const value = rawValue === '' ? undefined : parseFloat(rawValue);
                      setFormData({ ...formData, day_price: value });
                      setPriceError(false);
                    }
                  }}
                />

                <Select
                  isRequired
                  label="Category"
                  isInvalid={categoryError}
                  labelPlacement="outside"
                  placeholder="Select the category"
                  className="max-w-xs mb-5"
                  onChange={(event) => {
                    const categoryId = parseInt(event.target.value, 10);
                    setFormData({ ...formData, category_id: categoryId })
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
                <FileUpload onFileChange={(files: FileList | null) => handleFileUpload(files)}></FileUpload>
              </>
            )}

            {currentStepIndex === 4 && (
              <>
                <div className="mb-10">
                  <Label className="text-lg font-semibold mb-4">Add Additional Services:</Label>
                  {services.map((service, index) => (
                    <div key={index} className="flex space-x-4 items-center mb-4">
                      <label className="flex-grow">
                        <Input
                          isRequired
                          isInvalid={serviceErrors[index] && serviceErrors[index][0]}
                          type="text"
                          placeholder="Name of additional service"
                          value={service.title !== '' ? service.title : ''}
                          onChange={(e) => {
                            const newErrors = [...serviceErrors];
                            newErrors[index][0] = false;
                            setServiceErrors(newErrors);
                            handleInputChange(index, 'title', e.target.value);
                          }}
                        />
                      </label>

                      <label className="flex-grow">
                        <Input
                          isRequired
                          isInvalid={serviceErrors[index] && serviceErrors[index][1]}
                          type="text"
                          placeholder="Short description"
                          value={service.description !== '' ? service.description : ''}
                          onChange={(e) => {
                            handleInputChange(index, 'description', e.target.value);
                            const newErrors = [...serviceErrors];
                            newErrors[index][1] = false;
                            setServiceErrors(newErrors);
                          }}
                        />
                      </label>

                      <label className="flex-grow">
                        <Input
                          isRequired
                          isInvalid={serviceErrors[index] && serviceErrors[index][2]}
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Price for one night"
                          value={service.price !== -1 ? service.price.toString() : ''}
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            const regex = /^\d+(\.\d{0,2})?$/;  // Allow up to two decimal places
                            

                            if (rawValue === '' || regex.test(rawValue)) {
                              const value = rawValue === '' ? undefined : parseFloat(rawValue);

                              const newErrors = [...serviceErrors];
                              newErrors[index][2] = false;
                              setServiceErrors(newErrors);
                              handleInputChange(index, 'price', value);  // Use the parsed value here
                            }

                                
                              }}

                        />
                      </label>


                    </div>
                  ))}

                  {services.length > 0 && (
                    <Button type="button" className="mb-2" variant="ghost" onClick={() => removeService(services.length - 1)}>
                      Remove
                    </Button>
                  )}

                  <div>
                    <Button type="button" variant="ghost" onClick={addService}>
                      Add
                    </Button>
                  </div>
                </div>
              </>
            )}

          </AnimatePresence>
          <div className="w-full items-center flex justify-between">
            <div className="">
              <Button
                onClick={previousStep}
                type="button"
                variant="ghost"
                className={`${isFirstStep
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
                  }
                }}
                variant="ghost"
                color="secondary"
              >
                {isLastStep ? "Create new listing" : "Next Step"}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
