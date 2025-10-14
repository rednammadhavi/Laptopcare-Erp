import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/bg.jpg";

export const NotFound = () => {
    return (
        <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <img
                src={bgImage}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-700/60"></div>

            {/* Content */}
            <div className="relative z-10 text-center p-6 md:p-12 text-white">
                {/* Unique 404 */}
                <h1 className="text-8xl md:text-[12rem] font-extrabold mb-4 leading-none 
                               bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 
                               bg-clip-text text-transparent 
                               transform rotate-3 drop-shadow-2xl">
                    404
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Page Not Found
                </h2>
                <p className="text-lg md:text-xl mb-6 max-w-lg mx-auto">
                    Oops! The page you are looking for doesn’t exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-white hover:bg-blue-50 text-blue-800 font-semibold rounded-lg shadow-lg transition-all"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};
