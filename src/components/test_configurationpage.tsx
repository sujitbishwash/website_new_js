import React, { useState, useEffect } from 'react';

// --- Mock Data ---
// This data structure now maps subjects to their specific sub-topics.
const testData = {
    subjects: ['English', 'Aptitude', 'Reasoning', 'General Awareness', 'Computer', 'Full Test'],
    subTopics: {
        English: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Para Jumbles'],
        Aptitude: ['Percentages', 'Profit and Loss', 'Time and Work', 'Ratio and Proportion', 'Number Systems'],
        Reasoning: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Blood Relations'],
        'General Awareness': ['Current Affairs', 'History', 'Geography', 'Static GK'],
        Computer: ['Data Structures', 'Algorithms', 'Networking', 'Operating Systems', 'DBMS'],
        'Full Test': [] // 'Full Test' has no sub-topics.
    },
    difficultyLevels: ['Easy', 'Medium', 'Hard'],
    languages: ['English', 'Hindi'],
};

// --- Helper Components for UI elements ---

// Custom Radio Button Component
const RadioButton = ({ id, name, value, label, checked, onChange, disabled = false }) => (
    <div className="relative flex items-center">
        <input
            id={id}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="absolute opacity-0 w-0 h-0"
        />
        <label
            htmlFor={id}
            className={`flex items-center cursor-pointer py-2.5 px-5 rounded-lg transition-all duration-300 ease-in-out border
                ${disabled ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' : 'border-gray-600'}
                ${checked ? 'bg-blue-600 border-blue-500 text-white shadow-lg ring-2 ring-blue-500/50' : 'bg-gray-700 hover:bg-gray-600 hover:border-gray-500'}`}
        >
            <span className={`w-4 h-4 inline-block mr-3 rounded-full border-2 transition-all duration-300 ${checked ? 'border-white bg-white' : 'border-gray-400 bg-gray-700'}`}></span>
            {label}
        </label>
    </div>
);


// --- Main Page Component ---
const TestConfigurationPage = () => {
    // State to hold user selections
    const [selectedSubject, setSelectedSubject] = useState('Aptitude');
    const [selectedSubTopic, setSelectedSubTopic] = useState('Percentages'); // Now a single string
    const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    
    const currentSubTopics = testData.subTopics[selectedSubject] || [];

    // Effect to update sub-topic when subject changes
    useEffect(() => {
        const newSubTopics = testData.subTopics[selectedSubject] || [];
        // Set the default selected sub-topic to the first one in the list, or empty if none exist.
        setSelectedSubTopic(newSubTopics.length > 0 ? newSubTopics[0] : '');
    }, [selectedSubject]);


    // Handler for the continue button click
    const handleContinue = () => {
        // In a real app, you would navigate to the test or send this data to a server.
        console.log("Test Configuration:", {
            subject: selectedSubject,
            subTopic: selectedSubTopic,
            difficulty: selectedDifficulty,
            language: selectedLanguage,
        });
        // You could show a confirmation modal here instead of an alert
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white font-sans p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8">
                {/* --- Header --- */}
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-100">Configure Your Test</h1>
                    <p className="text-gray-400 mt-2">Select your preferences to start a practice test.</p>
                </div>

                {/* --- Form Sections --- */}
                <div className="space-y-10">
                    {/* 1. Select Subject */}
                    <div className="p-6 bg-black/20 border border-gray-700/80 rounded-xl">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">1. Select Subject</h2>
                        <div className="flex flex-wrap gap-4">
                            {testData.subjects.map(subject => (
                                <RadioButton
                                    key={subject}
                                    id={`subject-${subject}`}
                                    name="subject"
                                    value={subject}
                                    label={subject}
                                    checked={selectedSubject === subject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 2. Select Sub-Topic (now dynamic) */}
                    <div className="p-6 bg-black/20 border border-gray-700/80 rounded-xl">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">2. Select Sub-Topic (Optional)</h2>
                        <div className="flex flex-wrap gap-4">
                            {currentSubTopics.length > 0 ? (
                                currentSubTopics.map(topic => (
                                    <RadioButton
                                        key={topic}
                                        id={`subtopic-${topic}`}
                                        name="subtopic"
                                        value={topic}
                                        label={topic}
                                        checked={selectedSubTopic === topic}
                                        onChange={(e) => setSelectedSubTopic(e.target.value)}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500">No sub-topics available for this subject.</p>
                            )}
                        </div>
                    </div>

                    {/* 3. Select Difficulty Level */}
                    <div className="p-6 bg-black/20 border border-gray-700/80 rounded-xl">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">3. Select Difficulty Level</h2>
                        <div className="flex flex-wrap gap-4">
                            {testData.difficultyLevels.map(level => (
                                <RadioButton
                                    key={level}
                                    id={`difficulty-${level}`}
                                    name="difficulty"
                                    value={level}
                                    label={level}
                                    checked={selectedDifficulty === level}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 4. Select Language */}
                    <div className="p-6 bg-black/20 border border-gray-700/80 rounded-xl">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">4. Select Language</h2>
                        <div className="flex flex-wrap gap-4">
                            {testData.languages.map(lang => (
                                <RadioButton
                                    key={lang}
                                    id={`language-${lang}`}
                                    name="language"
                                    value={lang}
                                    label={lang}
                                    checked={selectedLanguage === lang}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Continue Button --- */}
                <div className="pt-6 flex justify-center">
                    <button
                        onClick={handleContinue}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

// The main App component that renders our page
export default function App() {
  return <TestConfigurationPage />;
}
