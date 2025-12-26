"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Video, Users, Award, ArrowRight } from "lucide-react";

export default function Home() {
  const courses = [
    {
      title: "Plus Two Mathematics",
      description: "Complete course with 13 comprehensive chapters",
      link: "/syllabus/plus-two/chapters",
      bg: "bg-orange-500",
    },
    {
      title: "Plus One Mathematics",
      description: "Foundation building with 15 detailed chapters",
      link: "/syllabus/plus-one/chapters",
      bg: "bg-orange-400",
    },
    {
      title: "Class 10 Mathematics",
      description: "CBSE board preparation with 14 chapters",
      link: "/syllabus/class-10/chapters",
      bg: "bg-amber-500",
    },
    {
      title: "Basics of Mathematics",
      description: "Fundamental concepts in 6 essential videos",
      link: "/syllabus/basics/chapters",
      bg: "bg-yellow-400",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Structured Syllabus",
      desc: "Well-organized curriculum",
    },
    {
      icon: Video,
      title: "Chapter-wise Videos",
      desc: "Learn at your own pace",
    },
    { icon: Users, title: "Expert Teachers", desc: "Experienced educators" },
    { icon: Award, title: "Quality Content", desc: "High academic standards" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO */}
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-5xl font-bold text-orange-600">
              Learn With Jain
            </h1>

            <p className="text-xl font-semibold">
              Your Complete Mathematics Learning Companion
            </p>

            <p className="text-text-secondary max-w-xl mx-auto md:mx-0">
              Master mathematics from basics to advanced levels with our
              comprehensive video courses.
            </p>

            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              <Link
                href="/courses"
                className="px-6 py-3 rounded-xl bg-primary text-white font-medium inline-flex items-center gap-2 transition"
              >
                Start Learning <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/about"
                className="px-6 py-3 rounded-xl border border-border transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="md:flex justify-center">
            <Image
              src="/hero-education.jpg"
              alt="Learning"
              width={600}
              height={500}
              sizes="(max-width: 768px) 100vw, 600px"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="py-20 bg-bg-soft">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {courses.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border bg-white p-6 flex flex-col gap-4"
            >
              <div
                className={`h-32 rounded-xl ${c.bg} flex items-center justify-center`}
              >
                <BookOpen className="text-white h-12 w-12" />
              </div>

              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-text-secondary">{c.description}</p>

              <Link
                href={c.link}
                className="text-sm border px-4 py-2 rounded-lg text-center"
              >
                View Syllabus
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-white p-6 text-center"
            >
              <f.icon className="mx-auto h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
