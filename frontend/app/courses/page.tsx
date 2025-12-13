import Navbar from "../components/includes/Navbar"
import Footer from "../components/Footer"
import CallToAction from "../components/CalltoAction"

export default function About(){
    return(
        <>
            <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#FFF5EB] to-[#FFE8D1] animate-gradient-x">
                <Navbar />
                <section className="px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16 sm:pb-24">
  <div className="max-w-7xl mx-auto">
    {/* Heading */}
    <div className="text-center max-w-3xl mx-auto mb-14">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
        Our Courses
      </h1>
      <p className="text-base sm:text-lg text-text-secondary">
        Structured mathematics courses designed to build strong foundations and
        boost academic confidence at every level.
      </p>
    </div>

    {/* Courses Grid */}
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Course Card */}
      {[
        {
          title: "Plus Two Mathematics",
          desc: "In-depth coverage of higher secondary mathematics with concept clarity, problem-solving techniques, and exam-focused preparation.",
          level: "Higher Secondary",
        },
        {
          title: "Plus One Mathematics",
          desc: "Strong foundation-building course that prepares students for advanced topics with clear explanations and guided practice.",
          level: "Higher Secondary",
        },
        {
          title: "Class 10 Mathematics",
          desc: "Concept-first learning approach aligned with syllabus requirements, making mathematics easy and enjoyable.",
          level: "Secondary",
        },
        {
          title: "Foundation Mathematics",
          desc: "Designed for students who want to strengthen their basics and develop logical thinking skills early.",
          level: "Foundation",
        },
        {
          title: "Entrance Exam Maths",
          desc: "Focused preparation for competitive exams with shortcut techniques, problem strategies, and regular practice.",
          level: "Competitive",
        },
        {
          title: "Olympiad Mathematics",
          desc: "Advanced problem-solving training aimed at national and international mathematics olympiads.",
          level: "Advanced",
        },
      ].map((course, index) => (
        <div
          key={index}
          className="
            group
            bg-white/70 backdrop-blur-xl
            border border-border
            rounded-2xl
            p-6 sm:p-7
            transition-all duration-300
            hover:-translate-y-1 hover:shadow-2xl
          "
        >
          {/* Level Tag */}
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium bg-accent-soft text-primary">
            {course.level}
          </span>

          <h3 className="text-2xl font-bold text-foreground mb-4">
            {course.title}
          </h3>

          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            {course.desc}
          </p>

          {/* Button */}
          <button
            className="
              relative overflow-hidden
              px-5 py-2 rounded-full
              border border-border
              text-foreground text-sm font-medium
              transition-all duration-300
              before:absolute before:inset-0
              before:bg-primary before:translate-x-[-100%]
              before:transition-transform before:duration-300
              group-hover:before:translate-x-0
              group-hover:text-white group-hover:border-primary
            "
          >
            <span className="relative z-10">View Course</span>
          </button>
        </div>
      ))}
    </div>
  </div>
</section>


                <CallToAction />
                <Footer />
            </main>
        </>
    )
}