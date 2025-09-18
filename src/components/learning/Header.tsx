import React from "react";
import { ROUTES } from "@/routes/constants";
import { X } from "lucide-react";
import SparklesIcon from "../icons/SparklesIcon";

interface VideoDetail {
  title?: string;
}

interface HeaderProps {
  videoDetail: VideoDetail | null;
  isLoading: boolean;
  onToggleFullScreen: () => void;
  onNavigate: (route: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    videoDetail,
    isLoading,
    onToggleFullScreen,
    onNavigate,
  }) => {
    return (
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-md text-gray-500 truncate">
            {isLoading ? (
              <div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse"></div>
            ) : (
              videoDetail?.title || "Video Title Not Available"
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => {
              onNavigate(ROUTES.PREMIUM);
            }}
            className="flex items-center gap-1 rounded-full py-2 ps-2.5 pe-3 text-sm font-semibold bg-gray-200 hover:bg-[#E4E4F6] dark:bg-[#373669] text-gray hover:text-white dark:hover:bg-[#414071] hover:bg-gradient-to-r from-blue-600 to-purple-700 cursor-pointer transition-colors glow-purple transition-transform transform hover:scale-105 focus:outline-none"
          >
            <SparklesIcon />
            <span className="">Upgrade</span>
          </button>
          <button
            className="p-2 text-muted-foreground hover:bg-foreground/10 rounded-full cursor-pointer"
            onClick={onToggleFullScreen}
          >
            <X />
          </button>
        </div>
      </header>
    );
  };

export default Header;
  