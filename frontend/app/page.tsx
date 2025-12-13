"use client";

import CourseWeOffer from "./components/CourseWeOffer";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/includes/Navbar";
import { BentoGridThirdDemo } from "./components/Speciality";
import CallToAction from "./components/CalltoAction";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#FFF5EB] to-[#FFE8D1] animate-gradient-x">
      
      {/* Subtle moving noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5 animate-pulse-slow"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22400%22 height=%22400%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
          backgroundSize: "cover",
        }}
      />

      {/* Tiny abstract particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className={`absolute w-[2px] h-[2px] bg-primary/20 rounded-full
              animate-float-slow`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <CourseWeOffer />
        <BentoGridThirdDemo />
        <CallToAction />
        <Footer />
      </div>
    </main>
  );
}
