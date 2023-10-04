import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { Metadata } from "next/types";
import clsx from "clsx";
import { fontSans } from "@/config/fonts";
import { Link } from "@nextui-org/link";
import TopNavbar from "@/components/TopNavbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased sm:p-6 sm:pt-0",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <Toaster richColors expand />
            <TopNavbar />
            {/* Main content */}
            <div className="flex flex-row h-[calc(100vh-5.5rem)]">
              <div className="flex flex-col w-screen scrollbox rounded-lg border dark:border-white border-black">
                <main className="flex items-center justify-center py-8">
                  {children}
                </main>

                <footer className="mt-auto flex items-center justify-center py-10">
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
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
