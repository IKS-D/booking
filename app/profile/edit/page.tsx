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

export default async function EditProfile() {
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
            Welcome to your profile page, {user?.email}!
        </div>
  
        <div className="text-sm font-bold mb-4">Your profile picture:</div>
        <Avatar alt="Your profile picture" size="lg" className="mb-4" />
        <Input
            className="max-w-xs h-[75px]"
            label="Picture"
            value="https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
            readOnly
            disabled
            name="picture"
            placeholder="Enter a URL for your picture"
            variant="bordered"
        />
  
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

        <Link href="/profile">
            <p className="text-md text-primary">Save changes</p>
        </Link>
        <Link href="/profile">
            <p className="text-md text-primary">Cancel</p>
        </Link>
    </section>
  );
  
}
