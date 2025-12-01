import React from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 lg:px-8 sm:auto-rows-[16rem] md:auto-rows-[18rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-[var(--radius)] border border-border bg-background p-4 shadow-[var(--shadow)] transition duration-200 hover:shadow-xl",
        className
      )}
    >
      {header}

      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}

        <div className="mt-2 mb-2 font-sans font-bold text-sm sm:text-base text-foreground">
          {title}
        </div>

        <div className="font-sans text-xs sm:text-sm font-normal text-text-secondary">
          {description}
        </div>
      </div>
    </div>
  );
};
