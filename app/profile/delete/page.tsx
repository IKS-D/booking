import { title } from "@/components/primitives";
import { Code } from "@nextui-org/code";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
    Spacer,
    Button,
    Card,
    CardBody,
    CardFooter,
    Image,
    Input,
    Avatar,
    Link,
  } from "@nextui-org/react";

export const dynamic = "force-dynamic";

export default async function DeleteProfile() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="flex flex-col items-center justify-center gap-4 text-foreground">
        <div className="text-2xl font-bold mb-2">
            Are you sure you want to delete your profile?
        </div>
        <div className="text-sm font-bold mb-4">The profile that will be deleted:</div>
        <div className="grid grid-cols-2 gap-1 w-full max-w-md">
            <Avatar alt="Your profile picture" size="lg" className="mb-4" />
            <Input
                label="Email adress"
                value="admin@iksd.net"
                readOnly
                disabled
                variant="bordered"
            />
            <Link href="/">
                <p className="text-md text-primary">Confirm</p>
            </Link>
            <Link href="/profile">
                <p className="text-md text-primary">Cancel</p>
            </Link>
        </div>

        
    </section>
  );
}
