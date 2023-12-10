"use client";

import { Button } from "@nextui-org/react";
import { createBrowserClient } from "@supabase/ssr";
import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function OAuthForm() {
	const [loading, setLoading] = useState(false);

	const handleSignInUsingGoogle = async () => {
		setLoading(true);

		const supabase = createBrowserClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		)

		const pathname = window.location.pathname; // Gets the current route, e.g., "/login"
		const redirectTo = `${origin}/auth/callback?origin=${pathname}`;

		// console.log(pathname);
		// console.log(redirectTo);
		// console.log(origin + pathname);

		supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: redirectTo,
			},
		});

		setLoading(false);
	}

	return (
		<>
			{loading && <LoadingSpinner />}
			<div className="flex flex-col items-center p-4 w-1/3">
				<Button
					color="primary"
					className="w-full max-w-md flex gap-1"
					onClick={handleSignInUsingGoogle}
				>
					<img
						src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
						alt="Google Icon"
						className="w-[30px]"
					/>
					Sign in with Google
				</Button>
			</div>
		</>
	);
}
