import React, { useState } from "react";
import { BookOpen, Type } from "lucide-react";

interface Chapter {
  time: string;
  title: string;
  content: string;
}

interface ContentTabsProps {
  chapters: Chapter[];
  transcript: string;
  isLoadingChapters: boolean;
  isLoadingTranscript: boolean;
  chaptersError: string | null;
  transcriptError: string | null;
  onFetchTranscript: () => void;
  onSeekTo: (secs: number) => void;
  onFeedbackSubmit?: () => void;
  onFeedbackSkip?: () => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
    chapters,
    transcript,
    isLoadingChapters,
    isLoadingTranscript,
    chaptersError,
    transcriptError,
    onFetchTranscript,
    onSeekTo,
  }) => {
    const [activeTab, setActiveTab] = useState("chapters");
    return (
      <div className="bg-background text-foreground hidden sm:block">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3">
          <div className="flex items-center border border-border rounded-xl p-1 gap-2">
            <button
              onClick={() => setActiveTab("chapters")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors  cursor-pointer ${
                activeTab === "chapters"
                  ? "bg-foreground/20 shadow-sm text-foreground"
                  : "text-muted-foreground hover:bg-foreground/10"
              }`}
            >
              <BookOpen /> Chapters
            </button>
            <button
              onClick={() => setActiveTab("transcripts")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === "transcripts"
                  ? "bg-foreground/20 shadow-sm text-foreground"
                  : "text-muted-foreground hover:bg-foreground/10"
              }`}
            >
              <Type /> Transcripts
            </button>
          </div>
          <div className="flex items-center space-x-2 self-end sm:self-center">
            <label
              htmlFor="auto-scroll"
              className="text-xs sm:text-sm font-medium text-muted-foreground cursor-pointer"
            >
              Auto Scroll
            </label>
            <div className="relative inline-block w-8 sm:w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="auto-scroll"
                id="auto-scroll"
                className="toggle-checkbox absolute block w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-card border-4 border-border appearance-none cursor-pointer"
              />
              <label
                htmlFor="auto-scroll"
                className="toggle-label block overflow-hidden h-5 sm:h-6 rounded-full bg-border-medium cursor-pointer"
              ></label>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-5 rounded-xl border border-border ">
          {activeTab === "chapters" ? (
            isLoadingChapters ? (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-400"></div>
                <p className="mt-2 text-xs sm:text-sm text-gray-400">
                  Loading chapters...
                </p>
              </div>
            ) : chaptersError ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-xs sm:text-sm text-red-400">{chaptersError}</p>
              </div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-xs sm:text-sm text-gray-500">
                  No chapters available
                </p>
              </div>
            ) : (
              chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[auto,1fr] gap-x-2 sm:gap-x-4 group cursor-pointer"
                >
                  <div
                    className="text-xs sm:text-sm font-mono text-blue-400 pt-1 hover:underline"
                    onClick={() => {
                      const parts = chapter.time.split(':').map(Number);
                      let secs = 0;
                      if (parts.length === 3) secs = parts[0] * 3600 + parts[1] * 60 + parts[2];
                      else if (parts.length === 2) secs = parts[0] * 60 + parts[1];
                      onSeekTo(secs);
                    }}
                  >
                    {chapter.time}
                  </div>
                  <div className="border-l-2 border-gray-600 pl-2 sm:pl-4 group-hover:border-blue-500 transition-colors">
                    <h3
                      className="font-semibold text-foreground text-sm sm:text-base hover:text-blue-400"
                      onClick={() => {
                        const parts = chapter.time.split(':').map(Number);
                        let secs = 0;
                        if (parts.length === 3) secs = parts[0] * 3600 + parts[1] * 60 + parts[2];
                        else if (parts.length === 2) secs = parts[0] * 60 + parts[1];
                        onSeekTo(secs);
                      }}
                    >
                      {chapter.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {chapter.content}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : isLoadingTranscript ? (
            <div className="text-center py-6 sm:py-8">
              <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-400"></div>
              <p className="mt-2 text-xs sm:text-sm text-gray-400">
                Loading transcript...
              </p>
            </div>
          ) : transcriptError ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-xs sm:text-sm text-red-400 mb-4">
                {transcriptError}
              </p>
              <button
                onClick={onFetchTranscript}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : transcript ? (
            <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {transcript.split(/(\b\d{1,2}:\d{2}(?::\d{2})?\b)/g).map((chunk, i) => {
                const m = chunk.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
                if (m) {
                  const h = m[3] ? Number(m[1]) : 0;
                  const mm = m[3] ? Number(m[2]) : Number(m[1]);
                  const ss = m[3] ? Number(m[3]) : Number(m[2]);
                  const secs = h * 3600 + mm * 60 + ss;
                  return (
                    <span
                      key={i}
                      className="text-blue-400 hover:underline cursor-pointer"
                      onClick={() => onSeekTo(secs)}
                    >
                      {chunk}
                    </span>
                  );
                }
                return <span key={i}>{chunk}</span>;
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6 sm:py-8">
              <p className="text-xs sm:text-sm mb-4">
                Click the button below to fetch the video transcript.
              </p>
              <button
                onClick={onFetchTranscript}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fetch Transcript
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

export default ContentTabs;