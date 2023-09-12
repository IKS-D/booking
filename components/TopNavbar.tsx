"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { AiOutlineBell } from "react-icons/ai";

import NextLink from "next/link";

import { ThemeSwitch } from "@/components/ThemeSwitch";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import LogoutButton from "./LogoutButton";
import { Link } from "@nextui-org/link";
import { useEffect, useState } from "react";
import { Logo } from "./Icons";
import NextJsLogo from "./NextJsLogo";

export default function TopNavbar() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);

  // FIXME fix it
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    };

    getUser();
  }, [supabase, setUser]);

  return (
    <Navbar maxWidth="full" position="sticky" className="rounded-lg">
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarBrand>
          <NextLink href="/">
            <NextJsLogo />
            {/* <p className="font-thin text-inherit text-3xl font-mono">BOOKING</p> */}
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
