import React from 'react'
import UserRegistrationForm from '@/components/registration/UserRegistrationForm'

export default function UserRegistrationPage() {
  return (
    <>
    <div className="flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <UserRegistrationForm/>
    </div>
    </>
  )
}