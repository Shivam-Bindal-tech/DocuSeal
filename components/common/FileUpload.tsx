
import React, { useCallback, useRef } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    file: File | null;
    disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, file, disabled }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        onFileSelect(selectedFile);
    };

    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        const droppedFile = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
        onFileSelect(droppedFile);
    }, [onFileSelect, disabled]);

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };
    
    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
            />
            <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={openFileDialog}
                className={`flex justify-center w-full h-32 px-4 transition bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md appearance-none hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
                <span className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium text-gray-500 dark:text-gray-500">
                        {file ? file.name : 'Drop file or click to upload'}
                    </span>
                </span>
            </label>
        </>
    );
};

export default FileUpload;