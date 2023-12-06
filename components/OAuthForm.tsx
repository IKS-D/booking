"use client";

import { Button } from "@nextui-org/react";
import { createBrowserClient } from "@supabase/ssr";
import React from "react";

export default function OAuthForm() {
	const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

	const SignInWithGoogle = () => {
		supabase.auth.signInWithOAuth({
			provider:"google",
			options: {
				redirectTo:`${location.origin}/auth/callback`,
			},
		});
	}
	
	return <Button 
  color="primary"
  className="w-full mb-4" 
  onClick={SignInWithGoogle}>
    Sign in with Google
    </Button>;
}
