"use client";

import { useMultiplestepForm } from "@/hooks/useMultiplestepForm";
import { Button } from "@nextui-org/react";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";
import { Reservation } from "@/types";
import SelectDateRangeForm from "./SelectDateRangeForm";
import AdditionalServicesForm from "./AdditionalServicesForm";
import SummaryForm from "./SummaryForm";
import { CreateReservationSchema } from "@/lib/validations/schema";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import {
  createPayment,
  createPaymentAction,
} from "@/actions/reservations/generatePayseraLink";
import { insertReservation } from "@/actions/reservations/reservationsQueries";
import { ListingWithDetails } from "@/actions/listings/getListings";
import { User } from "@supabase/supabase-js";
import { differenceInDays } from "date-fns";
import LoadingSpinner from "@/components/LoadingSpinner";

interface CreateReservationFormProps {
  listing: ListingWithDetails;
  user: User;
}

export default function CreateReservationForm({
  listing,
  user,
}: CreateReservationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Reservation>>({});
  const [error, setError] = useState<{
    start_date?: string[] | undefined;
    end_date?: string[] | undefined;
  }>();

  const router = useRouter();

  const {
    previousStep,
    nextStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    showSuccessMsg,
  } = useMultiplestepForm(3);

  const totalPrice = () => {
    const servicesPrice =
      formData.services?.reduce((a, b) => a + b.price, 0) || 0;

    const totalPrice =
      servicesPrice +
      (listing?.day_price || 0) *
        differenceInDays(
          formData.end_date || new Date(),
          formData.start_date || new Date()
        );

    return totalPrice;
  };

  const validateForm = (dateRange: DateRange) => {
    const result = CreateReservationSchema.safeParse({
      start_date: dateRange.from,
      end_date: dateRange.to,
    });

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      return false;
    }

    setError(undefined);
    return true;
  };

  const handleOnSubmit = async () => {
    setLoading(true);
    toast.success("Reservation created successfully");

    const { reservation, error } = await insertReservation({
      listingId: listing.id,
      userId: user.id,
      orderedServices:
        formData.services?.map((service): { service: number } => ({
          service: service.id,
        })) || [],
      startDate: formData.start_date!.toISOString(),
      endDate: formData.end_date!.toISOString(),
      totalPrice: totalPrice(),
    });

    if (error) {
      toast.error("Something went wrong");
      return;
    }

    await createPayment(reservation?.total_price!, reservation?.id!);
    // router.push("/reservations");
  };

  return (
    <div
      className={`flex justify-between h-[600px] rounded-lg border border-neutral-700 p-4`}
    >
      <main className="w-full">
        {showSuccessMsg ? (
          <AnimatePresence mode="wait">
            {/* <SuccessMessage /> */}
          </AnimatePresence>
        ) : (
          <form
            // onSubmit={handleOnSubmit}
            className="w-full flex flex-col justify-between h-full"
          >
            {loading && <LoadingSpinner />}
            <AnimatePresence mode="wait">
              {currentStepIndex === 0 && (
                <div className="flex flex-col">
                  <SelectDateRangeForm
                    key="step1"
                    formData={formData}
                    onDateRangeUpdate={(dateRange) => {
                      validateForm(dateRange);
                      setFormData({
                        ...formData,
                        start_date: dateRange.from,
                        end_date: dateRange.to,
                      });
                    }}
                  />
                  <div className="mt-2">
                    {error?.start_date &&
                      error.start_date.map((err) => (
                        <p className="pl-1 font-medium text-xs text-red-500">
                          {err}
                        </p>
                      ))}
                    {error?.end_date &&
                      error.end_date.map((err) => (
                        <p className="pl-1 font-medium text-xs text-red-500">
                          {err}
                        </p>
                      ))}
                  </div>
                </div>
              )}

              {currentStepIndex === 1 && (
                <AdditionalServicesForm
                  key="step2"
                  services={listing.services}
                  selectedServices={formData.services}
                  onAdditionalServicesUpdate={(data) => {
                    setFormData({
                      ...formData,
                      services: data,
                    });
                  }}
                />
              )}

              {currentStepIndex === 2 && (
                <SummaryForm
                  key="step3"
                  reservation={formData}
                  listing={listing}
                />
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
                  onClick={
                    isLastStep
                      ? handleOnSubmit
                      : () => {
                          if (
                            validateForm({
                              from: formData.start_date,
                              to: formData.end_date,
                            })
                          ) {
                            nextStep();
                          }
                        }
                  }
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
