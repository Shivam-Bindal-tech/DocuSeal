
import React, { useState, useCallback } from 'react';
import { BlockchainRecord, VerificationResult } from '../types';
import { verifyDocument } from '../services/blockchainService';
import FileUpload from './common/FileUpload';
import Spinner from './common/Spinner';
import FileTypeIcon from './common/FileTypeIcon';

interface VerifierPortalProps {
    // blockchainData is no longer needed here
}

const VerificationResultDisplay: React.FC<{ result: VerificationResult }> = ({ result }) => {
    const animationStyle = {
        animation: 'fadeInScale 0.3s ease-out forwards',
        opacity: 0,
    };

    const renderIcon = () => {
        switch (result.status) {
            case 'Genuine':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'Fake':
                 return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'Error':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const renderNextSteps = () => {
        if (result.status === 'Genuine') return null;
        
        let steps: React.ReactNode;
        if (result.status === 'Fake') {
            steps = (
                <>
                    <li>Ensure you have uploaded the original, unaltered document.</li>
                    <li>Contact the institution that issued the document to get a valid copy.</li>
                </>
            );
        } else { // Error
            steps = (
                <>
                    <li>Check your internet connection and try uploading the file again.</li>
                    <li>Ensure the file is not corrupted or in an unsupported format.</li>
                </>
            );
        }

        return (
            <div className="mt-6 text-left bg-gray-100 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Suggested Next Steps:</h4>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {steps}
                </ul>
            </div>
        );
    };

    const titleMap: Record<VerificationResult['status'], string> = {
        'Genuine': 'Verification Successful',
        'Fake': 'Verification Failed',
        'Error': 'An Error Occurred'
    };

    const isSuccess = result.status === 'Genuine';
    const message = isSuccess ? 'This document is genuine and verified on the blockchain.' : result.message;

    return (
        <div style={animationStyle} className={`mt-8 p-6 text-center bg-white dark:bg-gray-800 rounded-lg shadow-xl border ${isSuccess ? 'border-green-500' : 'border-red-500'}`}>
            {renderIcon()}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">{titleMap[result.status]}</h3>
            <p className={`mt-1 ${isSuccess ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>{message}</p>
            
            {isSuccess && result.record && (
                 <div className="mt-6 text-left bg-gray-100 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-700 text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong>Document Name:</strong> <span className="break-all">{result.record.docName}</span></p>
                    <p><strong>Registered By:</strong> <span className="break-all">{result.record.uploader}</span></p>
                    <p><strong>Timestamp:</strong> {new Date(result.record.timestamp).toLocaleString()}</p>
                    <p className="font-mono"><strong>Hash:</strong> <span className="break-all text-xs">{result.record.docHash}</span></p>
                </div>
            )}
            
            {renderNextSteps()}
        </div>
    );
};


const VerifierPortal: React.FC<VerifierPortalProps> = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);

    const handleVerify = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setResult({ status: 'Error', record: null, message: 'Please select a file to verify.' });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await verifyDocument(file);
            setResult(response);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setResult({ status: 'Error', record: null, message: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }, [file]);
    
    // Clear result when file changes
    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
        setResult(null);
    }

    const formatBytes = (bytes: number, decimals = 2): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-2xl mx-auto">
            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Verifier Portal</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Upload a document to verify its authenticity.</p>

                <form onSubmit={handleVerify} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Document to Verify
                        </label>
                        <FileUpload onFileSelect={handleFileSelect} file={file} disabled={isLoading} />
                    </div>

                    {file && (
                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 animate-fadeIn">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileTypeIcon fileName={file.name} />
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                                        <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleFileSelect(null)}
                                    className="flex-shrink-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Clear file selection"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading || !file}
                            className="w-full flex justify-center items-center bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105"
                        >
                            {isLoading ? <Spinner /> : 'Verify Document'}
                        </button>
                    </div>
                </form>

                {result && <VerificationResultDisplay result={result} />}
            </div>
        </div>
    );
};

export default VerifierPortal;
