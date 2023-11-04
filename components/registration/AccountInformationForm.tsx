"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { Spacer } from "@nextui-org/spacer";
import { Calendar } from "../ui/calendar";
import {
  RegisterInformationFormData,
  registerInformationSchema,
} from "@/lib/validations/registerInformation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../Icons";
import { useRouter } from "next/navigation";
import { AuthError } from "@supabase/supabase-js";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<RegisterInformationFormData>({
    resolver: zodResolver(registerInformationSchema),
  });

  const onSubmit = async (data: RegisterInformationFormData) => {
    // const response = await fetch("/auth/sign-in", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // if (!response.ok) {
    //   const error = await (response.json() as Promise<AuthError>);
    //   toast.error(error.message);

    //   // set errors to display on form
    //   setError("email", {
    //     type: "manual",
    //     message: error.message,
    //   });

    //   setError("password", {
    //     type: "manual",
    //     message: error.message,
    //   });

    //   return;
    // }

    toast.success("Account information registration successful");

    // navigate to login page
    router.push("/login");
    router.refresh();

    reset();
  };

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form
      onSubmit={handleSubmit((e) => onSubmit(e))}
      className="flex flex-col justify-center gap-2 text-foreground"
      //   action="/auth/sign-in"
      //   method="post"
    >
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <p className="text-sm font-bold mb-4">Fill in your account information</p>
      </div>

      <Input
        className="max-w-xs h-[75px]"
        {...register("firstName")}
        errorMessage={errors.firstName && (errors.firstName.message as string)}
        isInvalid={errors.firstName ? true : false}
        isClearable
        label="First name"
        name="firstName"
        placeholder="Enter your first name"
        variant="bordered"
      />
      
      <Input
        className="max-w-xs h-[75px]"
        {...register("lastName")}
        errorMessage={errors.lastName && (errors.lastName.message as string)}
        isInvalid={errors.lastName ? true : false}
        isClearable
        label="Last name"
        name="lastName"
        placeholder="Enter your last name"
        variant="bordered"
      />

      <Input
        className="max-w-xs h-[75px]"
        type="date"
        {...register("dateOfBirth")}
        errorMessage={errors.dateOfBirth && (errors.dateOfBirth.message as string)}
        isInvalid={errors.dateOfBirth ? true : false}
        isClearable
        label="Date of birth"
        name="dateOfBirth"
        placeholder="Enter your date of birth"
        variant="bordered"
      />

      <Input
        className="max-w-xs h-[75px]"
        {...register("phone")}
        errorMessage={errors.phone && (errors.phone.message as string)}
        isInvalid={errors.phone ? true : false}
        isClearable
        label="Phone number"
        name="phone"
        placeholder="Enter your phone number"
        variant="bordered"
      />

      <Input
        className="max-w-xs h-[75px]"
        {...register("picture")}
        errorMessage={errors.picture && (errors.picture.message as string)}
        isInvalid={errors.picture ? true : false}
        isClearable
        label="Picture"
        name="picture"
        placeholder="Enter a URL for your picture"
        variant="bordered"
      />

      <Input
        className="max-w-xs h-[75px]"
        {...register("country")}
        errorMessage={errors.country && (errors.country.message as string)}
        isInvalid={errors.country ? true : false}
        isClearable
        label="Country"
        name="country"
        placeholder="Enter the name of your country"
        variant="bordered"
      />

      <Input
        className="max-w-xs h-[75px]"
        {...register("city")}
        errorMessage={errors.city && (errors.city.message as string)}
        isInvalid={errors.city ? true : false}
        isClearable
        label="City"
        name="city"
        placeholder="Enter the name of your city"
        variant="bordered"
      />

      <Spacer y={3} />

      <Button
        //disabled={isSubmitting}
        type="submit"
        color="primary"
        className="max-w-xs"
      >
        Sign up
      </Button>
    </form>
  );
}
