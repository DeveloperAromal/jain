import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Learn With Jain</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your complete mathematics learning companion for Class 10, Plus
              One, and Plus Two.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-primary transition"
              >
                Home
              </Link>
              <Link
                href="/courses"
                className="block text-sm text-muted-foreground hover:text-primary transition"
              >
                All Courses
              </Link>
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-primary transition"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Courses</h3>
            <div className="space-y-2">
              <Link
                href="/plus-two"
                className="block text-sm text-muted-foreground hover:text-primary transition"
              >
                Plus Two Mathematics
              </Link>
              <Link
                href="/plus-one"
                className="block text-sm text-muted-foreground hover:text-primary transition"
              >
                Plus One Mathematics
              </Link>
              <Link
                href="/class-10"
                className="block text-sm text-muted-foreground hover:text-primary transition"
              >
                Class 10 Mathematics
              </Link>
              <Link
                href="/basics"
                className="block text-sm text-muted-foreground hover:text-primary transition"
              >
                Basics of Mathematics
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contact@learnwithjain.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Learn With Jain. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
