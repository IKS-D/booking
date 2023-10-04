import { Navbar } from "@nextui-org/navbar";
import { NavbarBrand } from "@nextui-org/navbar";
import { NavbarItem } from "@nextui-org/navbar";
import { NavbarContent } from "@nextui-org/navbar";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import LogoutButton from "./LogoutButton";
import BookingLogo from "./BookingLogo";

export default async function TopNavbar() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Navbar maxWidth="full" position="sticky" className="rounded-lg">
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarBrand>
          <NextLink href="/">
            <BookingLogo />
          </NextLink>
        </NavbarBrand>

        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        {/*         <NavbarItem className="hidden md:flex">
          <NextLink href="/notifications">
            <AiOutlineBell className="text-default-500" size={24} />
          </NextLink>
        </NavbarItem> */}

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              Hey, {user.email}!
              <LogoutButton />
            </div>
          ) : (
            <NextLink
              href="/login"
              className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-primary"
            >
              Login
            </NextLink>
          )}
        </div>
      </NavbarContent>
    </Navbar>
  );
}
