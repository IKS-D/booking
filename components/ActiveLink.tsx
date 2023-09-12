import { forwardRef } from "react";
import type { LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type ActiveLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    activeClassName?: string;
  };

const ActiveLink = forwardRef<HTMLAnchorElement, ActiveLinkProps>(
  ({ className, activeClassName, href, ...props }, ref) => {
    const pathname = usePathname();
    const active = pathname === href;
    //pathname.startsWith(href)

    return (
      <NextLink
        ref={ref}
        href={href}
        className={clsx(className, active && activeClassName)}
        {...props}
      />
    );
  }
);

ActiveLink.displayName = "ActiveLink";

export { ActiveLink };
