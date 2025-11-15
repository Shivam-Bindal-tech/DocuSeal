import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto text-left">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">How DocuSeal Works</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700 space-y-8">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                    DocuSeal is designed to combat document fraud by providing a secure and transparent way to verify document authenticity. The core of our system is a simulated blockchain, which offers immutability and trust.
                </p>
                
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-700">The Workflow</h3>
                
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl border border-blue-300 dark:border-blue-500">1</div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">Admin Registration</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">An authorized administrator uploads an original document. The system instantly generates a unique cryptographic hash (a digital fingerprint) of the document's contents.</p>
                    </div>
                </div>

                 <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl border border-blue-300 dark:border-blue-500">2</div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">Blockchain Record</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">This unique hash, along with metadata like the document name and uploader, is stored as a permanent, unchangeable record on our simulated blockchain.</p>
                    </div>
                </div>

                 <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl border border-blue-300 dark:border-blue-500">3</div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">User Verification</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Anyone can upload a document to the Verifier Portal. The system calculates the hash of this document and checks if it matches any hash stored on the blockchain, confirming its authenticity.</p>
                    </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-700">Why Blockchain?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                    Even a tiny, invisible change to a document (like adding a single comma or a pixel) will produce a completely different hash. This makes it virtually impossible to tamper with a registered document and pass it off as genuine. The blockchain ensures these records cannot be altered or deleted by unauthorized parties, creating a permanent source of truth.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;