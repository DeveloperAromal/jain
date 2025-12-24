"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, PlayCircle } from "lucide-react";
import { useState } from "react";
import AuthModal from "@/app/components/modals/AuthModal";

export default function Chapters() {
  const params = useParams();
  const className = params.class as string;

  const [open, setOpen] = useState(false);

  const chapterMap: Record<
    string,
    { label: string; level: string; chapters: { id: number; title: string }[] }
  > = {
    "plus-one": {
      label: "Plus One",
      level: "Foundation Level",
      chapters: [
        { id: 1, title: "Sets" },
        { id: 2, title: "Relations & Functions" },
        { id: 3, title: "Trigonometric Functions" },
        { id: 4, title: "Complex Numbers" },
        { id: 5, title: "Linear Inequalities" },
        { id: 6, title: "Permutations & Combinations" },
        { id: 7, title: "Binomial Theorem" },
        { id: 8, title: "Sequences & Series" },
        { id: 9, title: "Straight Lines" },
        { id: 10, title: "Conic Sections" },
        { id: 11, title: "Introduction to 3D Geometry" },
        { id: 12, title: "Limits & Derivatives" },
        { id: 13, title: "Statistics" },
        { id: 14, title: "Probability" },
        { id: 15, title: "Mathematical Reasoning" },
      ],
    },

    "plus-two": {
      label: "Plus Two",
      level: "Advanced Level",
      chapters: [
        { id: 1, title: "Relations & Functions" },
        { id: 2, title: "Inverse Trigonometric Functions" },
        { id: 3, title: "Matrices" },
        { id: 4, title: "Determinants" },
        { id: 5, title: "Continuity & Differentiability" },
        { id: 6, title: "Applications of Derivatives" },
        { id: 7, title: "Integrals" },
        { id: 8, title: "Applications of Integrals" },
        { id: 9, title: "Differential Equations" },
        { id: 10, title: "Vectors" },
        { id: 11, title: "Three-Dimensional Geometry" },
        { id: 12, title: "Linear Programming" },
        { id: 13, title: "Probability" },
      ],
    },

    "class-10": {
      label: "Grade 10",
      level: "Board Preparation",
      chapters: [
        { id: 1, title: "Real Numbers" },
        { id: 2, title: "Polynomials" },
        { id: 3, title: "Pair of Linear Equations in Two Variables" },
        { id: 4, title: "Quadratic Equations" },
        { id: 5, title: "Arithmetic Progressions" },
        { id: 6, title: "Triangles" },
        { id: 7, title: "Coordinate Geometry" },
        { id: 8, title: "Introduction to Trigonometry" },
        { id: 9, title: "Applications of Trigonometry" },
        { id: 10, title: "Circles" },
        { id: 11, title: "Areas Related to Circles" },
        { id: 12, title: "Surface Areas & Volumes" },
        { id: 13, title: "Statistics" },
        { id: 14, title: "Probability" },
      ],
    },

    basics: {
      label: "Basics of Mathematics",
      level: "Beginner",
      chapters: [
        { id: 1, title: "Introduction to Number Systems" },
        { id: 2, title: "Basic Arithmetic Operations" },
        { id: 3, title: "Fractions and Decimals" },
        { id: 4, title: "Percentages and Ratios" },
        { id: 5, title: "Basic Algebra Concepts" },
        { id: 6, title: "Introduction to Geometry" },
      ],
    },
  };

  const course = chapterMap[className];

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Course not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="py-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-medium">{course.label}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">
            {course.label !== "Basics of Mathematics"
              ? `${course.label} Mathematics`
              : `${course.label}`}
          </h1>

          <p className="text-lg opacity-90">
            Complete course covering {course.chapters.length} chapters with
            detailed video explanations
          </p>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              <span>{course.chapters.length} Chapters</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{course.level}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Course Chapters</h2>
            <p className="text-muted-foreground">
              Select a chapter to start learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="rounded-2xl border bg-white p-6 space-y-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary font-bold">
                    {chapter.id}
                  </div>
                  <h3 className="font-semibold leading-tight flex-1">
                    {chapter.title}
                  </h3>
                </div>

                <button
                  onClick={() => setOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition"
                >
                  <PlayCircle className="h-4 w-4" />
                  Open Chapter
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-background p-4 sm:p-6 w-full max-w-2xl rounded-3xl z-10 max-h-[90vh]">
            <AuthModal />
          </div>
        </div>
      )}
    </div>
  );
}
