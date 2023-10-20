import { Navbar } from "@nextui-org/navbar";
import { NavbarBrand } from "@nextui-org/navbar";
import { NavbarContent, NavbarItem } from "@nextui-org/navbar";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import BookingLogo from "./BookingLogo";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AvatarDropdownMenu from "./AvatarDropdownMenu";
import { BiBell } from "react-icons/bi";
import { Spacer } from "@nextui-org/spacer";

export const dynamic = "force-dynamic";

export default async function TopNavbar() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Navbar
      maxWidth="full"
      position="sticky"
      className="rounded-lg"
      classNames={{
        wrapper: "px-0",
      }}
    >
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="start"
      >
        <NavbarBrand>
          <NextLink href="/">
            <BookingLogo />
          </NextLink>
        </NavbarBrand>

        {user && (
          <div className="items-center justify-center flex gap-6">
            <NavbarItem className="hidden md:flex">
              <NextLink href="/notifications">
                <BiBell size={24} />
              </NextLink>
            </NavbarItem>
            <AvatarDropdownMenu user={user} />
          </div>
        )}

        <div>
          {!user && (
            <div className="items-center justify-center flex gap-4">
              <ThemeSwitch />
              <NextLink
                href="/login"
                className="rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-primary"
              >
                Login
              </NextLink>
            </div>
          )}
        </div>
      </NavbarContent>
    </Navbar>
  );
}
