"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import AuthModal from "../modals/AuthModal";

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
      <header className="px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold text-foreground">Jain</div>

          <nav className="hidden md:flex gap-6 lg:gap-8 text-text-secondary font-medium">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-foreground transition text-sm lg:text-base"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="hidden sm:block ml-4 py-2 px-4 border border-border rounded-2xl text-foreground hover:bg-primary hover:text-white transition text-sm lg:text-base"
              onClick={() => setOpen(true)}
            >
              Sign Up
            </button>

            <button
              className="md:hidden p-2 text-foreground hover:bg-bg-soft rounded-lg transition"
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

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 px-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-text-secondary hover:text-foreground transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button
                className="py-2 px-4 border border-border rounded-2xl text-foreground hover:bg-primary hover:text-white transition text-left w-full sm:w-auto"
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

      {open && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-background p-4 sm:p-6 w-full rounded-3xl max-w-2xl z-10 max-h-[90vh]">
            <AuthModal />
          </div>
        </div>
      )}
    </>
  );
}
