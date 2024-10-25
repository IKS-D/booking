import { subtitle, title } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center">
        <h1 className={title()}>Hiya&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>
          {user?.email || "Stranger"}&nbsp;
        </h1>
        <br />
        <h1 className={title({ size: "sm" })}>How are you holding up?</h1>
        <br />
        <br />
        <label className={cn(subtitle(), "text-primary font-bold")}>
          {!user
            ? "Create an account or sign in to get started"
            : "Click your avatar in the top right corner to get started"}
        </label>
      </div>
    </section>
  );
}
