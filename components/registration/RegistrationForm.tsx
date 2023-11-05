"use client"

import React, { useState } from "react";
import { User } from "@/types";
import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../Icons";
import { useMultiplestepForm } from "@/hooks/useMultiplestepForm";
import { AnimatePresence } from "framer-motion";
import { Avatar } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function RegistrationForm() {
  const [formData, setFormData] = useState<Partial<User>>({});
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();

  // Form errors
  const [errors, setErrors] = React.useState<Partial<User>>({});

  // Credentials step errors
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);

  // Profile information step errors
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [lastNameError, setLastNameError] = React.useState(false);
  const [dateOfBirthError, setDateOfBirthError] = React.useState(false);
  const [phoneNumberError, setPhoneNumberError] = React.useState(false);
  const [countryError, setCountryError] = React.useState(false);
  const [cityError, setCityError] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState(false);

  // Whether the password is shown or not
  const [showPassword, setShowPassword] = useState(false);

  const {
    previousStep,
    nextStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    steps,
    goTo,
    showSuccessMsg,
  } = useMultiplestepForm(2);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateStep = () => {
    // Implement validation logic for each step
    if (currentStepIndex === 0) {
      let hasErrors = false;
      if (!formData.email) {
          setEmailError(true);
          hasErrors = true;
      }
      if (!formData.password) {
          setPasswordError(true);
          hasErrors = true;
      }
      if (!confirmPassword || (formData.password != confirmPassword)) {
        setConfirmPasswordError(true);
        hasErrors = true;
      }

      return !hasErrors;
    }
    if (currentStepIndex === 1) {
      let hasErrors = false;
      if (!formData.first_name) {
        setFirstNameError(true);
        hasErrors = true;
      }
      if (!formData.last_name) {
        setLastNameError(true);
        hasErrors = true;
      }
      if (!formData.date_of_birth) {
        setDateOfBirthError(true);
        hasErrors = true;
      }
      if (!formData.phone_number) {
        setPhoneNumberError(true);
        hasErrors = true;
      }
      if (!formData.country) {
        setCountryError(true);
        hasErrors = true;
      }
      if (!formData.city) {
          setCityError(true);
          hasErrors = true;
      }
      return !hasErrors;
    }
    return true;
  };

  const handleOnSubmit = () => {
    router.push("/login");
    toast.success("User successfully registered");
  };

  return (
    <div className="flex flex-col justify-between rounded-lg border-2 border-neutral-700 p-4 w-1/3">
      <main className="w-full">
        {showSuccessMsg ? (
          <AnimatePresence mode="wait">
            {/* <SuccessMessage /> */}
          </AnimatePresence>
        ) : (
          <form
            onSubmit={handleOnSubmit}
            className="w-full flex flex-col items-center justify-between h-full"
          >
            <AnimatePresence mode="wait">
              {currentStepIndex === 0 && (
                <>
                  <p className="text-lg font-bold mb-4">Enter your credentials</p>
                  <p className="text-md font-bold mb-4">Sign up using email and password</p>

                  <Input
                    className="max-w-md h-[75px]"
                    label="Email"
                    name="email"
                    placeholder="Enter your email"
                    variant="bordered"
                    value={formData.email}
                    onChange={(event) => {
                      setFormData({ ...formData, email: event.target.value })
                      setEmailError(false)
                    }}
                    isInvalid={emailError}
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
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    variant="bordered"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(event) => {
                      setFormData({ ...formData, password: event.target.value })
                      setPasswordError(false)
                    }}
                    isInvalid={passwordError}
                  />

                  <Input
                    className="max-w-md h-[75px]"
                    label="Repeat password"
                    name="confirm_password"
                    type="password"
                    variant="bordered"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      setConfirmPasswordError(false)
                    }}
                    isInvalid={confirmPasswordError}
                  />

                  <div className="flex flex-col items-center">
                    <p className="text-md font-bold mb-4">Or</p>
                  </div>

                  <Button
                    color="primary"
                    className="max-w-md mb-4"
                  >
                    Sign up with Google
                  </Button>
                </>
              )}
              {currentStepIndex === 1 && (
                <>
                <p className="text-lg font-bold mb-4">Enter your profile information</p>
                <Input
                  className="max-w-md h-[75px]"
                  label="First name"
                  name="first_name"
                  placeholder="Enter your first name"
                  variant="bordered"
                  value={formData.first_name}
                  onChange={(event) => {
                    setFormData({ ...formData, first_name: event.target.value })
                    setFirstNameError(false)
                  }}
                  isInvalid={firstNameError}
                />
                
                <Input
                  className="max-w-md h-[75px]"                    
                  label="Last name"
                  name="last_name"
                  placeholder="Enter your last name"
                  variant="bordered"
                  value={formData.last_name}
                  onChange={(event) => {
                    setFormData({ ...formData, last_name: event.target.value })
                    setLastNameError(false)
                  }}
                  isInvalid={lastNameError}
                />

                <Input
                  className="max-w-md h-[75px]"
                  type="date"
                  label="Date of birth"
                  name="date_of_birth"
                  variant="bordered"
                  value={formData.date_of_birth ? formData.date_of_birth.toISOString().split('T')[0] : ''}
                  onChange={(event) => {
                    const inputDate = event.target.value;
                    const dateObject = inputDate ? new Date(inputDate) : undefined;
                    setFormData({ ...formData, date_of_birth: dateObject });
                    setDateOfBirthError(false);
                  }}
                  isInvalid={dateOfBirthError}
                />

                <Input
                  className="max-w-md h-[75px]"
                  label="Phone number"
                  name="phone_number"
                  placeholder="Enter your phone number"
                  variant="bordered"
                  value={formData.phone_number}
                  onChange={(event) => {
                    setFormData({ ...formData, phone_number: event.target.value })
                    setPhoneNumberError(false)
                  }}
                  isInvalid={phoneNumberError}
                />

                <Input
                  className="max-w-md h-[75px]"
                  label="Country"
                  name="country"
                  placeholder="Enter the name of your country"
                  variant="bordered"
                  value={formData.country}
                  onChange={(event) => {
                    setFormData({ ...formData, country: event.target.value })
                    setCountryError(false)
                  }}
                  isInvalid={countryError}
                />

                <Input
                  className="max-w-md h-[75px]"
                  label="City"
                  name="city"
                  placeholder="Enter the name of your city"
                  variant="bordered"
                  value={formData.city}
                  onChange={(event) => {
                    setFormData({ ...formData, city: event.target.value })
                    setCityError(false)
                  }}
                  isInvalid={cityError}
                />

                <p className="text-lg font-bold mb-4">Enter your profile picture</p>
                <Input
                  className="max-w-xs h-[75px]"
                  label="Avatar"
                  name="avatar"
                  placeholder="Enter a URL for your picture"
                  variant="bordered"
                  value={formData.avatar}
                  onChange={(event) => {
                    setFormData({ ...formData, avatar: event.target.value })
                    setAvatarError(false)
                  }}
                  isInvalid={avatarError}
                />

                <Avatar
                  className="w-[100px] h-[100px]"
                  src={formData.avatar ? formData.avatar : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"}
                  alt="Avatar"
                />
                </>
              )}
            </AnimatePresence>
            <div className="w-full items-center flex">
              <Button
                onClick={() => {
                  if (true/*validateStep()*/) {
                    if (isLastStep) {
                      handleOnSubmit();
                    } else {
                      nextStep();
                    }
                }}}
                color="primary"
              >
                {isLastStep ? "Sign up" : "Continue"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
