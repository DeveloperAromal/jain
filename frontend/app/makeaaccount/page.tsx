import React from 'react';
import Navbar from "../components/includes/Navbar"
import CallToAction from "../components/CalltoAction"
import Footer from "../components/Footer"

const SignUp: React.FC = () => {
    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#FFF5EB] to-[#FFE8D1] animate-gradient-x">
            <Navbar />
            
            {/* 1. SECTION: Increased vertical padding to py-28/py-32 for maximum vertical separation */}
            <section className="px-4 sm:px-6 lg:px-8 flex items-center justify-center py-28 sm:py-32 lg:py-36">
                
                {/* CONTAINER: Uses max-w-2xl for a large desktop width */}
                <div className="max-w-2xl w-full mx-auto"> 
                    
                    {/* Main Sign Up Card */}
                    {/* 2. CARD: Increased internal padding to p-12/p-16 for maximum vertical height */}
                    <div className="bg-white/80 backdrop-blur-lg border border-border rounded-2xl p-12 sm:p-14 lg:p-16 shadow-2xl">
                        
                        <div className="text-center mb-10">
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                                Create Your Account
                            </h1>
                            <p className="text-text-secondary text-lg">
                                Get started with learning mathematics!
                            </p>
                        </div>
                        
                        <form className="space-y-8"> {/* Increased space-y to space-y-8 */}
                            
                            {/* Full Name Field */}
                            <div>
                                <label htmlFor="fullname" className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    id="fullname" 
                                    name="fullname" 
                                    required 
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-sm hover:border-primary/50"
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    required 
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-sm hover:border-primary/50"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    required 
                                    placeholder="Minimum 6 characters"
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-sm hover:border-primary/50"
                                />
                            </div>

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center
                                    px-8 py-3 rounded-full text-base font-medium
                                    bg-primary text-white border border-primary
                                    transition-all duration-200 mt-2
                                    hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40"
                            >
                                <span className="relative z-10">Sign Up</span>
                            </button>
                        </form>
                        
                        {/* Footer Link */}
                        <div className="text-center mt-10 text-sm text-text-secondary"> {/* Increased margin-top */}
                            Already have an account?{' '}
                            <a 
                                href="/login" 
                                className="text-primary font-semibold hover:underline transition-colors"
                            >
                                Log In
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <CallToAction />
            <Footer />
        </main>
    );
}

export default SignUp;