import React, { useState } from 'react';

// --- SVG ICONS ---
// Using inline SVGs to keep the component self-contained.

const UploadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
  </svg>
);

const PasteIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const TrashIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CheckCircleIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const CodeBracketIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25" />
    </svg>
);

const CalculatorIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563a3.375 3.375 0 016.096-.938 3.375 3.375 0 01-1.897 5.865m-4.2-4.927a3.375 3.375 0 01-1.897 5.865 3.375 3.375 0 01-4.2 0" />
    </svg>
);

const BeakerIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.66.539-1.198 1.198-1.198s1.198.538 1.198 1.198v9.825a1.198 1.198 0 01-1.198 1.198h-1.198a1.198 1.198 0 01-1.198-1.198V6.087z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 6.087v9.825a2.25 2.25 0 002.25 2.25h8.25a2.25 2.25 0 002.25-2.25V6.087" />
    </svg>
);

const PaintBrushIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.433 2.433c-.498 0-.974-.196-1.32-.546a3 3 0 010-4.243 3 3 0 014.242 0l.827.827a3 3 0 004.242 0l.827-.827a3 3 0 014.242 0l.827.827a3 3 0 004.242 0l.827-.827a3 3 0 014.242 0l.827.827a3 3 0 004.242 0l.827-.827a3 3 0 010 4.243 3 3 0 01-4.243 0l-.827-.827a3 3 0 00-4.242 0l-.827.827a3 3 0 01-4.242 0l-.827-.827a3 3 0 00-4.242 0z" />
    </svg>
);

const BookOpenIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 003 9c-1.105 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2a8.967 8.967 0 00-9-2.958z" />
    </svg>
);

const BrainIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 13.5h.008v.008h-.008v-.008z" />
    </svg>
);


// --- MOCK DATA ---
const initialLearningItems = [
    { id: 'cl1', title: 'Quantum Physics Explained', subject: 'Physics', progress: 75, lastStudied: '2 days ago', thumbnailUrl: 'https://placehold.co/600x400/0B1C48/FFFFFF?text=Physics' },
    { id: 'cl2', title: 'Introduction to Python', subject: 'Programming', progress: 40, lastStudied: 'Yesterday', thumbnailUrl: 'https://placehold.co/600x400/483D8B/FFFFFF?text=Python' },
    { id: 'cl3', title: 'World War II History', subject: 'History', progress: 90, lastStudied: 'Today', thumbnailUrl: 'https://placehold.co/600x400/8B4513/FFFFFF?text=History' },
    { id: 'cl4', title: 'Calculus I Fundamentals', subject: 'Mathematics', progress: 60, lastStudied: 'A week ago', thumbnailUrl: 'https://placehold.co/600x400/2E8B57/FFFFFF?text=Calculus' },
];

