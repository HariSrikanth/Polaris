import "./globals.css";
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"


import { Public_Sans } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import SignInCard from '@/components/auth/SignInCard'


const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>Delta</title>
          <link rel="shortcut icon" href="/images/favicon.ico" />
          <meta
            name="description"
            content="Your Personal Financial Reporter"
          />
          <meta property="og:title" content="Delta" />
          <meta
            property="og:description"
            content="Your Personal Financial Reporter"
          />
          <meta property="og:image" content="/images/og-image.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Delta" />
          <meta
            name="twitter:description"
            content="Your Personal Financial Reporter"
          />
          <meta name="twitter:image" content="/images/og-image.png" />
        </head>
        <body className={publicSans.className}>
          <div className="flex flex-col p-4 md:p-12 h-[100vh]">
            {/* <Navbar></Navbar> */}
            <SignedOut>
                {/* <SignInButton /> */}
                <SignInCard/>
            </SignedOut>
            <SignedIn>
              <div className = "flex flex-row space-x-5">
                <UserButton />
                <NavigationMenu >
              <NavigationMenuList >
                <NavigationMenuItem >
                  <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>  
                </NavigationMenuItem>
                <NavigationMenuItem >
                  <Link href="/setup" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Choose Sectors
                  </NavigationMenuLink>
                </Link>  
                </NavigationMenuItem>
                {/* <NavigationMenuItem >
                  <Link href="/portfolio" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Portfolio
                  </NavigationMenuLink>
                </Link>  
                </NavigationMenuItem> */}
              </NavigationMenuList>
              </NavigationMenu>
              </div>
                {children}
            </SignedIn>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
