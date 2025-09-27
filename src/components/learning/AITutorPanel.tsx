import React from "react";
import { MessageCircle, StickyNote, MessageCircleQuestion, Text, Ellipsis, MinimizeIcon } from "lucide-react";

type LearningMode = "chat" | "flashcards" | "quiz" | "summary";
const AITutorPanel: React.FC<{
    currentMode: LearningMode;
    onModeChange: (mode: LearningMode) => void;
    onToggleFullScreen: () => void;
    isLeftColumnVisible: boolean;
    onShare: () => void;
    // Components to render
    components: {
      chat: React.ReactNode;
      flashcards: React.ReactNode;
      quiz: React.ReactNode;
      summary: React.ReactNode;
    };
  }> = ({
    currentMode,
    onModeChange,
    onToggleFullScreen,
    isLeftColumnVisible,
    onShare,
    components,
  }) => {
    const modes: { key: LearningMode; label: string; icon: any }[] = [
      { key: "chat", label: "Chat", icon: <MessageCircle /> },
      { key: "flashcards", label: "Flashcards", icon: <StickyNote /> },
      { key: "quiz", label: "Quiz", icon: <MessageCircleQuestion /> },
      { key: "summary", label: "Summary", icon: <Text /> },
    ];
  
    return (
      <div className={`bg-card flex flex-col h-full sm:max-h-[100vh]`}>
        <div className="relative bg-background">
          <div
            className={`flex items-center ${
              isLeftColumnVisible ? "justify-between sm:justify-start" : "justify-center gap-2"
            } rounded-lg p-2 sm:p-4 w-full overflow-x-auto`}
          >
            {modes.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => onModeChange(key)}
                className={`flex-shrink-0 flex items-center justify-center gap-2 w-auto px-2 ${
                  isLeftColumnVisible ? "sm:px-2" : "sm:px-4"
                } py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentMode === key
                    ? "bg-card text-foreground"
                    : "text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <div className="flex flex-row items-center absolute top-1/2 -translate-y-1/2 right-2 space-x-2 sm:flex hidden">
            <button
              onClick={onShare}
              title="Share"
              className="p-2 text-foreground hover:bg-foreground/10 rounded-full transition-colors"
            >
              <Ellipsis />
            </button>
  
            <button
              onClick={onToggleFullScreen}
              title={
                isLeftColumnVisible ? "Full Screen Chat" : "Exit Full Screen"
              }
              className={`p-2 text-foreground hover:bg-foreground/10 rounded-full transition-colors ${
                isLeftColumnVisible ? "hidden" : "sm:block"
              }`}
            >
              <MinimizeIcon />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-background">
          {components[currentMode]}
        </div>
      </div>
    );
  };

export default AITutorPanel;
  