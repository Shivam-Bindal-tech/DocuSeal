import React from 'react';

const ContactPage: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real application, this would send data to a backend.
        // For this demo, we'll just show an alert.
        alert("Thank you for your message! (This is a demo and your message was not sent).");
        // Optionally, reset the form
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Contact Us</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Have a question or feedback? Drop us a line.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <input type="text" id="name" required placeholder="Your Name" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <input type="email" id="email" required placeholder="your.email@example.com" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                        <input type="text" id="subject" required placeholder="What is this about?" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                        <textarea id="message" required rows={4} placeholder="Your message here..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"></textarea>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105">
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;