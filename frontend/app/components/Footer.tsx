"use client";

import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "w-full border-t border-neutral-200 mt-10 dark:border-white/20 bg-white dark:bg-black",
        className
      )}
    >
      <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-200">
            Jain Math Hub
          </h2>
          <p className="text-xs sm:text-sm mt-2 text-neutral-600 dark:text-neutral-300">
            Building smooth & elegant user experiences.
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-sm sm:text-base text-neutral-700 dark:text-neutral-200">
            Quick Links
          </h3>
          <a className="text-xs sm:text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition">
            Home
          </a>
          <a className="text-xs sm:text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition">
            Services
          </a>
          <a className="text-xs sm:text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition">
            About
          </a>
          <a className="text-xs sm:text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition">
            Contact
          </a>
        </div>

        <div>
          <h3 className="font-semibold text-sm sm:text-base text-neutral-700 dark:text-neutral-200">
            Follow Us
          </h3>
          <div className="flex space-x-4 mt-3">
            <IconBrandGithub className="h-5 w-5 text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 transition cursor-pointer" />
            <IconBrandInstagram className="h-5 w-5 text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 transition cursor-pointer" />
            <IconBrandLinkedin className="h-5 w-5 text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 transition cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="text-center py-4 sm:py-5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-white/20 px-4">
        © {new Date().getFullYear()} Jain Math Hub. All rights reserved.
      </div>
    </footer>
  );
}
