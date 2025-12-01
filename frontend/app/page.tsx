"use client"

import CourseWeOffer from "./components/CourseWeOffer";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/includes/Navbar";
import { BentoGridThirdDemo } from "./components/Speciality";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <CourseWeOffer />
      <BentoGridThirdDemo />
      <Footer />
    </main>
  );
}
