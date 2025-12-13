import React from 'react';
import Navbar from "../components/includes/Navbar"
import Footer from "../components/Footer"
import CallToAction from "../components/CalltoAction"

interface IconWrapperProps {
    children: React.ReactNode;
}


const IconWrapper: React.FC<IconWrapperProps> = ({ children }) => (
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
        {children}
    </div>
);

interface ValueCardProps {
    iconSvg: React.ReactNode; 
    title: string;
    description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ iconSvg, title, description }) => (
    <div className="flex flex-col bg-white/70 backdrop-blur-xl border border-border rounded-xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
        <IconWrapper>
            <svg 
                className="text-primary w-6 h-6" 
                xmlns="http://www.w3.org/2000/svg" 
                width="30" height="30" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                {/* iconSvg contains the raw path JSX */}
                {iconSvg} 
            </svg>
        </IconWrapper>
        <h3 className="text-xl font-bold text-foreground mb-2">
            {title}
        </h3>
        <p className="text-base text-text-secondary">
            {description}
        </p>
    </div>
);


// 3. Define the type for the data array based on ValueCardProps
type ValueArray = Omit<ValueCardProps, 'key'>[];

// The main component remains a standard function export for simplicity, 
// relying on TypeScript to infer its type from the return value.
export default function About(){
    // Data Array for the Cards - Explicitly typed to satisfy the compiler
    const values: ValueArray = [
        {
            // Mission Icon (Target) SVG path
            iconSvg: (
                <React.Fragment> 
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                </React.Fragment>
            ),
            title: "Our Mission",
            description: "To make quality mathematics education accessible to every student, helping them build strong foundations and achieve academic excellence.",
        },
        {
            // Expert Teaching Icon (Users/Teacher) SVG path
            iconSvg: (
                <React.Fragment>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 10s-1 1-2 1-3 0-3-1"/>
                    <path d="M19 14s-1-1-2-1-3 0-3 1"/>
                </React.Fragment>
            ),
            title: "Expert Teaching",
            description: "Learn from experienced educators who break down complex topics into simple, easy-to-understand concepts.",
        },
        {
            // Quality Content Icon (Clipboard/Check) SVG path
            iconSvg: (
                <React.Fragment>
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </React.Fragment>
            ),
            title: "Quality Content",
            description: "Every video is carefully crafted to ensure comprehensive coverage of topics with clear explanations and examples.",
        },
        {
            // Student-Focused Icon (Book) SVG path
            iconSvg: (
                <React.Fragment>
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                    <polyline points="10 10 16 10 16 14 10 14"/>
                </React.Fragment>
            ),
            title: "Student-Focused",
            description: "We understand student needs and design our courses to be engaging, effective, and aligned with curriculum requirements.",
        },
    ];

    return(
        <>
            <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#FFF5EB] to-[#FFE8D1] animate-gradient-x">
                <Navbar />
                <section className="px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16 sm:pb-20">
                    <div className="max-w-6xl mx-auto">
                        {/* Top heading */}
                        <div className="text-center max-w-3xl mx-auto mb-14">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                                About Learn With Jain
                            </h1>

                            <p className="text-base sm:text-lg text-text-secondary">
                                Empowering students with quality mathematics education.
                            </p>
                        </div>

                        {/* Paragraph content */}
                        <div className="max-w-4xl mx-auto text-text-secondary text-sm sm:text-base leading-relaxed space-y-5 mb-20 text-center">
                            <p>
                                Learn With Jain is dedicated to providing comprehensive mathematics
                                education for students at various academic levels. Our platform offers
                                structured courses for Plus Two, Plus One, Class 10, and fundamental
                                mathematics, ensuring that every student has access to quality learning
                                resources.
                            </p>

                            <p>
                                We believe that mathematics is not just about formulas and
                                calculations—it's about understanding concepts, developing logical
                                thinking, and building problem-solving skills. Our carefully designed
                                courses break down complex topics into manageable lessons, making
                                learning both effective and enjoyable.
                            </p>
                        </div>

                        {/* Values section */}
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                                Our Values
                            </h2>
                        </div>

                        {/* Cards (Responsive Grid) */}
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
                            {values.map((value, index) => (
                                <ValueCard 
                                    key={index}
                                    iconSvg={value.iconSvg} 
                                    title={value.title}
                                    description={value.description}
                                />
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