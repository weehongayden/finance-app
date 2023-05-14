"use client";

import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  BanknotesIcon,
  Bars3Icon,
  BellIcon,
  CreditCardIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import Sidebar from "../components/Sidebar";
import SidebarMobile from "../components/SidebarMobile";
import { classNames } from "../utils/util";
import "./globals.css";

export type NavigationProp = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
  parent?: string;
  isRoot?: boolean;
};

const navigation: NavigationProp[] = [
  { name: "Dashboard", href: "#", icon: HomeIcon, isRoot: true },
  {
    name: "Credit Card",
    href: "/cards/create",
    icon: CreditCardIcon,
    parent: "cards",
  },
  {
    name: "Installment",
    href: "/installments",
    icon: BanknotesIcon,
    parent: "installments",
  },
];

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

const roobert = localFont({
  src: "../../public/fonts/RoobertPROTRIALVF.woff2",
  variable: "--font-roobert",
});

const haffer = localFont({
  src: "../../public/fonts/HafferTRIALVF.woff2",
  variable: "--font-haffer",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="en-US">
      <body className={roobert.className}>
        <div>
          <SidebarMobile
            currentPath={pathname}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            navigation={navigation}
          />

          {/* Static sidebar for desktop */}
          <Sidebar currentPath={pathname} navigation={navigation} />

          <div className="lg:pl-72">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-900/10 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Separator */}
                  <div
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                    aria-hidden="true"
                  />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-8 w-8 rounded-full bg-gray-50"
                        src="https://res.cloudinary.com/dyniiffju/image/upload/v1683953109/0_2-removebg-preview_nf8obw.png"
                        width={32}
                        height={32}
                        alt="Profile"
                      />
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                          aria-hidden="true"
                        >
                          User Name
                        </span>
                        <ChevronDownIcon
                          className="ml-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-50" : "",
                                  "block px-3 py-1 text-sm leading-6 text-gray-900"
                                )}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <main className="py-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
