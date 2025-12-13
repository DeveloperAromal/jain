export default function CallToAction() {
  return (
    <section
      className="
        relative
        w-full
        px-4 sm:px-6 lg:px-8
        py-20 sm:py-24
        bg-white
        border-y border-border
        overflow-hidden
      "
    >
      {/* very subtle depth accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/[0.03] blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-7">
          Ready to Start Your Learning Journey?
        </h2>

        <p className="text-sm sm:text-base md:text-xl text-text-secondary max-w-2xl mb-7">
          Join thousands of students who are mastering mathematics with our
          comprehensive courses.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-start">
          {/* OUTLINE SWEEP BUTTON */}
          <button
            className="
              px-7 py-3 rounded-full
              bg-primary text-white font-medium
              shadow-md
              transition-all duration-300
              hover:bg-primary-hover hover:shadow-xl
              hover:-translate-y-[1px]
              active:translate-y-0
            "
          >
            <span className="relative z-10">Explore Courses</span>
          </button>

          {/* PRIMARY BUTTON */}
          <button
            className="relative overflow-hidden
                px-7 py-3 rounded-full
                border border-border
                text-foreground font-medium
                transition-all duration-300
                before:absolute before:inset-0
                before:bg-primary before:translate-x-[-100%] before:z-0
                before:transition-transform before:duration-300
                hover:before:translate-x-0
                hover:border-primary
                /* FIX: Change text color immediately on button hover */
                hover:text-white" 
        >
            <span className="relative z-10 transition-colors duration-300">
                Create Free Account
            </span>
          </button>

        </div>
      </div>
    </section>
  );
}
