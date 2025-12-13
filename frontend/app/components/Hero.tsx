import Image from "next/image";

export default function Hero() {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="space-y-4 sm:space-y-6 max-w-2xl w-full text-center lg:text-left pt-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-bold text-foreground">
              Discover math as it&apos;s simple and concept-first.
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto lg:mx-0">
              Master mathematics from basics to advanced levels with our
              comprehensive video courses designed for Plus Two, Plus One, and
              Class 10 students.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
              <button
                className="
                  group relative overflow-hidden
                  px-6 py-3
                  rounded-3xl
                  text-sm sm:text-base font-medium
                  text-foreground
                  bg-white/60 backdrop-blur-md
                  border border-black/10
                  shadow-sm
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-xl
                "
              >
                <span className="relative z-10">Join Now</span>
                <span
                  className="
                    pointer-events-none absolute inset-0
                    bg-gradient-to-r from-transparent via-white/40 to-transparent
                    translate-x-[-120%] group-hover:translate-x-[120%]
                    transition-transform duration-700
                  "
                />
              </button>

              <button
                className="
                  group relative overflow-hidden
                  px-6 py-3
                  rounded-3xl
                  text-sm sm:text-base font-medium
                  text-white
                  bg-primary
                  shadow-lg shadow-primary/30
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40
                "
              >
                <span className="relative z-10">Explore Courses</span>
                <span
                  className="
                    pointer-events-none absolute inset-0
                    bg-gradient-to-r from-transparent via-white/30 to-transparent
                    translate-x-[-120%] group-hover:translate-x-[120%]
                    transition-transform duration-700
                  "
                />
              </button>
            </div>

          </div>

          <div className="w-full lg:w-auto flex justify-center pt-16 lg:justify-end">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none lg:w-[600px] h-auto">
              <Image
                src="/hero.png"
                alt="hero"
                height={600}
                width={600}
                className="w-full h-auto object-contain "
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
