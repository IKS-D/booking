import { Navbar } from "@nextui-org/navbar";
import { NavbarBrand } from "@nextui-org/navbar";
import { NavbarContent, NavbarItem } from "@nextui-org/navbar";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import BookingLogo from "./BookingLogo";
import AvatarDropdownMenu from "./AvatarDropdownMenu";
import { BiBell } from "react-icons/bi";
import { User } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

interface TopNavbarProps {
  user: User | null;
}

export default async function TopNavbar({ user }: TopNavbarProps) {
  return (
    <Navbar
      maxWidth="full"
      position="static"
      className="rounded-lg"
      classNames={{
        wrapper: "px-0",
      }}
    >
      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="start">
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
                href="/registration/accountcredentials"
                className="pr-2 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-primary"
              >
                Register
              </NextLink>
              <NextLink
                href="/login"
                className="pr-2 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-primary"
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
