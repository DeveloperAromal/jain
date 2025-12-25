"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Video, Users, Award, ArrowRight } from "lucide-react";

export default function Home() {
  const courses = [
    {
      title: "Plus Two Mathematics",
      description: "Complete course with 13 comprehensive chapters",
      chapters: 13,
      link: "/syllabus/plus-two/chapters",
      color: "from-[var(--primary)] to-orange-600",
    },
    {
      title: "Plus One Mathematics",
      description: "Foundation building with 15 detailed chapters",
      chapters: 15,
      link: "/syllabus/plus-one/chapters",
      color: "from-orange-400 to-[var(--primary-hover)]",
    },
    {
      title: "Class 10 Mathematics",
      description: "CBSE board preparation with 14 chapters",
      chapters: 14,
      link: "/syllabus/class-10/chapters",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Basics of Mathematics",
      description: "Fundamental concepts in 6 essential videos",
      chapters: 6,
      link: "/syllabus/basics/chapters",
      color: "from-yellow-400 to-orange-400",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Structured Syllabus",
      description:
        "Follow a well-organized curriculum that covers all topics systematically",
      color: "text-orange-600 bg-orange-100",
    },
    {
      icon: Video,
      title: "Chapter-wise Videos",
      description:
        "Learn at your own pace with detailed video explanations for each chapter",
      color: "text-amber-600 bg-amber-100",
    },
    {
      icon: Users,
      title: "Expert Teachers",
      description:
        "Learn from experienced educators who simplify complex concepts",
      color: "text-yellow-700 bg-yellow-100",
    },
    {
      icon: Award,
      title: "Quality Content",
      description:
        "Access high-quality educational material designed for academic excellence",
      color: "text-orange-700 bg-orange-200",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pt-8">
      {/* HERO */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-transparent opacity-50" />
        <div className="absolute top-20 left-10 w-24 h-24 bg-orange-200/40 rounded-full blur-2xl floating-animation" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-300/30 rounded-full blur-2xl floating-animation" /> */}

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-orange-400 via-[var(--primary)] to-orange-600 bg-clip-text text-transparent">
                  Learn With Jain
                </span>
              </h1>

              <p className="text-xl font-semibold">
                Your Complete Mathematics Learning Companion
              </p>

              <p className="text-lg text-text-secondary max-w-xl">
                Master mathematics from basics to advanced levels with our
                comprehensive video courses designed for Plus Two, Plus One, and
                Class 10 students.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/courses">
                  <button className="px-6 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:scale-105 transition shadow-md">
                    Start Learning Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>

                <Link href="/about">
                  <button className="px-6 py-3 rounded-xl border border-border hover:bg-bg-soft transition">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-200/40 to-orange-300/40 rounded-3xl blur-2xl" />
              <Image
                src="/hero-education.jpg"
                alt="Mathematics Learning"
                width={600}
                height={500}
                className="rounded-2xl shadow-lg relative z-10"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="py-16 bg-bg-soft">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Courses</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Choose from our comprehensive mathematics courses designed for
              different academic levels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-border bg-bg-glass backdrop-blur-md p-6 space-y-4 
                hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div
                  className={`h-32 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-sm`}
                >
                  <BookOpen className="h-14 w-14 text-white group-hover:scale-110 transition" />
                </div>

                <h3 className="text-xl font-semibold group-hover:text-primary transition">
                  {course.title}
                </h3>

                <p className="text-sm text-text-secondary">
                  {course.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border-soft">
                  <span className="text-sm font-semibold text-primary">
                    {course.chapters}{" "}
                    {course.chapters === 6 ? "Videos" : "Chapters"}
                  </span>

                  <Link href={course.link}>
                    <button className="text-sm border border-border px-3 py-1.5 rounded-lg hover:bg-bg-soft transition">
                      View Syllabus
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              We provide the best learning experience with structured content
              and expert guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-bg-glass backdrop-blur-md p-6 text-center space-y-4 
                hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${feature.color}`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>

                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-95" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of students who are mastering mathematics with our
            comprehensive courses
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/courses">
              <button className="px-6 py-3 rounded-xl bg-white text-primary font-semibold hover:scale-105 transition">
                Explore Courses
              </button>
            </Link>

            <Link href="/signup">
              <button className="px-6 py-3 rounded-xl border-2 border-white hover:bg-white hover:text-primary transition">
                Create Free Account
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
