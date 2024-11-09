"use client";

import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Input
} from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ProfileRegistrationFormData,
  ProfileRegistrationSchema,
} from "@/lib/validations/registerProfile";
import { insertProfile } from "@/actions/users/usersQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../LoadingSpinner";

interface ProfileRegistrationFormProps {
  user: User;
}

export default function ProfileRegistrationForm({
  user,
}: ProfileRegistrationFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileRegistrationFormData>({
    resolver: zodResolver(ProfileRegistrationSchema),
  });

  const onSubmit = async (data: ProfileRegistrationFormData) => {
    setLoading(true);

    const { error } = await insertProfile({
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth!.toDateString(),
      phoneNumber: data.phoneNumber,
      country: data.country,
      city: data.city,
      photo: data.photo,
    });

    if (error) {
      // Display the server error
      toast.error("Something went wrong: " + error.message);

      console.error(error);

      setLoading(false);
      return;
    }

    setLoading(false);
    toast.success("Profile registered successfully!");

    // Navigate to home page
    router.push("/");
    router.refresh();

    reset();
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <form
        className="flex flex-col items-center rounded-lg border-2 border-neutral-700 p-4 w-1/3 space-y-4"
        onSubmit={handleSubmit((e) => onSubmit(e))}
      >
        <p className="text-lg font-bold mb-2 mt-2">
          Please complete your profile registration
        </p>

        <Input
          className="max-w-md h-[75px]"
          {...register("firstName")}
          errorMessage={errors.firstName && (errors.firstName.message as string)}
          isInvalid={errors.firstName ? true : false}
          disabled={isSubmitting}
          isRequired
          label="First name"
          name="firstName"
          placeholder="Enter your first name"
          variant="bordered"
        />

        <Input
          className="max-w-md h-[75px]"
          {...register("lastName")}
          errorMessage={errors.lastName && (errors.lastName.message as string)}
          isInvalid={errors.lastName ? true : false}
          disabled={isSubmitting}
          isRequired
          label="Last name"
          name="lastName"
          placeholder="Enter your last name"
          variant="bordered"
        />

        <Input
          className="max-w-md h-[75px]"
          errorMessage={errors.dateOfBirth && (errors.dateOfBirth.message as string)}
          isInvalid={errors.dateOfBirth ? true : false}
          disabled={isSubmitting}
          isRequired
          type="date"
          label="Date of birth"
          labelPlacement="inside"
          name="dateOfBirth"
          variant="bordered"
          placeholder="Enter the date of your birth"
          onChange={(event) => {
            const formatedDate = new Date(event.target.value);
            setValue("dateOfBirth", formatedDate);
          }}
        />

        <Input
          className="max-w-md h-[75px]"
          {...register("phoneNumber")}
          errorMessage={errors.phoneNumber && (errors.phoneNumber.message as string)}
          isInvalid={errors.phoneNumber ? true : false}
          disabled={isSubmitting}
          isRequired
          label="Phone number"
          name="phoneNumber"
          placeholder="Enter your phone number"
          variant="bordered"
        />

        <Input
          className="max-w-md h-[75px]"
          {...register("country")}
          errorMessage={errors.country && (errors.country.message as string)}
          isInvalid={errors.country ? true : false}
          disabled={isSubmitting}
          isRequired
          label="Country"
          name="country"
          placeholder="Enter the name of your country"
          variant="bordered"
        />

        <Input
          className="max-w-md h-[75px]"
          {...register("city")}
          errorMessage={errors.city && (errors.city.message as string)}
          isInvalid={errors.city ? true : false}
          disabled={isSubmitting}
          isRequired
          label="City"
          name="city"
          placeholder="Enter the name of your city"
          variant="bordered"
        />

        <Input
          className="max-w-md h-[75px]"
          {...register("photo")}
          errorMessage={errors.photo && (errors.photo.message as string)}
          isInvalid={errors.photo ? true : false}
          disabled={isSubmitting}
          isRequired
          label="Photo"
          name="photo"
          placeholder="Enter a URL for your photo"
          variant="bordered"
        />

        <Avatar
          className="w-[100px] h-[100px]"
          src={
            getValues("photo")
              ? getValues("photo")
              : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
          }
          alt="Your profile photo"
        />

        <Button
          type="submit"
          color="primary"
          className="w-full max-w-md"
        >
          Sign up
        </Button>
      </form>
    </>
  );
}
