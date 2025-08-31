import { videoApi } from "@/lib/api-client";
import { buildVideoLearningRoute } from "@/routes/constants";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Type Definitions ---
interface CourseMetadata {
  exam: string;
  subject: string;
  year: string;
}

interface CourseCardProps {
  title: string;
  description: string;
  imageUrl: string;
  metadata?: CourseMetadata;
  youtubeYRL: string;
}

interface LearningHistoryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  metadata: CourseMetadata;
  youtubeYRL: string;
}

// --- Reusable CourseCard Component ---
const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  imageUrl,
  metadata,
  youtubeYRL,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasMetadata = metadata && Object.keys(metadata).length > 0;
  const navigate = useNavigate();

  const handleSuggestedVideoClick = async (videoUrl: string) => {
    try {
      // If validation passes, fetch video details
      const details = await videoApi.getVideoDetail(videoUrl);

      navigate(buildVideoLearningRoute(details.external_source_id));
    } catch (err: any) {
    } finally {
    }
  };

  return (
    <div
      className="group relative bg-card/80 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer hover:border-primary border border-border-medium hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        handleSuggestedVideoClick(youtubeYRL);
      }}
    >
      <img
        src={imageUrl}
        alt={`Thumbnail for ${title}`}
        className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "https://placehold.co/600x400/333/FFF?text=Error";
        }}
      />
      <div className="p-4">
        <h3 className="font-bold text-foreground truncate text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{hasMetadata?metadata.subject:"Subject"}</p>
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `75%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{75}% Complete</span>
          <span>Today</span>
        </div>
      </div>

      {/* Metadata Overlay */}
      {/**hasMetadata && (
        <div
          className={`absolute inset-0 bg-[rgba(22,27,34,0.95)] backdrop-blur-sm text-[#f0f6fc] flex flex-col items-center justify-center text-center opacity-0 invisible transition-opacity duration-300 ease-in-out p-5 ${
            isHovered ? "opacity-100 visible" : ""
          }`}
        >
          <div className="text-[1.1rem] my-1">
            <span className="font-semibold text-[#58a6ff]">Exam:</span>{" "}
            {metadata.exam}
          </div>
          <div className="text-[1.1rem] my-1">
            <span className="font-semibold text-[#58a6ff]">Subject:</span>{" "}
            {metadata.subject}
          </div>
          <div className="text-[1.1rem] my-1">
            <span className="font-semibold text-[#58a6ff]">Year:</span>{" "}
            {metadata.year}
          </div>
        </div>
      )*/}
    </div>
  );
};

// --- Main Page Component ---
const HistoryPage = () => {
  const learningHistoryData: LearningHistoryItem[] = [
    {
      id: 1,
      title: "Mastering Percentage Problems for IBPS PO",
      description:
        "Quick tricks and concepts for solving percentage questions efficiently.",
      imageUrl: "https://placehold.co/600x400/1a2a45/ffffff?text=Math",
      youtubeYRL: "https://www.youtube.com/watch?v=Eq7EUqRCoW8",
      metadata: {
        exam: "IBPS PO",
        subject: "Mathematics",
        year: "2024",
      },
    },
    {
      id: 2,
      title: "SSC CGL English Vocabulary Session",
      description:
        "Learn important vocabulary words frequently asked in SSC CGL exams.",
      imageUrl: "https://placehold.co/600x400/1a2a45/ffffff?text=English",
      youtubeYRL: "https://www.youtube.com/watch?v=TQaf1c6EV3U",
      metadata: {
        exam: "SSC CGL",
        subject: "English Language",
        year: "2024",
      },
    },
    {
      id: 3,
      title: "Railway NTPC General Awareness Mock Test",
      description:
        "Practice key General Awareness questions based on the latest NTPC syllabus.",
      imageUrl: "https://placehold.co/600x400/1a2a45/ffffff?text=GK",
      youtubeYRL: "https://www.youtube.com/watch?v=5Rh2gZbOeJo",
      metadata: {
        exam: "Railway NTPC",
        subject: "General Awareness",
        year: "2024",
      },
    },
  ];

  return (
    <div className="min-h-screen p-10 font-sans text-foreground bg-background mt-10 sm:mt-4">
      <h1 className="text-center sm:text-left text-3xl mb-10">
        Your Learning History
      </h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 mx-auto">
        {learningHistoryData.map((item) => (
          <CourseCard
            key={item.id}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            metadata={item.metadata}
            youtubeYRL={item.youtubeYRL}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
