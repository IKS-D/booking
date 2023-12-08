"use client";

import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Avatar, Button, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  ProfileRegistrationFormData,
  ProfileRegistrationSchema,
} from "@/lib/validations/registerProfile";
import { insertProfile } from "@/actions/users/usersQueries";

interface ProfileRegistrationFormProps {
  user: User;
}

export default function ProfileRegistrationForm({
  user,
}: ProfileRegistrationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileRegistrationFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    phoneNumber: "",
    country: "",
    city: "",
    photo: "",
  });

  const [error, setError] = useState<{
    firstName?: string[] | undefined;
    lastName?: string[] | undefined;
    dateOfBirth?: string[] | undefined;
    phoneNumber?: string[] | undefined;
    country?: string[] | undefined;
    city?: string[] | undefined;
    photo?: string[] | undefined;
  }>();

  const validateForm = (formData: ProfileRegistrationFormData) => {
    const result = ProfileRegistrationSchema.safeParse(formData);

    if (!result.success) {
      //console.log("False in validate form")
      setError(result.error.flatten().fieldErrors);
      console.log(result.error.flatten().fieldErrors);
      return false;
    }

    setError(undefined);
    return true;
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    const formValid = validateForm(formData);

    if (!formValid) {
      console.log("Form is not valid");
      setLoading(false);
      return;
    }

    console.log("Form is valid");

    const { profile, error } = await insertProfile({
      userId: user.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth!.toDateString(),
      phoneNumber: formData.phoneNumber,
      country: formData.country,
      city: formData.city,
      photo: formData.photo,
    });

    if (error) {
      console.error(error);
      toast.error("Something went wrong");
      return;
    }

    setLoading(false);
    toast.success("Profile registered successfully!");

    // Navigate to home page
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center rounded-lg border-2 border-neutral-700 p-4 w-1/3">
      <form
        onSubmit={handleOnSubmit}
        className="flex flex-col items-center w-full space-y-6"
      >
        <p className="text-md font-bold mb-4">
          Please complete your profile registration
        </p>

        <Input
          className="max-w-md h-[75px]"
          label="First name"
          name="firstName"
          placeholder="Enter your first name"
          variant="bordered"
          value={formData.firstName}
          onChange={(event) => {
            setFormData({ ...formData, firstName: event.target.value });
            setError({ firstName: undefined });
          }}
          errorMessage={error?.firstName}
        />

        <Input
          className="max-w-md h-[75px]"
          label="Last name"
          name="lastName"
          placeholder="Enter your last name"
          variant="bordered"
          value={formData.lastName}
          onChange={(event) => {
            setFormData({ ...formData, lastName: event.target.value });
            setError({ lastName: undefined });
          }}
          errorMessage={error?.lastName}
        />

        <Input
          className="max-w-md h-[75px]"
          type="date"
          label="Date of birth"
          name="dateOfBirth"
          variant="bordered"
          errorMessage={error?.dateOfBirth}
          value={formData.dateOfBirth.toISOString().split("T")[0]} // Format date to 'YYYY-MM-DD'
          onChange={(event) => {
            const enteredDate = event.target.value;
            // Validate the entered date format
            if (/^\d{4}-\d{2}-\d{2}$/.test(enteredDate)) {
              const selectedDate = new Date(enteredDate);
              setFormData({ ...formData, dateOfBirth: selectedDate });

              // Check if user is at least 18 years old
              const today = new Date();
              const age = today.getFullYear() - selectedDate.getFullYear();
              const month = today.getMonth() - selectedDate.getMonth();

              if (
                month < 0 ||
                (month === 0 && today.getDate() < selectedDate.getDate())
              ) {
                setError({
                  dateOfBirth: ["You must be at least 18 years old"],
                });
                return;
              }

              setError({ dateOfBirth: undefined });
            } else {
              // Display an error for invalid date format
              setError({ dateOfBirth: ["Invalid date format"] });
            }
          }}
        />

        <Input
          className="max-w-md h-[75px]"
          label="Phone number"
          name="phoneNumber"
          placeholder="Enter your phone number"
          variant="bordered"
          value={formData.phoneNumber}
          onChange={(event) => {
            setFormData({ ...formData, phoneNumber: event.target.value });
            setError({ phoneNumber: undefined });
          }}
          errorMessage={error?.phoneNumber}
        />

        <Input
          className="max-w-md h-[75px]"
          label="Country"
          name="country"
          placeholder="Enter the name of your country"
          variant="bordered"
          value={formData.country}
          onChange={(event) => {
            setFormData({ ...formData, country: event.target.value });
            setError({ country: undefined });
          }}
          errorMessage={error?.country}
        />

        <Input
          className="max-w-md h-[75px]"
          label="City"
          name="city"
          placeholder="Enter the name of your city"
          variant="bordered"
          value={formData.city}
          onChange={(event) => {
            setFormData({ ...formData, city: event.target.value });
            setError({ city: undefined });
          }}
          errorMessage={error?.city}
        />

        <p className="text-lg font-bold mb-4">Enter your profile picture</p>
        <Input
          className="max-w-md h-[75px]"
          label="Photo"
          name="photo"
          placeholder="Enter a URL for your photo"
          variant="bordered"
          value={formData.photo}
          onChange={(event) => {
            setFormData({ ...formData, photo: event.target.value });
            setError({ photo: undefined });
          }}
          errorMessage={error?.photo}
        />

        <Avatar
          className="w-[100px] h-[100px]"
          src={
            formData.photo
              ? formData.photo
              : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
          }
          alt="Your profile photo"
        />

        <Button type="submit" className="w-full flex gap-2">
          Sign up
          <AiOutlineLoading3Quarters
            className={cn("animate-spin", { hidden: !loading })}
          />
        </Button>
      </form>
    </div>
  );
}
