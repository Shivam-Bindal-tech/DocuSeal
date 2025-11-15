import React, { useState, useCallback, useEffect } from 'react';
import AdminPortal from './components/AdminPortal';
import VerifierPortal from './components/VerifierPortal';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import DeleteDocsPage from './components/DeleteDocsPage';
import { Page, BlockchainRecord } from './types';
import { getDocuments, registerDocument, deleteDocument } from './services/blockchainService';
import ThemeBulb from './components/common/ThemeBulb';
import Chatbot from './components/Chatbot';
import ChatbotToggleButton from './components/common/ChatbotToggleButton';

// --- Helper Components defined outside the main component ---

const Footer: React.FC = () => (
    <footer className="text-center py-6 text-gray-500 dark:text-gray-500 text-sm mt-auto">
        <p>DocuSeal &copy; {new Date().getFullYear()}. All rights reserved.</p>
        <p className="mt-1">A demonstration of document verification using simulated blockchain technology.</p>
    </footer>
);


const App: React.FC = () => {
    const [page, setPage] = useState<Page>('home');
    const [theme, setTheme] = useState(() => localStorage.getItem('docuSealTheme') || 'dark');
    const [blockchainData, setBlockchainData] = useState<BlockchainRecord[]>([]);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    const fetchDocuments = useCallback(async () => {
        try {
            const response = await getDocuments();
            if (response.success) {
                setBlockchainData(response.data);
            }
        } catch (error) {
            console.error("Could not fetch documents from the backend.", error);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
        localStorage.setItem('docuSealTheme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);

    const handleRegisterDocument = useCallback(async (file: File, uploader: string) => {
        await registerDocument(file, uploader);
        fetchDocuments(); // Refresh data
    }, [fetchDocuments]);

    const handleDeleteDocument = useCallback(async (docHashToDelete: string) => {
        await deleteDocument(docHashToDelete);
        fetchDocuments(); // Refresh data
    }, [fetchDocuments]);

    const renderPage = () => {
        switch (page) {
            case 'home':
                return <HomePage setPage={setPage} />;
            case 'about':
                return <AboutPage />;
            case 'contact':
                return <ContactPage />;
            case 'admin':
                return <AdminPortal 
                            onRegisterDocument={handleRegisterDocument} 
                            blockchainData={blockchainData}
                            setPage={setPage} 
                        />;
            case 'verifier':
                return <VerifierPortal blockchainData={blockchainData} />;
            case 'deleteDocs':
                return <DeleteDocsPage 
                            blockchainData={blockchainData}
                            onDeleteDocument={handleDeleteDocument}
                        />;
            default:
                return <HomePage setPage={setPage} />;
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col font-sans">
            <ThemeBulb theme={theme} toggleTheme={toggleTheme} />
            <Header currentPage={page} setPage={setPage} />
            <main className="container mx-auto px-4 py-8 flex-grow pt-24">
                {renderPage()}
            </main>
            <Footer />
            {isChatbotOpen ? (
                <Chatbot onClose={() => setIsChatbotOpen(false)} />
            ) : (
                <ChatbotToggleButton onClick={() => setIsChatbotOpen(true)} />
            )}
        </div>
    );
};

export default App;