"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Video,
  Users,
  Award,
  ArrowRight,
  Play,
  Crown,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const courses = [
    {
      title: "Plus Two Mathematics",
      description: "Master advanced concepts • 13 chapters • 45+ hours",
      chapters: 13,
      duration: "45+ hours",
      lessons: 120,
      link: "/syllabus/plus-two/chapters",
      color: "from-orange-500 to-orange-600",
      thumbnail:
        "https://jegdjcrxqqxzcmboiblb.supabase.co/storage/v1/object/public/thumbnail_image/images/76114cac-2142-4ca4-aa92-a747ea6c7b42.avif",
    },
    {
      title: "Plus One Mathematics",
      description: "Build strong foundations • 15 chapters • 38+ hours",
      chapters: 15,
      duration: "38+ hours",
      lessons: 105,
      link: "/syllabus/plus-one/chapters",
      color: "from-orange-400 to-orange-500",
      thumbnail:
        "https://jegdjcrxqqxzcmboiblb.supabase.co/storage/v1/object/public/thumbnail_image/images/1e7bfc4c-8171-4c8c-984f-71615b1bc46b.avif",
    },
    {
      title: "Class 10 Mathematics",
      description: "CBSE board prep • 14 chapters • 32+ hours",
      chapters: 14,
      duration: "32+ hours",
      lessons: 92,
      link: "/syllabus/class-10/chapters",
      color: "from-amber-500 to-orange-500",
      thumbnail:
        "https://jegdjcrxqqxzcmboiblb.supabase.co/storage/v1/object/public/thumbnail_image/images/7bf28466-4a92-47b1-b38f-e44664f23db8.jpg",
    },
    {
      title: "Math Fundamentals",
      description: "Start from basics • 6 chapters • 12+ hours",
      chapters: 6,
      duration: "12+ hours",
      lessons: 35,
      link: "/syllabus/basics/chapters",
      color: "from-yellow-400 to-orange-400",
      thumbnail:
        "https://jegdjcrxqqxzcmboiblb.supabase.co/storage/v1/object/public/thumbnail_image/images/95ff6eba-c5dd-4888-bee6-f4430fd8e49b.avif",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Structured Learning",
      desc: "Chapter-wise syllabus following board curriculum",
    },
    {
      icon: Video,
      title: "HD Video Lessons",
      desc: "High quality recordings with clear explanations",
    },
    {
      icon: Users,
      title: "Expert Faculty",
      desc: "10+ years experienced mathematics teachers",
    },
    {
      icon: Award,
      title: "Proven Results",
      desc: "95% pass rate in board exams",
    },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* HERO - Left Content + Right Image */}
      <section className="pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/3 to-orange-600/3" />
        <div className="max-w-7xl pt-10 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* LEFT: Content */}
            <div className="space-y-6 lg:max-w-lg order-2 lg:order-1 ">
              <div className="inline-flex items-center gap-2 border border-amber-600 text-orange-500 bg-gradient-to-r from-orange-400/20 to-orange-500/20 px-3 py-1.5 rounded-full">
                <Crown className="w-3.5 h-3.5 " />
                <span className="text-xs font-medium text-orange-800 ">
                  Premium Mathematics Courses
                </span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-[3rem] font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-orange-500 bg-clip-text text-transparent leading-tight">
                  Master Mathematics
                </h1>
                <p className="text-xl sm:text-2xl text-muted-foreground mt-3 font-medium">
                  From Class 10 to Plus Two
                </p>
              </div>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Comprehensive video courses designed by expert teachers. Follow
                the exact board syllabus with crystal-clear explanations.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/courses"
                  className="group inline-flex items-center gap-2.5 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-orange-500/20"
                >
                  <Play className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2.5 border border-border hover:border-primary/50 bg-card hover:bg-accent px-6 py-3 rounded-xl font-semibold text-base transition-all hover:shadow-md"
                >
                  Watch Demo
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">95%</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      Board Pass Rate
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Proven Results
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      10K+
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Happy Students
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Image */}
            <div className="relative order-1 lg:block md:block hidden  lg:order-2 lg:row-start-1 lg:col-start-2">
              <div className="relative z-10">
                <Image
                  src="https://jegdjcrxqqxzcmboiblb.supabase.co/storage/v1/object/public/thumbnail_image/images/95ff6eba-c5dd-4888-bee6-f4430fd8e49b.avif"
                  alt="Mathematics Learning"
                  width={550}
                  height={450}
                  className="rounded-2xl shadow-xl ring-2 ring-white/20 hover:scale-[1.02] transition-transform duration-500 object-cover w-full h-[450px] lg:h-[500px]"
                  priority
                />
                <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl ring-1 ring-white/30">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
              </div>
              {/* Decorative background shapes */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-400/10 to-orange-500/10 rounded-3xl blur-3xl -z-10" />
              <div className="absolute -bottom-16 left-10 w-32 h-32 bg-gradient-to-tr from-emerald-400/5 to-emerald-500/5 rounded-full blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* COURSE CARDS - Compact YouTube Grid */}
      <section className="py-20 -mt-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.25rem] font-bold bg-gradient-to-r from-gray-900 to-orange-500 bg-clip-text text-transparent mb-4">
              Choose Your Course
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              All courses follow the exact board syllabus with comprehensive
              coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link
                key={course.title}
                href={course.link}
                className="group relative bg-card rounded-2xl border border-neutral-500/50 overflow-hidden hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-400 h-full"
              >
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-sm shadow-md text-gray-900">
                    {course.chapters} Ch.
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Video className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                    </div>
                    <div
                      className={`px-2.5 py-1 rounded-full text-xs font-bold bg-linear-to-r ${course.color} text-white shadow-sm`}
                    >
                      NEW
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES - Clean Cards */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-orange-500 bg-clip-text text-transparent mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in mathematics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2 text-center group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA - Compact */}
      <section className="py-20 text-center bg-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-emerald-700 text-base">
              Trusted by 10,000+ students
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-orange-500 bg-clip-text text-transparent">
            Ready to Master Math?
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students excelling with our proven courses.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
            >
              <Play className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
              Start Free Trial
              <ArrowRight className="w-4.5 h-4.5 ml-auto group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2.5 border border-border hover:border-primary/50 bg-card hover:bg-accent px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:shadow-md w-full sm:w-auto"
            >
              See Demo Lessons
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
