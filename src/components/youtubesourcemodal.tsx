import React, { useState, useEffect, useRef } from 'react';

// To make this a self-contained component, we'll use inline SVGs for icons
// instead of an external library like lucide-react.

const LinkIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Mock data for video suggestions with thumbnails
const suggestedVideos = [
  {
    id: 1,
    title: "React Hooks in 10 Minutes",
    topic: "Web Development",
    thumbnailUrl: "https://placehold.co/400x225/E84343/FFFFFF?text=React",
  },
  {
    id: 2,
    title: "A Brief History of the Cosmos",
    topic: "Science",
    thumbnailUrl: "https://placehold.co/400x225/4361E8/FFFFFF?text=Cosmos",
  },
  {
    id: 3,
    title: "Perfect Sourdough for Beginners",
    topic: "Cooking",
    thumbnailUrl: "https://placehold.co/400x225/E8A243/FFFFFF?text=Cooking",
  },
];

// The Modal Component
const AddSourceModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Effect to handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleAdd = () => {
      console.log("Add button clicked. Implement your logic here.");
      onClose(); // Close modal on add
  }

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 font-sans">
      {/* Modal Panel */}
      <div 
        ref={modalRef} 
        className="w-full max-w-lg transform rounded-xl bg-[#202123] text-gray-200 shadow-2xl transition-all"
      >
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-lg font-semibold text-white">
              <LinkIcon className="mr-3 h-5 w-5 text-gray-400" />
              YouTube, Website, Etc.
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-6">
            <label htmlFor="url-input" className="text-sm text-gray-400">
              Enter a YouTube Link, Website URL, Doc, ArXiv, Etc.
            </label>
            <input
              id="url-input"
              type="text"
              placeholder="https://youtu.be/example"
              className="mt-2 w-full rounded-lg border border-gray-600 bg-[#2f3032] px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Separator */}
            <div className="my-6 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-700" />
              <div className="px-3 text-sm font-medium text-gray-500">or</div>
              <div className="w-full border-t border-gray-700" />
            </div>

            {/* Video Suggestions */}
            <div>
                <h3 className="text-sm font-medium text-gray-400">Suggested Videos</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {suggestedVideos.map((video) => (
                        <div key={video.id} className="group cursor-pointer overflow-hidden rounded-lg bg-gray-700/50 transition-all hover:bg-gray-700 hover:shadow-lg">
                            <img 
                                src={video.thumbnailUrl} 
                                alt={`Thumbnail for ${video.title}`}
                                className="h-24 w-full object-cover transition-transform group-hover:scale-105"
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x225/333/FFF?text=Error'; }}
                            />
                            <div className="p-3">
                                <p className="truncate font-semibold text-white">{video.title}</p>
                                <p className="text-xs text-gray-400">{video.topic}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-[#343541] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component to demonstrate the modal
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-transform hover:scale-105 active:scale-95"
      >
        Open Source Adder
      </button>

      <AddSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
