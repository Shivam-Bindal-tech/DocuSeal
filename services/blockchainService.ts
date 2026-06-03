
// This service handles interactions with the backend API.

const API_URL = '/api/documents';

/**
 * Registers a document by uploading it to the backend.
 * @param file The file to register.
 * @param uploader The name of the uploader.
 * @returns A promise that resolves to the server's response.
 */
export const registerDocument = async (file: File, uploader: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploader', uploader);
    const docHash = await generateDocHash(file);
    formData.append('docHash', docHash);

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register document.');
    }

    return response.json();
};

/**
 * Verifies a document by uploading it to the backend.
 * @param file The file to verify.
 * @returns A promise that resolves to the verification result.
 */
export const verifyDocument = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const docHash = await generateDocHash(file);
    formData.append('docHash', docHash);

    const response = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify document.');
    }

    return response.json();
};

/**
 * Fetches all registered documents from the backend.
 * @returns A promise that resolves to the list of documents.
 */
export const getDocuments = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('Failed to fetch documents.');
    }

    return response.json();
};

/**
 * Deletes a document record from the backend.
 * @param docHash The hash of the document to delete.
 * @returns A promise that resolves when the document is deleted.
 */
export const deleteDocument = async (docHash: string) => {
    const response = await fetch(`${API_URL}/${docHash}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete document.');
    }

    return response.json();
};

/**
 * Generates a SHA-256 hash for a given file.
 * @param file The file to hash.
 * @returns A promise that resolves to the hex string of the hash.
 */
export const generateDocHash = async (file: File): Promise<string> => {
    const fileBuffer = await file.arrayBuffer();
    console.log(fileBuffer);
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

