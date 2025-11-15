import React, { useRef } from 'react';
import { Page } from '../types';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

interface HomePageProps {
    setPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
    const aboutRef = useRef<HTMLElement>(null);
    const contactRef = useRef<HTMLElement>(null);

    const isAboutVisible = useIntersectionObserver(aboutRef, { threshold: 0.2 });
    const isContactVisible = useIntersectionObserver(contactRef, { threshold: 0.2 });

    const animatedSectionClasses = (isVisible: boolean) =>
        `transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;

    return (
        <div className="text-center">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
            `}</style>
            
            {/* Hero Section with Video Background */}
            <div className="relative overflow-hidden">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    // Abstract, dark, tech-themed animated background
                    src="https://cdn.pixabay.com/video/2024/04/19/210452-933215174_large.mp4"
                >
                    Your browser does not support the video tag.
                </video>
                <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-70 z-10"></div>
                
                <section className="relative z-20 py-24 sm:py-32 flex flex-col items-center justify-center min-h-[70vh] md:min-h-screen text-white">
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.1s', opacity: 0 }}>
                        <h1 className="text-5xl font-extrabold sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            DocuSeal
                        </h1>
                    </div>
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.3s', opacity: 0 }}>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300 sm:text-xl">
                            A Blockchain-Based Solution for Document Authentication.
                        </p>
                    </div>
                    <div className="animate-fadeInUp mt-10 flex flex-col sm:flex-row justify-center gap-4" style={{ animationDelay: '0.5s', opacity: 0 }}>
                        <button 
                            onClick={() => setPage('verifier')} 
                            className="bg-blue-600 font-bold py-3 px-8 rounded-md hover:bg-blue-700 transition-all duration-200 ease-in-out hover:scale-105 shadow-lg hover:shadow-blue-500/50"
                        >
                            Get Started & Verify
                        </button>
                        <button 
                            onClick={() => setPage('about')} 
                            className="bg-gray-700 font-bold py-3 px-8 rounded-md hover:bg-gray-600 transition-all duration-200 ease-in-out hover:scale-105"
                        >
                            Learn More
                        </button>
                    </div>
                </section>
            </div>

            {/* Content Sections Below Hero */}
            <div className="relative bg-gray-100 dark:bg-gray-900 z-30 py-1"> {/* py-1 to ensure bg is rendered */}
                <div className="container mx-auto px-4">
                    {/* About Section Preview */}
                    <section 
                        id="about" 
                        ref={aboutRef}
                        className={`py-16 -mt-24 bg-white/50 dark:bg-black/20 backdrop-blur-lg rounded-lg shadow-2xl border border-black/10 dark:border-white/20 hover:border-blue-500/50 transition-all duration-300 ${animatedSectionClasses(isAboutVisible)}`}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">About DocuSeal</h2>
                        <p className="mt-4 max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
                            DocuSeal leverages the power of blockchain to provide an immutable and verifiable record of your important documents. Say goodbye to fraud and forgery with a system built on trust and transparency.
                        </p>
                    </section>
                    
                    {/* Contact Section Preview */}
                    <section 
                        id="contact" 
                        ref={contactRef}
                        className={`py-16 mt-16 ${animatedSectionClasses(isContactVisible)}`}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
                        <p className="mt-4 max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
                            Have questions or feedback? We'd love to hear from you.
                        </p>
                         <button 
                            onClick={() => setPage('contact')} 
                            className="mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-md hover:bg-green-700 transition-all duration-200 ease-in-out hover:scale-105 shadow-lg hover:shadow-green-500/50"
                        >
                            Go to Contact Page
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HomePage;