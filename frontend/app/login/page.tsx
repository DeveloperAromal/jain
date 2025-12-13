import React from 'react';
import { NextPage } from 'next';
import Navbar from "../components/includes/Navbar";
import CallToAction from "../components/CalltoAction";
import Footer from "../components/Footer";
import Link from 'next/link';

// NOTE: Since GoogleIcon and GithubIcon are no longer used, they are removed.

const Login: NextPage = () => {
    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#FFF5EB] to-[#FFE8D1] animate-gradient-x">
            
            <Navbar />

            {/* Login Form Section - Centered and maintaining height/width using padding and max-width */}
            {/* Outer Padding: py-32/py-40 ensures form stays well-separated vertically */}
            <section className="px-4 sm:px-6 lg:px-8 flex items-center justify-center py-32 sm:py-36 lg:py-40"> 
                
                {/* CONTAINER: max-w-2xl for maximum desktop width */}
                <div className="w-full max-w-2xl mx-auto">
                    
                    {/* CARD: Generous internal padding (p-16/p-20) for height and substance */}
                    <div className="bg-white/80 backdrop-blur-lg border border-border rounded-2xl p-16 sm:p-18 lg:p-20 shadow-2xl transition-all duration-300 hover:shadow-primary/20">
                        
                        <h2 className="text-4xl font-extrabold text-center text-foreground mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-center text-lg text-text-secondary mb-12">
                            Log in to access your account.
                        </p>

                        {/* --- Login Form --- */}
                        <form className="space-y-8"> 
                            
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-base font-semibold text-foreground mb-2">Email Address</label>
                                <input type="email" id="email" name="email" required 
                                    className="w-full px-4 py-4 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-sm hover:border-primary/50"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Password Field and Forgot Password link */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="block text-base font-semibold text-foreground">Password</label>
                                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <input type="password" id="password" name="password" required 
                                    className="w-full px-4 py-4 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-sm hover:border-primary/50"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center
                                    px-8 py-4 rounded-full text-lg font-medium mt-10
                                    bg-primary text-white border border-primary
                                    transition-all duration-300
                                    hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40 "
                            >
                                <span className="relative z-10">Log In</span>
                            </button>
                        </form>
                        
                        {/* --- Link to Sign Up --- */}
                        <p className="mt-12 text-center text-base text-text-secondary"> 
                            Don't have an account?{' '}
                            <Link href="/makeaaccount" className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
            
            <CallToAction />
            <Footer />
        </main>
    );
}

export default Login;