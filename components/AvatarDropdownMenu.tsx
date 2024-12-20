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
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const onLogout = async () => {
    const { error } = await signOut();

    if (error) {
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
          <DropdownItem key="profile" className="gap-2">
            <p className="font-semibold">Signed in as</p>
            {profile?.first_name && profile?.last_name && (
              <p className="">
                {profile?.first_name + " " + profile?.last_name}
              </p>
            )}
            <p className="">{user.email}</p>
          </DropdownItem>

          <DropdownSection title="Menu" showDivider>
            <DropdownItem key="profile">Profile</DropdownItem>
            <DropdownItem key="reservations">Reservations</DropdownItem>
            <DropdownItem key="listings">Listings</DropdownItem>
          </DropdownSection>

          {hostProfileExists ? (
            <DropdownSection title="Host panel" showDivider>
              <DropdownItem key="host-reservations">Reservations</DropdownItem>
              <DropdownItem key="personal-listings">Properties</DropdownItem>
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
