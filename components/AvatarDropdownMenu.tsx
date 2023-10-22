"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface AvatarDropdownMenuProps {
  user: User;
}

export default function AvatarDropdownMenu({ user }: AvatarDropdownMenuProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const onThemeChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const onLogout = async () => {
    await fetch("/auth/sign-out", {
      method: "POST",
    });

    // TODO find better way to refresh page
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

    if (action === "reservations") {
      router.push("/reservations");
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
            // src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            showFallback
            // fallback={
            //   <CameraIcon
            //     className="animate-pulse w-6 h-6 text-default-500"
            //     fill="currentColor"
            //     size={20}
            //   />
            // }
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
          <DropdownItem key="profile">Profile</DropdownItem>
          <DropdownItem key="reservations">Reservations</DropdownItem>
          <DropdownItem key="theme">Toggle Theme</DropdownItem>
          <DropdownItem key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
