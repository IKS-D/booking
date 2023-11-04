"use client"

import React from "react";
import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import { Listing, ListingCategory } from "@/types";
import {Report} from "@/types";
import { AnimatePresence } from "framer-motion";
import { useMultiplestepForm } from "@/hooks/useMultiplestepForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DatePickerWithRange } from "../DatePickerWithRange";

const CreateListingForm: React.FC = () => {

    const [formData, setFormData] = React.useState<Partial<Report>>({});

    // const [descriptionError, setDescriptionError] = React.useState(false);
    // const [cityError, setCityError] = React.useState(false);
    // const [addressError, setAddressError] = React.useState(false);
    // const [categoryError, setCategoryError] = React.useState(false);
    // const [guestError, setGuestError] = React.useState(false);
    // const [priceError, setPriceError] = React.useState(false);
  
    const [titleError, setTitleError] = React.useState(false);
    const [dateRangeError, setDateRangeError] = React.useState(false);

    const router = useRouter();

    const handleFormSubmit = () => {
      router.push("/reports");
      toast.success("Report created successfully");
    };

    const validateStep = () => {
          let hasErrors = false;
          if (!formData.title) {
              setTitleError(true);
              hasErrors = true;
          }
          if (!formData.start_date || !formData.end_date) {
            console.log("IVYKISBOO");
            setDateRangeError(true);
            hasErrors = true;
          }
          return !hasErrors;
    };

    return (
      <div
      className={`flex justify-between rounded-lg border border-neutral-700 p-4`}
    >
      <main className="w-full">
          <form className="w-full flex flex-col h-full p-10">
          <Input className="mb-5"
                  isRequired
                  label="Title"
                  isInvalid={titleError}
                  value={formData.title}
                  labelPlacement="outside"
                  placeholder="The title of the report"
                  onChange={(event) => {
                    setFormData({ ...formData, title: event.target.value })
                    setTitleError(false)
                  }}
            />
            <label className={`text-sm mb-2 ${dateRangeError ? 'text-danger' : ''}`}>Date range <span className="text-danger">*</span></label>
            <DatePickerWithRange 
                className={`mb-5 ${dateRangeError ? 'text-danger' : ''}`}
                onRangeChange={(dateRange) => {
                    if (dateRange.from && dateRange.to && dateRange.from <= dateRange.to) {
                      setFormData({
                        ...formData,
                        start_date: dateRange.from,
                        end_date: dateRange.to,
                      });
                      setDateRangeError(false);
                    }}}
            />
            <div className="flex items-center">
                <Button
                  onClick={() => {
                    if (validateStep()) {
                        handleFormSubmit()
                    }
                    }}
                  variant="ghost"
                  color="secondary"
                >
                    Create new report
                </Button>
            </div>
          </form>
      </main>
    </div>
    );
  };
  
  export default CreateListingForm;