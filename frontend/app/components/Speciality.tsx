/* eslint-disable react-hooks/purity */
"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./includes/Bento";
import {
  IconMathFunction,
  IconCalculator,
  IconChartBar,
  IconCube,
  IconBooks,
} from "@tabler/icons-react";
import { motion } from "motion/react";

export function BentoGridThirdDemo() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground px-4 text-center">
          Why Choose Us
      </h2>
      <p className="text-sm sm:text-base text-text-secondary mb-8 sm:mb-12 px-4 max-w-2xl mx-auto">
          We provide the best learning experience with structured content and expert guidance
        </p>
      <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={cn("[&>p:text-lg]", item.className)}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </div>
  );
}

const SkeletonOne = () => {
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };

  const variantsSecond = {
    initial: { x: 0 },
    animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-col w-full h-full min-h-[6rem] bg-bg-soft space-y-2 rounded-[var(--radius)] p-4"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-border p-2 items-center space-x-2 bg-background shadow-[var(--shadow)]"
      >
        <div className="h-6 w-6 rounded-full bg-primary" />
        <div className="w-full bg-accent-soft h-4 rounded-full" />
      </motion.div>

      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-border p-2 items-center space-x-2 bg-background w-3/4 ml-auto shadow-[var(--shadow)]"
      >
        <div className="w-full bg-accent-soft h-4 rounded-full" />
        <div className="h-6 w-6 rounded-full bg-primary" />
      </motion.div>

      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-border p-2 items-center space-x-2 bg-background shadow-[var(--shadow)]"
      >
        <div className="h-6 w-6 rounded-full bg-primary" />
        <div className="w-full bg-accent-soft h-4 rounded-full" />
      </motion.div>
    </motion.div>
  );
};

const SkeletonTwo = () => {
  const variants = {
    initial: { width: 0 },
    animate: { width: "100%" },
    hover: {
      width: ["0%", "100%"],
      transition: { duration: 2 },
    },
  };

  const arr = new Array(6).fill(0);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-col w-full h-full min-h-[6rem] bg-bg-soft space-y-2 rounded-[var(--radius)] p-4"
    >
      {arr.map((_, i) => (
        <motion.div
          key={i}
          variants={variants}
          style={{ maxWidth: Math.random() * (100 - 40) + 40 + "%" }}
          className="bg-accent-soft h-4 rounded-full"
        />
      ))}
    </motion.div>
  );
};

const SkeletonThree = () => {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
      }}
      className="w-full h-full rounded-[var(--radius)] min-h-[6rem]"
      style={{
        background:
          "linear-gradient(-45deg, var(--primary), #ff9d4d, var(--primary-hover), #ffb878)",
        backgroundSize: "400% 400%",
      }}
    ></motion.div>
  );
};

const SkeletonFour = () => {
  const left = {
    initial: { x: 20, rotate: -5 },
    hover: { x: 0, rotate: 0 },
  };
  const right = {
    initial: { x: -20, rotate: 5 },
    hover: { x: 0, rotate: 0 },
  };

  return (
    <motion.div
      whileHover="hover"
      className="flex w-full h-full min-h-[6rem] rounded-[var(--radius)] bg-bg-soft p-2 space-x-2"
    >
      <motion.div
        variants={left}
        className="w-1/3 bg-background border border-border rounded-[var(--radius)] p-2 sm:p-4 flex flex-col items-center shadow-[var(--shadow)]"
      >
        <div className="text-2xl sm:text-3xl font-bold text-primary">π</div>
        <p className="text-xs text-center text-text-secondary mt-1 sm:mt-2">
          Geometry & circles
        </p>
      </motion.div>

      <motion.div className="w-1/3 bg-background border border-border rounded-[var(--radius)] p-2 sm:p-4 flex flex-col items-center shadow-[var(--shadow)] z-10">
        <div className="text-2xl sm:text-3xl font-bold text-primary">Σ</div>
        <p className="text-xs text-center text-text-secondary mt-1 sm:mt-2">
          Summation & patterns
        </p>
      </motion.div>

      <motion.div
        variants={right}
        className="w-1/3 bg-background border border-border rounded-[var(--radius)] p-2 sm:p-4 flex flex-col items-center shadow-[var(--shadow)]"
      >
        <div className="text-2xl sm:text-3xl font-bold text-primary">∞</div>
        <p className="text-xs text-center text-text-secondary mt-1 sm:mt-2">
          Limits & calculus
        </p>
      </motion.div>
    </motion.div>
  );
};

const SkeletonFive = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex flex-col w-full h-full min-h-[6rem] bg-bg-soft p-4 rounded-[var(--radius)] border border-border shadow-[var(--shadow)]"
    >
      <p className="text-xs sm:text-sm text-text-secondary">
        Master problem-solving through conceptual understanding — not memorizing
        formulas.
      </p>
    </motion.div>
  );
};

const items = [
  {
    title: "Concept-Based Learning",
    description: (
      <span className="text-xs sm:text-sm text-text-secondary">
        Understand math visually instead of memorizing formulas.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <IconBooks className="h-4 w-4 text-primary" />,
  },
  {
    title: "Step-by-Step Problem Solving",
    description: (
      <span className="text-xs sm:text-sm text-text-secondary">
        Learn how to break down even the toughest problems easily.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <IconCalculator className="h-4 w-4 text-primary" />,
  },
  {
    title: "Visual & Interactive Learning",
    description: (
      <span className="text-xs sm:text-sm text-text-secondary">
        Animated graphs, shapes, and real-life examples that make learning fun.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <IconChartBar className="h-4 w-4 text-primary" />,
  },
  {
    title: "Geometry, Algebra & Calculus",
    description: (
      <span className="text-xs sm:text-sm text-text-secondary">
        Complete coverage of all major math topics powered by visuals.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconCube className="h-4 w-4 text-primary" />,
  },
  {
    title: "Smart Revision Techniques",
    description: (
      <span className="text-xs sm:text-sm text-text-secondary">
        Learn fast revision tricks, shortcuts, and exam hacks.
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <IconMathFunction className="h-4 w-4 text-primary" />,
  },
];
