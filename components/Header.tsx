import React from 'react';
import { Page } from '../types';
import clsx from 'clsx';

interface HeaderProps {
    currentPage: Page;
    setPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setPage }) => {
    const navButtonClasses = (page: Page) => 
        clsx(
            'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500',
            {
                'bg-blue-600 text-white shadow-md': currentPage === page,
                'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white': currentPage !== page,
            }
        );

    return (
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-40">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setPage('home')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">DocuSeal</h1>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <button onClick={() => setPage('home')} className={navButtonClasses('home')}>Home</button>
                    <button onClick={() => setPage('verifier')} className={navButtonClasses('verifier')}>Verifier</button>
                    <button onClick={() => setPage('admin')} className={navButtonClasses('admin')}>Admin</button>
                    <button onClick={() => setPage('about')} className={navButtonClasses('about')}>About</button>
                    <button onClick={() => setPage('contact')} className={navButtonClasses('contact')}>Contact</button>
                </div>
            </nav>
        </header>
    );
};

export default Header;