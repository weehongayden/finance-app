"use client";

import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { NavigationProp } from "../app/layout";
import { classNames } from "../utils/util";

export default function Sidebar({
  currentPath,
  navigation,
}: {
  currentPath: string;
  navigation: NavigationProp[];
}) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Image
            src="https://res.cloudinary.com/dyniiffju/image/upload/v1684081222/Ayden_draw_me_a_logo_with_the_head_of_golden_retrieve_in_round__7ee37226-7249-4b85-aa1e-75f2b98c872c-removebg-preview_e6uuav.png"
            alt="Your Company"
            width={50}
            height={50}
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        item.isRoot && currentPath === "/"
                          ? "bg-indigo-700 text-white"
                          : item.parent && currentPath.includes(item.parent)
                          ? "bg-indigo-700 text-white"
                          : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.isRoot && currentPath === "/"
                            ? "text-white"
                            : item.parent && currentPath.includes(item.parent)
                            ? "text-white"
                            : "text-indigo-200 group-hover:text-white",
                          "h-6 w-6 shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto">
              <a
                href="#"
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
              >
                <Cog6ToothIcon
                  className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                  aria-hidden="true"
                />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
