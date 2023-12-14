"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { Spacer } from "@nextui-org/spacer";
import {
  LoginUserFormData,
  loginUserSchema,
} from "@/lib/validations/loginUser";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../Icons";
import { useRouter } from "next/navigation";
import { AuthError } from "@supabase/supabase-js";
import LoadingSpinner from "../LoadingSpinner";
import { signInUsingEmailAndPassword } from "@/actions/auth/authQueries";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<LoginUserFormData>({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = async (data: LoginUserFormData) => {
    setLoading(true);

    const { error } = await signInUsingEmailAndPassword(data);

    if (error) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    toast.success("Login successful");

    // navigate to home page
    router.push("/");
    router.refresh();

    reset();
  };

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <form
        onSubmit={handleSubmit((e) => onSubmit(e))}
        className="flex flex-col w-full justify-center items-center gap-2 text-foreground"
      >
        <Input
          className="max-w-sm h-[75px]"
          {...register("email")}
          errorMessage={errors.email && (errors.email.message as string)}
          isInvalid={errors.email ? true : false}
          isClearable
          label="Email"
          name="email"
          placeholder="Enter your email"
          variant="bordered"
        />
        {/* <Spacer y={1} /> */}

        <Input
          className="max-w-sm h-[75px]"
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
          label="Password"
          isInvalid={errors.password ? true : false}
          type={showPassword ? "text" : "password"}
          variant="bordered"
          placeholder="Enter your password"
          {...register("password")}
          errorMessage={errors.password && (errors.password.message as string)}
        />

        {/* <Spacer y={3} />
        <div className="flex justify-between items-center gap-x-10">
          <Checkbox>Remember me</Checkbox>
          <label className="text-md">Forgot password?</label>
        </div> */}

        <Button
          disabled={isSubmitting}
          type="submit"
          color="primary"
          className="w-full max-w-sm"
        >
          Sign in with email and password
        </Button>

        {/* or sign up */}
        <Spacer y={1} />
        <div className="flex flex-col items-center">
          <label className="text-md">Don't have an account?</label>
          <Link href="/registration/user">
            <p className="text-md text-primary">Sign up</p>
          </Link>
        </div>
      </form>
    </>
  );
}
