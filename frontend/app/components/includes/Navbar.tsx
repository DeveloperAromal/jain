"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import AuthModal from "../modals/AuthModal";
import Link from "next/link";
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
      {/* HEADER */}
      <header
        className="
          fixed top-0 z-20 w-full
          bg-white/90
          border-b border-black/10
        "
        style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-2 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-white.png"
              alt="Logo"
              width={48}
              height={48}
              sizes="48px"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="hidden sm:block px-5 py-2 rounded-xl text-sm font-medium
                         border border-black/10
                         bg-white hover:bg-primary hover:text-white
                         transition-colors"
            >
              Sign Up
            </button>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-black/5 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-black/10 px-4 py-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-black transition"
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
                className="mt-2 px-4 py-2 rounded-xl border border-black/10 hover:bg-primary hover:text-white transition"
              >
                Sign Up
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white p-6 w-full max-w-2xl rounded-3xl z-10">
            <AuthModal />
          </div>
        </div>
      )}
    </>
  );
}
