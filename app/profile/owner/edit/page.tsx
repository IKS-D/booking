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
            Edit your owner profile!
        </div>

        <div className="text-sm font-bold mb-4">Change your bank account:</div>
        <div>
            <Input
                label="Bank account"
                value="SE4550000000058398257466"
                readOnly
                disabled
                variant="bordered"
            />
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
