"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "../modals/AuthModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ESC key close
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

  // iOS scroll lock fix
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navItems = ["Home", "Courses", "About", "Contact"];

  return (
    <>
      <header className="fixed top-0 z-40 w-full px-4 sm:px-6 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link href="/" className="hover:opacity-90 transition">
            <Image src="/logo-white.png" alt="logo" width={70} height={70} />
          </Link>

          <div className="ml-auto flex items-center gap-6">
            {/* Desktop nav */}
            <nav className="hidden md:flex gap-6 lg:gap-8">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="relative text-sm lg:text-base font-medium text-text-secondary
                  hover:text-foreground transition
                  after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0
                  after:bg-foreground after:transition-all hover:after:w-full"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Signup */}
            <button
              onClick={() => setOpen(true)}
              className="hidden sm:flex px-5 py-2.5 rounded-2xl text-sm lg:text-base font-medium
              bg-white/70 border border-black/10
              hover:bg-primary hover:text-white transition"
            >
              Sign Up
            </button>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 hover:bg-black/5 rounded-lg transition"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 px-4 pb-4 pt-4 bg-white/80 border-t border-black/5 rounded-2xl shadow-lg">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="py-2 text-text-secondary hover:text-foreground transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}

              <button
                onClick={() => {
                  setOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-4 rounded-2xl font-medium bg-white border border-black/10
                hover:bg-primary hover:text-white transition"
              >
                Sign Up
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-background w-full max-w-2xl rounded-3xl p-6 z-10 max-h-[90dvh] overflow-y-auto">
            <AuthModal />
          </div>
        </div>
      )}
    </>
  );
}
