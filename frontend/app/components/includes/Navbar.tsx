"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "../modals/AuthModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ESC key close (safe)
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
      <header className="fixed top-0 z-40 w-full bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center px-4 sm:px-6 h-16">
          <Link href="/" className="hover:opacity-90 transition">
            <Image src="/logo-white.png" alt="logo" width={56} height={56} />
          </Link>

          <div className="ml-auto flex items-center gap-6">
            {/* Desktop nav */}
            <nav className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="relative text-sm font-medium text-gray-600 hover:text-black transition"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Signup */}
            <button
              onClick={() => setOpen(true)}
              className="hidden sm:flex px-5 py-2 rounded-xl text-sm font-medium
              border border-black/10 hover:bg-black hover:text-white transition"
            >
              Sign Up
            </button>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-black/5 transition"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 pt-4 bg-white border-t border-black/5">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="py-2 text-gray-600 hover:text-black transition"
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
                className="py-2 px-4 rounded-xl font-medium border border-black/10
                hover:bg-black hover:text-white transition"
              >
                Sign Up
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Modal (IOS SAFE) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5"
            >
              <X />
            </button>
            <AuthModal />
          </div>
        </div>
      )}
    </>
  );
}
