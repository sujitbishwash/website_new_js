import React from 'react';

const Flashcards: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Flashcards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Quadratic Formula</h3>
          <p className="text-gray-300">For ax² + bx + c = 0, x = (-b ± √(b²-4ac)) / 2a</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Pythagorean Theorem</h3>
          <p className="text-gray-300">In a right triangle: a² + b² = c²</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Derivative of xⁿ</h3>
          <p className="text-gray-300">d/dx(xⁿ) = nx^(n-1)</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
