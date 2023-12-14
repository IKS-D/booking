import React from 'react'
import UserRegistrationForm from '@/components/registration/UserRegistrationForm'
import OAuthForm from '@/components/auth/OAuthForm'

export default function UserRegistrationPage() {
  return (
    <>
      <div className="flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <UserRegistrationForm />

        <div className="flex flex-col items-center">
          <p className="text-lg font-bold mt-4 mb-2">Or</p>
        </div>

        <OAuthForm />
      </div>
    </>
  )
}