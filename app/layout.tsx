import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { Metadata, Viewport } from "next/types";
import clsx from "clsx";
import { fontSans } from "@/config/fonts";
import { Link } from "@nextui-org/link";
import TopNavbar from "@/components/TopNavbar";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import ClientOnly from "@/components/ClientOnly";
import { createSupabaseServerClient } from "@/supabase/server";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseServerClient = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="verify-paysera"
          content="bb15087f5faa89006586a36595ae09d0"
        ></meta>
      </head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased p-2 sm:p-6 sm:py-0",
          fontSans.variable
        )}
      >
        <Providers>
          <ClientOnly>
            <div className="flex flex-col h-full">
              {/* Header */}
              <Toaster
                richColors
                theme="dark"
                position="top-center"
                offset={0}
                toastOptions={{
                  // className: "mt-[46px]",
                  className: "mt-[76px]",
                  duration: 3000,
                }}
              />
              <TopNavbar user={user} />

              {/* Main content */}
              <div className="flex flex-row h-[calc(100vh-7rem)]">
                {/* Outline border */}
                <div className="pl-[16px] w-full scrollbox rounded-lg border dark:border-white border-black">
                  <main className="h-full py-8">{children}</main>
                </div>
              </div>

              <footer className="flex items-center justify-center pt-3 pb-1">
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href={siteConfig.links.github}
                  title="Project Github"
                >
                  <span className="text-default-600">Powered by</span>
                  <p className="text-primary">IKS D Team</p>
                </Link>
              </footer>
            </div>
          </ClientOnly>
        </Providers>
      </body>
    </html>
  );
}
