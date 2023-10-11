import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { title } from "@/components/primitives";
import { Code } from "@nextui-org/code";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Hiya&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>
          {user?.email || "Stranger"}&nbsp;
        </h1>
        <br />
        <h1 className={title({ size: "sm" })}>How are you holding up?</h1>
        <br />
        <Code className="mt-3">Current page: ./app/page.tsx</Code>
      </div>
    </section>
  );
}
