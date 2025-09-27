import React from "react";

interface ContentCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }
const ContentCard = ({ icon, title, children }: ContentCardProps) => (
    <div className="bg-gray-700 rounded-2xl p-5 border border-gray-600 flex-shrink-0 w-full snap-center flex flex-col justify-between min-h-[250px] shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-white text-lg font-semibold m-0">{title}</h3>
      </div>
      <div className="text-gray-400 flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );

export default ContentCard;