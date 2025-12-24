"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import AuthModal from "../modals/AuthModal";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navItems = ["Home", "Courses", "About", "Contact"];

  return (
    <>
      {/* NAVBAR */}
      <header
        className="fixed top-0 z-40 w-full px-4 sm:px-6 
        bg-white border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto flex items-center">
          {/* LOGO */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold tracking-tight hover:opacity-90 transition"
          >
            <Image src="/logo-white.png" alt="logo" width={70} height={70} />
          </Link>

          {/* RIGHT */}
          <div className="ml-auto flex items-center gap-6">
            {/* DESKTOP NAV */}
            <nav className="hidden md:flex gap-6 lg:gap-8">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={
                    item.toLowerCase() === "home"
                      ? "/"
                      : `/${item.toLowerCase()}`
                  }
                  className="relative text-sm lg:text-base font-medium text-text-secondary
                  hover:text-foreground transition
                  after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0
                  after:bg-foreground after:transition-all after:duration-300
                  hover:after:w-full"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* SIGN UP BUTTON */}
            <button
              onClick={() => setOpen(true)}
              className="hidden sm:flex px-5 py-2.5 rounded-2xl text-sm lg:text-base font-medium
              bg-white/70 backdrop-blur-md border border-black/10
              hover:bg-primary hover:text-white transition-all"
            >
              Sign Up
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              className="md:hidden p-2 hover:bg-black/5 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div
            className="md:hidden mt-4 px-4 pb-4 pt-4
            bg-white/70 backdrop-blur-xl border-t border-black/5
            rounded-2xl shadow-lg"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={
                    item.toLowerCase() === "home"
                      ? "/"
                      : `/${item.toLowerCase()}`
                  }
                  className="text-text-secondary hover:text-foreground transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}

              <button
                className="py-2 px-4 rounded-2xl font-medium
                bg-white/70 backdrop-blur-md border border-black/10
                hover:bg-primary hover:text-white transition"
                onClick={() => {
                  setOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Sign Up
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* SIGN UP MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-background w-full max-w-2xl rounded-3xl p-4 sm:p-6 z-10 max-h-[90vh] overflow-y-auto">
            <AuthModal />
          </div>
        </div>
      )}
    </>
  );
}
