import React, { useState } from "react";
import { useThemeColors } from "../../contexts/ThemeContext";

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
}

interface LearningHistoryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  metadata: CourseMetadata;
}

// --- CSS Styles Component ---
// The CSS is now included directly in the component to avoid file resolution errors.
const HistoryStyles = () => {
  const theme = useThemeColors();

  return (
    <style>{`
      /* --- Main Page Styles --- */
      .history-page {
        background-color: ${theme.background};
        min-height: 100vh;
        padding: 40px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
          Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: ${theme.primaryText};
      }

      .main-title {
        text-align: center;
        color: ${theme.accent};
        font-size: 2.5rem;
        margin-bottom: 40px;
      }

      /* --- Grid Layout for Cards --- */
      .history-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      /* --- Reusable CourseCard Styles --- */
      .course-card {
        background-color: ${theme.card};
        border: 1px solid ${theme.border};
        border-radius: 8px;
        overflow: hidden;
        position: relative; /* Required for the overlay */
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
      }

      .course-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(88, 166, 255, 0.2);
      }

      .card-image {
        height: 150px;
        background-size: cover;
        background-position: center;
        border-bottom: 1px solid ${theme.border};
      }

      .card-content {
        padding: 20px;
      }

      .card-content h3 {
        margin-top: 0;
        font-size: 1.2rem;
        color: ${theme.primaryText};
      }

      .card-content p {
        font-size: 0.9rem;
        color: ${theme.secondaryText};
        line-height: 1.5;
      }

      /* --- Metadata Overlay Styles --- */
      .metadata-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        color: ${theme.primaryText};
        text-align: center;
        padding: 20px;
      }

      .course-card:hover .metadata-overlay {
        opacity: 1;
      }

      .metadata-overlay h4 {
        margin: 0 0 10px;
        color: ${theme.accent};
      }

      .metadata-overlay p {
        margin: 5px 0;
        color: ${theme.secondaryText};
      }

      /* --- Responsive Design --- */
      @media (max-width: 768px) {
        .history-page {
          padding: 20px;
        }
        
        .main-title {
          font-size: 2rem;
        }
        
        .history-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      }
    `}</style>
  );
};

// --- Reusable CourseCard Component ---
// This component displays a single course card.
const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  imageUrl,
  metadata,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasMetadata = metadata && Object.keys(metadata).length > 0;

  return (
    <div
      className="course-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="card-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      {/* This is the overlay that appears on hover if metadata exists */}
      {hasMetadata && (
        <div className={`metadata-overlay ${isHovered ? "visible" : ""}`}>
          <div className="metadata-item">
            <span>Exam:</span> {metadata.exam}
          </div>
          <div className="metadata-item">
            <span>Subject:</span> {metadata.subject}
          </div>
          <div className="metadata-item">
            <span>Year:</span> {metadata.year}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---
// This component holds the title and the grid of cards.
const HistoryPage = () => {
  // Sample data. In a real app, this would come from an API.
  const learningHistoryData: LearningHistoryItem[] = [
    {
      id: 1,
      title: "Mastering Percentage Problems for IBPS PO",
      description:
        "Quick tricks and concepts for solving percentage questions efficiently.",
      imageUrl: "https://placehold.co/600x400/1a2a45/ffffff?text=Math",
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
      metadata: {
        exam: "Railway NTPC",
        subject: "General Awareness",
        year: "2024",
      },
    },
  ];

  return (
    <>
      <HistoryStyles />
      <div className="history-page">
        <h1 className="main-title">Your Learning History</h1>
        <div className="history-grid">
          {learningHistoryData.map((item) => (
            <CourseCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              metadata={item.metadata}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
// saving
