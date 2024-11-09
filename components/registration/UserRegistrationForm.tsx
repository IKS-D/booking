"use client";

import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { UserRegistrationFormData, UserRegistrationSchema } from "@/lib/validations/registerUser";
import { useRouter } from "next/navigation";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../Icons";
import LoadingSpinner from "../LoadingSpinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpUsingEmailAndPassword } from "@/actions/auth/authQueries";

export default function UserRegistrationForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserRegistrationFormData>({
    resolver: zodResolver(UserRegistrationSchema),
  }); 

  const onSubmit = async (data: UserRegistrationFormData) => {
    setLoading(true);

    const { responseData, error } = await signUpUsingEmailAndPassword(data);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    toast.success("User " + responseData.user?.email + " registered successfully!");

    // Navigate to profile registration
    router.push("/registration/profile");
    router.refresh();

    reset();
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <form
        className="flex flex-col items-center p-4 w-1/3 space-y-4"
        onSubmit={handleSubmit((e) => onSubmit(e))}
      >

        <p className="text-lg font-bold mb-2 mt-2">Sign up using email and password</p>

        <Input
          className="max-w-md h-[75px]"
          {...register("email")}
          errorMessage={errors.email && (errors.email.message as string)}
          isInvalid={errors.email ? true : false}
          disabled={isSubmitting}
          label="Email"
          name="email"
          placeholder="Enter your email"
          variant="bordered"
        />

        <Input
          className="max-w-md h-[75px]"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {showPassword ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          {...register("password")}
          errorMessage={errors.password && (errors.password.message as string)}
          isInvalid={errors.password ? true : false}
          disabled={isSubmitting}
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          variant="bordered"
          placeholder="Enter your password"
        />

        <Input
          className="max-w-md h-[75px]"
          {...register("confirmPassword")}
          errorMessage={errors.confirmPassword && (errors.confirmPassword.message as string)}
          isInvalid={errors.confirmPassword ? true : false}
          disabled={isSubmitting}
          label="Repeat password"
          name="confirmPassword"
          type="password"
          variant="bordered"
          placeholder="Confirm your password"
        />

        <Button 
          type="submit"
          color="primary"
          className="w-full max-w-md flex gap-2"
          disabled={isSubmitting}
        >
          Sign up with email
        </Button>
      </form>
    </>
  );
}
