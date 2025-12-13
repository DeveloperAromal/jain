import React from 'react';
import Navbar from "../components/includes/Navbar"
import CallToAction from "../components/CalltoAction"
import Footer from "../components/Footer"

// ==========================================================
// ⚠️ ICON PLACEHOLDERS: Replace these with your actual icons 
// ==========================================================
const IconMail = ({ className }: { className: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconPhone = ({ className }: { className: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-4.72-4.72 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 17.61 17.61 0 0 0 .8 3.86 2 2 0 0 1-.41 1.77L9.6 11.6a15.01 15.01 0 0 0 6.8 6.8l1.96-1.93a2 2 0 0 1 1.77-.41 17.61 17.61 0 0 0 3.86.8A2 2 0 0 1 22 16.92z"/></svg>;
const IconMap = ({ className }: { className: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
// ==========================================================

interface ContactCardProps {
    icon: React.FC<{ className: string }>;
    title: string;
    details: string;
    link?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ icon: Icon, title, details, link }) => (
    <div className="flex flex-col items-center text-center bg-white/70 backdrop-blur-xl border border-border rounded-xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/20 transition-shadow duration-300 h-full">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
            <Icon className="text-primary w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
            {title}
        </h3>
        {link ? (
            <a href={link} className="text-base text-text-secondary hover:text-primary transition-colors duration-200">
                {details}
            </a>
        ) : (
            <p className="text-base text-text-secondary">
                {details}
            </p>
        )}
    </div>
);

const Contact: React.FC = () => {
    const contactInfo = [
        {
            icon: IconMail,
            title: "Email Us",
            details: "hello@learnwithjain.com",
            link: "mailto:hello@learnwithjain.com"
        },
        {
            icon: IconPhone,
            title: "Call Us",
            details: "+91 98765 43210",
            link: "tel:+919876543210"
        },
        {
            icon: IconMap,
            title: "Location",
            details: "Kochi, Kerala, India",
            link: "https://maps.app.goo.gl/"
        },
    ];

    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#FFF5EB] to-[#FFE8D1] animate-gradient-x">
            <Navbar />
            <section className="px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16 sm:pb-20">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
                            Contact Us
                        </h1>
                        <p className="text-base sm:text-lg text-text-secondary">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    {/* Contact Detail Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        {contactInfo.map((item, index) => (
                            <ContactCard 
                                key={index}
                                icon={item.icon}
                                title={item.title}
                                details={item.details}
                                link={item.link}
                            />
                        ))}
                    </div>

                    {/* Form and Side Panel Container (Main Card) - ADD max-w-4xl and mx-auto */}
                    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg border border-border rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-1">
                        
                        {/* Form Section (Now contained within the max-width) */}
                        <div className="lg:col-span-1">
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
                                Send us a Message
                            </h2>
                            
                            <form className="space-y-6">
                                {/* Name and Email Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                                        <input type="text" id="name" name="name" required 
                                            className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-sm hover:border-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                                        <input type="email" id="email" name="email" required 
                                            className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-sm hover:border-primary/50"
                                        />
                                    </div>
                                </div>

                                {/* Subject Field */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-foreground mb-2">Subject</label>
                                    <input type="text" id="subject" name="subject" required 
                                        className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-sm hover:border-primary/50"
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">Your Message</label>
                                    <textarea id="message" name="message" rows={5} required 
                                        className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 shadow-sm resize-none hover:border-primary/50"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full w-auto inline-flex items-center justify-center
                                        px-8 py-3 rounded-full text-base font-medium
                                        bg-primary text-white border border-primary
                                        transition-all duration-200
                                        hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40 "
                                >
                                    <span className="relative z-10">Submit Message</span>
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>
            <CallToAction />
            <Footer />
        </main>
    );
}

export default Contact;