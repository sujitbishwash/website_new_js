import React, { useState } from 'react';

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  exam?: string;
  subject?: string;
  year?: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hasMetadata = course.exam || course.subject || course.year;

  return (
    <div 
      className="bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
      onMouseEnter={() => hasMetadata && setIsHovered(true)}
      onMouseLeave={() => hasMetadata && setIsHovered(false)}
    >
      <img 
        src={course.imageUrl} 
        alt={course.title} 
        className="w-full h-48 object-cover"
      />
      
      <div className="p-6 relative h-48">
        {/* Main Content */}
        <div className={`absolute inset-0 p-6 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <h3 className="text-xl font-bold mb-2">{course.title}</h3>
          <p className="text-gray-400">{course.description}</p>
        </div>
        
        {/* Metadata Content */}
        {hasMetadata && (
          <div className={`absolute inset-0 p-6 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col justify-center h-full">
              <h3 className="text-xl font-bold mb-4">Details</h3>
              <div className="space-y-2">
                {course.exam && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Exam:</span>
                    <span>{course.exam}</span>
                  </div>
                )}
                {course.subject && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subject:</span>
                    <span>{course.subject}</span>
                  </div>
                )}
                {course.year && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Year:</span>
                    <span>{course.year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
