import React from 'react';

// A generic document icon
const IconGenericFile = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

// An image icon
const IconImage = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// A text file icon
const IconText = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// A PDF file icon
const IconPdf = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 18.375h1.875a1.125 1.125 0 0 0 1.125-1.125V15.375a1.125 1.125 0 0 0-1.125-1.125H9.375v4.125c0 .621.504 1.125 1.125 1.125Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 14.25h1.875" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 18.375h.375a1.125 1.125 0 0 0 1.125-1.125v-4.5a1.125 1.125 0 0 0-1.125-1.125h-.375" />
    </svg>
);

// Word doc icon
const IconDoc = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 0m-3-3 3 0m-3-3 3 0m-4.5 6.375h1.125c.621 0 1.125-.504 1.125-1.125V12.375c0-.621-.504-1.125-1.125-1.125H9.375v6.375Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12h1.125c.621 0 1.125-.504 1.125-1.125V12.375c0-.621-.504-1.125-1.125-1.125H15v6.375Z" />
    </svg>
);


interface FileTypeIconProps {
    fileName: string;
}

const FileTypeIcon: React.FC<FileTypeIconProps> = ({ fileName }) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
        case 'svg':
            return <IconImage />;
        case 'txt':
        case 'md':
        case 'csv':
        case 'json':
            return <IconText />;
        case 'pdf':
            return <IconPdf />;
        case 'doc':
        case 'docx':
            return <IconDoc />;
        default:
            return <IconGenericFile />;
    }
};

export default FileTypeIcon;
