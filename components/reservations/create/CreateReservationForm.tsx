"use client";

import { useMultiplestepForm } from "@/hooks/useMultiplestepForm";
import { Button } from "@nextui-org/react";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";
import { AdditionalService, Reservation } from "@/types";
import SelectDateRangeForm from "./SelectDateRangeForm";
import AdditionalServicesForm from "./AdditionalServicesForm";
import SummaryForm from "./SummaryForm";

export default function CreateReservationForm() {
  const [formData, setFormData] = useState<Partial<Reservation>>({});

  const additionalServices: AdditionalService[] = [
    {
      id: "1",
      name: "Breakfast",
      description: "Breakfast in the room",
      price: 10,
    },
    {
      id: "2",
      name: "Lunch",
      description: "Lunch in the room",
      price: 15,
    },
    {
      id: "3",
      name: "Dinner",
      description: "Dinner in the room",
      price: 15,
    },
    {
      id: "4",
      name: "Laundry",
      description: "Laundry service",
      price: 10,
    },
    {
      id: "5",
      name: "Cleaning",
      description: "Cleaning service",
      price: 10,
    },
    {
      id: "6",
      name: "Room Service",
      description: "Room service",
      price: 10,
    },
    {
      id: "7",
      name: "Extra Bed",
      description: "Extra bed",
      price: 10,
    },
    {
      id: "8",
      name: "Extra Towels",
      description: "Extra towels",
      price: 10,
    },
    {
      id: "9",
      name: "Extra Pillows",
      description: "Extra pillows",
      price: 10,
    },
  ];

  const {
    previousStep,
    nextStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    steps,
    goTo,
    showSuccessMsg,
  } = useMultiplestepForm(3);

  const handleOnSubmit = () => {
    toast.success("Reservation created successfully");
  };

  return (
    <div
      className={`flex justify-between h-[500px] rounded-lg border border-neutral-700 p-4`}
    >
      <main className="w-full">
        {showSuccessMsg ? (
          <AnimatePresence mode="wait">
            {/* <SuccessMessage /> */}
          </AnimatePresence>
        ) : (
          <form
            onSubmit={handleOnSubmit}
            className="w-full flex flex-col justify-between h-full"
          >
            <AnimatePresence mode="wait">
              {currentStepIndex === 0 && (
                <SelectDateRangeForm
                  key="step1"
                  formData={formData}
                  onDateRangeUpdate={(dateRange) => {
                    setFormData({
                      ...formData,
                      start_date: dateRange.from,
                      end_date: dateRange.to,
                    });
                  }}
                />
              )}

              {currentStepIndex === 1 && (
                <AdditionalServicesForm
                  key="step2"
                  additionalServices={additionalServices}
                  selectedServices={formData.additional_services}
                  onAdditionalServicesUpdate={(data) => {
                    setFormData({
                      ...formData,
                      additional_services: data,
                    });
                  }}
                />
              )}

              {currentStepIndex === 2 && (
                <SummaryForm key="step3" reservation={formData} />
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
                  onClick={isLastStep ? handleOnSubmit : nextStep}
                  variant="ghost"
                  color="secondary"
                >
                  {isLastStep ? "Confirm reservation" : "Next Step"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
