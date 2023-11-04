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

export default async function Profile() {
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
            Welcome to your profile page, {user.email}!
        </div>
  
        <div className="text-sm font-bold mb-4">Your profile picture:</div>
        <Avatar alt="Your profile picture" size="lg" className="mb-4" />
  
        <div className="text-sm font-bold mb-4">Your information:</div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div>
                <Input
                    label="First name"
                    value="Adminas"
                    readOnly
                    disabled
                    variant="bordered"
                />
            </div>
            <div>
                <Input
                    label="Last name"
                    value="Adminauskas"
                    readOnly
                    disabled
                    variant="bordered"
                />
            </div>
  
            <div>
                <Input
                    type="date"
                    label="Date of birth"
                    value="2000-01-01"
                    readOnly
                    disabled
                    variant="bordered"
                />
            </div>
            <div>
                <Input
                    label="Phone number"
                    value="+37061111111"
                    readOnly
                    disabled
                    variant="bordered"
                />
            </div>
  
            <div>
                <Input
                    label="Country"
                    value="Lithuania"
                    readOnly
                    disabled
                    variant="bordered"
                />
            </div>
            <div>
                <Input
                    label="City"
                    value="Kaunas"
                    readOnly
                    disabled
                    variant="bordered"
                />
            </div>        
      </div>

      <div className="text-sm font-bold mb-4">Your owner profile:</div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div>
            <Input
                label="Personal code"
                value="111111111"
                readOnly
                disabled
                variant="bordered"
            />
            </div>
            <div>
                <Input
                    label="Bank account"
                    value="SE4550000000058398257466"
                    readOnly
                    disabled
                    variant="bordered"
                />
            </div>
            <Link href="/profile/owner/edit">
                <p className="text-md text-primary">Edit owner profile</p>
            </Link>
            <Link href="/profile/owner/create">
                <p className="text-md text-primary">(DEMO) Create owner profile</p>
            </Link>
    </div>

        <Link href="/profile/edit">
            <p className="text-md text-primary">Edit profile</p>
        </Link>
        <Link href="/profile/delete">
            <p className="text-md text-primary">Delete profile</p>
        </Link>
    </section>
  );
  
}
