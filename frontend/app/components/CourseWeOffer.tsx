"use client";

import { useEffect, useRef } from "react";
import {
  Book,
  BookOpen,
  Notebook,
  Award,
  Calculator,
  Circle,
  Activity,
  Grid,
  Sigma,
  TrendingUp,
} from "lucide-react";

export default function CourseWeOffer() {
  const containerRef = useRef<HTMLDivElement>(null);

  const courses = [
    {
      name: "Plus One Maths",
      desc: "Build strong fundamentals.",
      icon: <Book className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />,
    },
    {
      name: "Plus Two Maths",
      desc: "Master advanced topics.",
      icon: <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />,
    },
    {
      name: "10th Standard Maths",
      desc: "Learn visually & easily.",
      icon: <Notebook className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />,
    },
    {
      name: "Entrance Maths",
      desc: "Ace competitive exams.",
      icon: <Award className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />,
    },
    {
      name: "CBSE Foundation",
      desc: "Strengthen basics early.",
      icon: <Calculator className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />,
    },
    {
      name: "Vedic Maths",
      desc: "Speed math techniques.",
      icon: <Activity className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />,
    },
    {
      name: "Olympiad Maths",
      desc: "Crack international olympiads.",
      icon: <Award className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />,
    },
    {
      name: "Geometry Mastery",
      desc: "Shapes, angles & proofs.",
      icon: <Circle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />,
    },
    {
      name: "Algebra Booster",
      desc: "Equations made simple.",
      icon: <Sigma className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />,
    },
    {
      name: "Calculus EasyWay",
      desc: "Limits & derivatives simplified.",
      icon: <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />,
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slide = () => {
      const firstChild = container.firstElementChild as HTMLElement;
      if (!firstChild) return;
      
      const cardWidth = firstChild.offsetWidth + 24;
      container.scrollBy({ left: cardWidth, behavior: "smooth" });

      if (
        container.scrollLeft + container.offsetWidth >=
        container.scrollWidth - 10
      ) {
        setTimeout(() => {
          container.scrollTo({ left: 0, behavior: "smooth" });
        }, 600);
      }
    };

    const interval = setInterval(slide, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground px-4">
          Courses We Offer
        </h2>

        <p className="text-sm sm:text-base text-text-secondary mb-8 sm:mb-12 px-4 max-w-2xl mx-auto">
          Learn mathematics the simple, visual, and concept-first way.
        </p>

        <div
          ref={containerRef}
          className="overflow-x-auto no-scroll-bar snap-x snap-mandatory px-4 sm:px-6 flex gap-4 sm:gap-6 pb-4"
        >
          {courses.map((course, index) => (
            <div
              key={index}
              className="
                min-w-[260px] sm:min-w-[280px] md:min-w-[320px]
                bg-background border border-border
                p-6 sm:p-8 rounded-[var(--radius)]
                shadow-[var(--shadow)]
                hover:shadow-xl transition-all snap-center
              "
            >
              <div className="mb-4 flex justify-center sm:justify-start">{course.icon}</div>

              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground">
                {course.name}
              </h3>

              <p className="text-sm sm:text-base text-text-secondary mb-4 sm:mb-6">{course.desc}</p>

              <button
                className="
                  px-5 py-2 rounded-full border border-border
                  text-foreground text-sm sm:text-base
                  hover:bg-primary hover:text-white
                  transition w-full sm:w-auto
                "
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
