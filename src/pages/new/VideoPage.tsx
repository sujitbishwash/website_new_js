import Chat from "@/components/learning/Chat";
import { useState } from "react";

// Type definitions
interface IconProps {
  path: string;
  className?: string;
}

interface VideoPlayerProps {
  src: string;
}

interface Chapter {
  time: string;
  title: string;
  content: string;
}

interface ContentTabsProps {
  chapters: Chapter[];
}

// --- Icon Components (using inline SVG for portability) ---
// Note: In a real project, it's better to use a library like lucide-react
const Icon: React.FC<IconProps> = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={path} />
  </svg>
);

const ShareIcon: React.FC = () => (
  <Icon
    path="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v14"
    className="w-5 h-5"
  />
);

// --- Sub-Components for Modularity ---

const Header: React.FC = () => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
    <div>
      <p className="text-sm text-gray-500">
        Introduction To Galan Nelson's Lecture On Advanced Algorithms
      </p>
    </div>
    <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
      <button className="flex-grow sm:flex-grow-0 bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-green-200 transition-colors">
        Upgrade
      </button>
      <div className="hidden md:flex items-center space-x-2">
        <span className="text-sm font-medium whitespace-nowrap">
          Complete Profile 60%
        </span>
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>
      <button className="flex items-center space-x-2 text-gray-600 font-medium px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
        <ShareIcon />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  </header>
);

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => (
  <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden shadow-lg mb-4">
    <iframe
      src={src}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    ></iframe>
  </div>
);

const ContentTabs: React.FC<ContentTabsProps> = ({ chapters }) => {
  const [activeTab, setActiveTab] = useState("chapters");
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 pt-3 pb-2 gap-2">
        <div className="flex items-center border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("chapters")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "chapters"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Chapters
          </button>
          <button
            onClick={() => setActiveTab("transcripts")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "transcripts"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Transcripts
          </button>
        </div>
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <label
            htmlFor="auto-scroll"
            className="text-sm font-medium text-gray-600 cursor-pointer"
          >
            Auto Scroll
          </label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="auto-scroll"
              id="auto-scroll"
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="auto-scroll"
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-5 max-h-[300px] overflow-y-auto">
        {activeTab === "chapters" ? (
          chapters.map((chapter: Chapter, index: number) => (
            <div
              key={index}
              className="grid grid-cols-[auto,1fr] gap-x-4 group cursor-pointer"
            >
              <div className="text-sm font-mono text-gray-500 pt-1">
                {chapter.time}
              </div>
              <div className="border-l-2 border-gray-200 pl-4 group-hover:border-blue-500 transition-colors">
                <h3 className="font-semibold text-gray-800">{chapter.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{chapter.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>Transcript content would appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AITutorPanel: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col h-full">
    {/* The content area is now empty, ready for components to be added. */}
    <div className="flex-grow">
      <Chat />
    </div>
  </div>
);

// --- Main App Component ---
const VideoPage: React.FC = () => {
  const chapters: Chapter[] = [
    {
      time: "00:55",
      title: "Course Overview and Logistics",
      content:
        "Participants are encouraged to visit the course website and sign up for the mailing list. The instructor will provide logistical details and outline the course goals before diving into the content.",
    },
    {
      time: "01:39",
      title: "Grading Components",
      content:
        "The course grading consists of three components, with scribing accounting for 10% of the overall grade, problem sets for 60%, and a final project for the remaining 30%.",
    },
    {
      time: "05:20",
      title: "Scribing Requirement",
      content:
        "Each student is required to scribe one lecture, with the option to collaborate with a partner. Scribing involves taking detailed notes and creating a polished document.",
    },
    {
      time: "08:45",
      title: "Introduction to Algorithms",
      content:
        "A brief overview of what algorithms are and why they are fundamental to computer science and problem-solving in various domains.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="container mx-auto px-4 py-6">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VideoPlayer src="https://www.youtube.com/embed/Q8g9zL-JL8E" />
            <ContentTabs chapters={chapters} />
          </div>
          <div className="lg:col-span-1">
            <AITutorPanel />
          </div>
        </main>
      </div>
      <style>{`
                /* Simple toggle switch styles */
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #3b82f6; /* blue-500 */
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #3b82f6; /* blue-500 */
                }
                /* Custom scrollbar for webkit browsers */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 4px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #cbd5e1; /* gray-300 */
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8; /* gray-400 */
                }
                /* For aspect ratio plugin fallback */
                .aspect-w-16 { position: relative; padding-bottom: 56.25%; }
                .aspect-h-9 { }
                .aspect-w-16 > *, .aspect-h-9 > * { position: absolute; height: 100%; width: 100%; top: 0; right: 0; bottom: 0; left: 0; }
            `}</style>
    </div>
  );
};

export default VideoPage;
