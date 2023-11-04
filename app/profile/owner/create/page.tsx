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

export default async function CreateOwnerProfile() {
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
            Create your owner profile!
        </div>

        <div className="text-sm font-bold mb-4">Fill out this information to create an owner profile and start posting listings:</div>
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
        </div>

        <Link href="/profile">
            <p className="text-md text-primary">Create owner profile</p>
        </Link>
        <Link href="/profile">
            <p className="text-md text-primary">Cancel</p>
        </Link>
    </section>
  );
  
}