const initialTopics = [
    { id: 't1', name: 'Coding', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: CodeBracketIcon, description: '15+ Courses' },
    { id: 't2', name: 'Maths', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CalculatorIcon, description: '20+ Quizzes' },
    { id: 't3', name: 'Science', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: BeakerIcon, description: '30+ Lessons' },
    { id: 't4', name: 'Arts', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', icon: PaintBrushIcon, description: '12+ Projects' },
    { id: 't5', name: 'History', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: BookOpenIcon, description: '25+ Timelines' },
    { id: 't6', name: 'Philosophy', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: BrainIcon, description: '18+ Thinkers' },
];

const initialAttemptedTests = [
    { id: 'at1', title: 'Algebra Basics Test', score: 85, date: '2025-07-26', questions: 20, correct: 17, wrong: 3 },
    { id: 'at2', title: 'Modern Art Quiz', score: 92, date: '2025-07-25', questions: 25, correct: 23, wrong: 2 },
    { id: 'at3', title: 'Data Structures Challenge', score: 78, date: '2025-07-24', questions: 30, correct: 23, wrong: 7 },
];

// --- MAIN COMPONENT ---
export default function App() {
    const [learningItems, setLearningItems] = useState(initialLearningItems);
    const [attemptedTests, setAttemptedTests] = useState(initialAttemptedTests);

    const handleRemoveRecord = (id, type) => {
        if (type === 'learning') {
            setLearningItems(prev => prev.filter(item => item.id !== id));
        } else if (type === 'test') {
            setAttemptedTests(prev => prev.filter(item => item.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0d121e] to-[#1a1a2e] text-gray-300 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
                
                {/* Header Card */}
                <div className="bg-slate-900/50 rounded-xl p-6 mb-10 shadow-2xl border border-slate-700/50 backdrop-blur-sm">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">What do you want to learn today?</h1>
                    <p className="text-slate-400 mb-6">Start by uploading a file or pasting a video link.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="group flex items-center space-x-4 p-4 bg-slate-800/60 rounded-lg hover:bg-slate-800/90 transition-all duration-300 cursor-pointer border border-slate-700 hover:border-blue-500">
                            <UploadIcon className="h-8 w-8 text-blue-400 transition-transform group-hover:scale-110" />
                            <div>
                                <h2 className="font-semibold text-white">Upload File</h2>
                                <p className="text-xs text-slate-400">PDF, DOC, TXT</p>
                            </div>
                        </div>
                        <div className="group flex items-center space-x-4 p-4 bg-slate-800/60 rounded-lg hover:bg-slate-800/90 transition-all duration-300 cursor-pointer border border-slate-700 hover:border-green-500">
                            <PasteIcon className="h-8 w-8 text-green-400 transition-transform group-hover:scale-110" />
                            <div>
                                <h2 className="font-semibold text-white">Paste Text</h2>
                                <p className="text-xs text-slate-400">copy youtube videos</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SEQUENTIAL LAYOUT --- */}

                {/* Continue Learning Card */}
                <div className="bg-slate-900/50 rounded-xl p-6 mb-10 shadow-2xl border border-slate-700/50 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-5 flex justify-between items-center">
                        <span>Continue Learning</span>
                        <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">View all</a>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {learningItems.map(item => (
                            <div key={item.id} className="group relative bg-slate-800/60 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-600 border border-slate-700/80 hover:-translate-y-1">
                                <img 
                                    src={item.thumbnailUrl} 
                                    alt={`Thumbnail for ${item.title}`} 
                                    className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/333/FFF?text=Error'; }}
                                />
                                <div className="p-4">
                                    <h3 className="font-bold text-white truncate text-lg">{item.title}</h3>
                                    <p className="text-sm text-slate-400 mb-4">{item.subject}</p>
                                    <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                        <span>{item.progress}% Complete</span>
                                        <span>{item.lastStudied}</span>
                                    </div>
                                </div>
                                <button onClick={() => handleRemoveRecord(item.id, 'learning')} className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Attempted Tests Card */}
                <div className="bg-slate-900/50 rounded-xl p-6 mb-10 shadow-2xl border border-slate-700/50 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-5 flex justify-between items-center">
                        <span>Attempted Tests</span>
                        <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">View all</a>
                    </h2>
                    <div className="space-y-4">
                        {attemptedTests.map(test => (
                            <div key={test.id} className="group relative bg-slate-800/60 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 transition-all duration-300 hover:shadow-xl hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600">
                                <div className="flex-shrink-0 text-center w-24">
                                    <p className={`text-4xl font-bold ${test.score >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{test.score}%</p>
                                    <p className="text-xs text-slate-500">Overall Score</p>
                                </div>
                                <div className="flex-grow w-full border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-4">
                                    <h3 className="font-semibold text-white text-lg">{test.title}</h3>
                                    <p className="text-sm text-slate-400 mb-2">Attempted: {test.date}</p>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center text-green-400">
                                            <CheckCircleIcon className="h-5 w-5 mr-1.5"/>
                                            <span>{test.correct} Correct</span>
                                        </div>
                                        <div className="flex items-center text-red-400">
                                            <XCircleIcon className="h-5 w-5 mr-1.5"/>
                                            <span>{test.wrong} Wrong</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 text-sm font-semibold bg-blue-600/80 text-white rounded-md hover:bg-blue-600 transition-colors w-full sm:w-auto">Review Test</button>
                                <button onClick={() => handleRemoveRecord(test.id, 'test')} className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explore Topics Card */}
                <div className="bg-slate-900/50 rounded-xl p-6 shadow-2xl border border-slate-700/50 backdrop-blur-sm">
                     <h2 className="text-2xl font-bold text-white mb-5">Explore Topics</h2>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {initialTopics.map(topic => {
                            const Icon = topic.icon;
                            return (
                                <div key={topic.id} className={`group flex flex-col items-center justify-center text-center p-4 rounded-lg cursor-pointer transition-all duration-300 border ${topic.color} hover:bg-opacity-25`}>
                                    <Icon className="h-8 w-8 mb-2 transition-transform duration-300 group-hover:scale-110" />
                                    <div>
                                        <p className="font-semibold">{topic.name}</p>
                                        <p className="text-xs opacity-70">{topic.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                     </div>
                </div>
            </div>
        </div>
    );
}
 