import React, { useState, useCallback, useMemo } from 'react';
import FileUpload from './common/FileUpload';
import Spinner from './common/Spinner';
import Alert from './common/Alert';
import { BlockchainRecord, Page } from '../types';
import FilePreview from './common/FilePreview';
import FileTypeIcon from './common/FileTypeIcon';

interface AdminPortalProps {
    onRegisterDocument: (file: File, uploader: string) => Promise<void>;
    blockchainData: BlockchainRecord[];
    setPage: (page: Page) => void;
}

type SortableKeys = 'docName' | 'uploader' | 'timestamp';

const AdminPortal: React.FC<AdminPortalProps> = ({ onRegisterDocument, blockchainData, setPage }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploader, setUploader] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' }>({
        key: 'timestamp',
        direction: 'descending',
    });

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !uploader.trim()) {
            setMessage({ type: 'error', text: 'Please select a file and enter uploader details.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            await onRegisterDocument(file, uploader.trim());
            setMessage({ type: 'success', text: `Document "${file.name}" registered successfully!` });
            setFile(null);
            setUploader('');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }, [file, uploader, onRegisterDocument]);

    const sortedAndFilteredData = useMemo(() => {
        const filteredData = blockchainData.filter(doc =>
            doc.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.uploader.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig.key) {
            const sortedData = [...filteredData].sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue.localeCompare) {
                    return sortConfig.direction === 'ascending'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
            return sortedData;
        }
        return filteredData;
    }, [blockchainData, searchTerm, sortConfig]);

    const handleSort = (key: SortableKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader: React.FC<{ sortKey: SortableKeys; children: React.ReactNode }> = ({ sortKey, children }) => {
        const isActive = sortConfig.key === sortKey;
        return (
            <th scope="col" className="px-6 py-3">
                <button
                    onClick={() => handleSort(sortKey)}
                    className="flex items-center gap-1.5 uppercase tracking-wider font-semibold group focus:outline-none transition-transform duration-200 ease-in-out"
                    aria-label={`Sort by ${children}`}
                >
                    {children}
                    <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-20 group-hover:opacity-70'}`}>
                        {isActive && sortConfig.direction === 'ascending' ? '▲' : '▼'}
                    </span>
                </button>
            </th>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Admin Dashboard</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Register a new document on the blockchain.</p>

                {message && <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="uploader" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Uploader Name (e.g., Institution Name)
                        </label>
                        <input
                            type="text"
                            id="uploader"
                            value={uploader}
                            onChange={(e) => setUploader(e.target.value)}
                            placeholder="Enter uploader name"
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Document to Register
                        </label>
                        <FileUpload onFileSelect={setFile} file={file} disabled={isLoading} />
                        {file && <FilePreview file={file} />}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading || !file || !uploader}
                            className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105"
                        >
                            {isLoading ? <Spinner /> : 'Register Document'}
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Registered Documents</h2>
                    <button 
                        onClick={() => setPage('deleteDocs')}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 text-sm"
                        aria-label="Manage and delete documents"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                        Manage
                    </button>
                </div>

                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or uploader..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-10 pr-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        aria-label="Search registered documents"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <SortableHeader sortKey="docName">Document Name</SortableHeader>
                                <SortableHeader sortKey="uploader">Uploader</SortableHeader>
                                <SortableHeader sortKey="timestamp">Timestamp</SortableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {blockchainData.length > 0 ? (
                                sortedAndFilteredData.length > 0 ? (
                                    sortedAndFilteredData.map((doc) => (
                                        <tr key={doc.docHash} className="bg-white dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <FileTypeIcon fileName={doc.docName} />
                                                    <span className="truncate">{doc.docName}</span>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">{doc.uploader}</td>
                                            <td className="px-6 py-4">{new Date(doc.timestamp).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No documents match your search.</td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No documents registered yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;