import React, { useState } from 'react';
import { BlockchainRecord } from '../types';
import ConfirmationModal from './common/ConfirmationModal';
import Alert from './common/Alert';

interface DeleteDocsPageProps {
    blockchainData: BlockchainRecord[];
    onDeleteDocument: (docHash: string) => Promise<any>;
}

const DeleteDocsPage: React.FC<DeleteDocsPageProps> = ({ blockchainData, onDeleteDocument }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<{ docHash: string; docName: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleOpenDeleteModal = (docHash: string, docName: string) => {
        setDocToDelete({ docHash, docName });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (isDeleting) return; // Prevent closing modal while an operation is in progress
        setIsModalOpen(false);
        setDocToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (docToDelete) {
            setIsDeleting(true);
            setMessage(null);
            try {
                const response = await onDeleteDocument(docToDelete.docHash);
                setMessage({ type: 'success', text: response.message });
                handleCloseModal();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
                setMessage({ type: 'error', text: errorMessage });
                setIsDeleting(false);
                handleCloseModal();
            }
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Delete Document Records</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                    Deleting a document record is permanent and cannot be undone. Verifiers will no longer be able to authenticate the document.
                </p>
                {message && <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />}
                <div className="space-y-3">
                    {blockchainData.length > 0 ? blockchainData.map((doc) => (
                        <div key={doc.docHash} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center border border-gray-200 dark:border-gray-700 gap-3">
                            <div className="flex-grow">
                                <p className="font-bold text-gray-900 dark:text-white break-all">{doc.docName}</p>
                                <p className="text-xs text-gray-500 font-mono break-all pt-1">Hash: {doc.docHash}</p>
                            </div>
                            <button 
                                onClick={() => handleOpenDeleteModal(doc.docHash, doc.docName)}
                                className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white text-xs font-bold py-2 px-3 rounded-md hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105"
                                aria-label={`Delete record for ${doc.docName}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    )) : (
                         <p className="py-8 text-center text-gray-500">There are no documents to delete.</p>
                    )}
                </div>
            </div>

            {docToDelete && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                    title="Confirm Deletion"
                    isConfirming={isDeleting}
                >
                    Are you sure you want to delete the record for "{docToDelete.docName}"? This action cannot be undone.
                </ConfirmationModal>
            )}
        </div>
    );
};

export default DeleteDocsPage;