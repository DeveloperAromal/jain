"use client";

// import CourseWeOffer from "./components/CourseWeOffer";
import Footer from "./components/Footer";
// import Hero from "./components/Hero";
import Navbar from "./components/includes/Navbar";
// import { BentoGridThirdDemo } from "./components/Speciality";
// import CallToAction from "./components/CalltoAction";

export default function LandingPage() {
  return (
    <main suppressHydrationWarning={true}>
      <Navbar />
      {/* <Hero /> */}
      {/* <CourseWeOffer />
      <BentoGridThirdDemo />
      <CallToAction /> */}
      <Footer />
    </main>
  );
}
