import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-500">
            AI Image Stylizer
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Transform your photos into stunning works of art with the power of AI.
        </p>
      </div>
    </header>
  );
};

export default Header;
