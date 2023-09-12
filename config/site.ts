import { BiHomeAlt, BiFile, BiLogoGithub } from "react-icons/bi";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Booking",
  description: "Booking is a web application for booking appointments.",
  navItems: [
    {
      label: "Home",
      href: "/",
      icon: BiHomeAlt,
    },
    {
      label: "Github",
      href: "/github",
      icon: BiLogoGithub,
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/IKS-D/booking",
  },
};
