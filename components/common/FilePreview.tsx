import React, { useState, useEffect } from 'react';
import FileTypeIcon from './FileTypeIcon';

interface FilePreviewProps {
    file: File | null;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }

        let objectUrl: string | null = null;
        
        if (file.type.startsWith('image/')) {
            objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        } else if (file.type.startsWith('text/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsText(file);
        } else {
            setPreview(null); // Not a previewable type
        }
        
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [file]);

    if (!file) {
        return null;
    }

    const renderPreview = () => {
        if (preview && file.type.startsWith('image/')) {
            return (
                <img src={preview} alt="File preview" className="max-h-48 max-w-full rounded-md object-contain" />
            );
        }
        if (preview && file.type.startsWith('text/')) {
            return (
                <pre className="w-full max-h-48 overflow-auto bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    {preview}
                </pre>
            );
        }
        // Fallback for non-previewable files or while text is loading
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileTypeIcon fileName={file.name} />
                <span className="mt-2 text-sm">No preview available</span>
            </div>
        );
    };

    return (
        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Document Preview</h4>
            <div className="flex items-center justify-center min-h-[8rem]">
                {renderPreview()}
            </div>
        </div>
    );
};

export default FilePreview;