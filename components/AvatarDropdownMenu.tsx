"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  DropdownSection,
} from "@nextui-org/react";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/actions/users/usersQueries";
import { signOut } from "@/actions/auth/authQueries";
import { error } from "console";
import { toast } from "sonner";

interface AvatarDropdownMenuProps {
  user: User;
  profile: UserProfile | null;
  hostProfileExists: boolean;
}

export default function AvatarDropdownMenu({
  user,
  profile,
  hostProfileExists,
}: AvatarDropdownMenuProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const onThemeChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const onLogout = async () => {
    const { error } = await signOut();

    if(error){
      console.error(error);
      toast.error("There was an error while signing out: " + error.message);
      return;
    }

    router.push("/");
    window.location.reload();
  };

  const onDropdownAction = (action: string) => {
    if (action === "theme") {
      onThemeChange();
    }

    if (action === "logout") {
      onLogout();
    }

    if (action === "profile") {
      router.push("/profile");
    }

    if (action === "reservations") {
      router.push("/reservations");
    }

    if (action === "host-reservations") {
      router.push("/reservations/host");
    }

    if (action === "listings") {
      router.push("/listings");
    }

    if (action === "personal-listings") {
      router.push("/listings/personal");
    }

    if (action === "reports") {
      router.push("/reports");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            as="button"
            size="sm"
            isBordered
            color="secondary"
            className="transition-transform"
            src={profile?.photo}
            showFallback
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          variant="flat"
          onAction={(key) => onDropdownAction(key.toString())}
        >
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user.email}</p>
          </DropdownItem>

          <DropdownSection title="Menu" showDivider>
            <DropdownItem key="profile">Profile</DropdownItem>
            <DropdownItem key="reservations">Reservations</DropdownItem>
            <DropdownItem key="listings">Listings</DropdownItem>
          </DropdownSection>

          {hostProfileExists ? (
            <DropdownSection title="Host panel" showDivider>
              <DropdownItem key="host-reservations">
                Your listings reservations
              </DropdownItem>
              <DropdownItem key="personal-listings">
                Your personal listings
              </DropdownItem>
              <DropdownItem key="reports">Your personal reports</DropdownItem>
            </DropdownSection>
          ) : (
            <DropdownSection
              title="Host panel"
              showDivider
              classNames={{ base: "hidden" }}
            >
              <DropdownItem key="not-found">
                If you see this message it means that my system is broken
              </DropdownItem>
            </DropdownSection>
          )}

          <DropdownSection title="Actions">
            <DropdownItem key="theme">Toggle Theme</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
