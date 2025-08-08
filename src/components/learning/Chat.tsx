import React, { useEffect, useRef, useState } from "react";

// Centralized theme colors for easy customization
const theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  inputBackground: "#374151",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  mutedText: "#6B7280",
  accent: "#60A5FA",
  buttonGradientFrom: "#3B82F6",
  buttonGradientTo: "#2563EB",
  divider: "#4B5563",
};

// --- Type Definitions ---
interface IconProps {
  path: string;
  className?: string;
}

interface MessageType {
  text: string;
  isUser: boolean;
}

interface ChatProps {
  videoId: string;
  messages: Array<{ text: string; isUser: boolean }>;
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
}

// --- SVG Icons ---
// Using inline SVGs to keep the component self-contained.
// --- Icon Components (using inline SVG for portability) ---
const Icon: React.FC<IconProps> = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={path} />
  </svg>
);

const BrainIcon: React.FC = () => (
  // Changed icon color from green to blue to match the new theme
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-400"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h-3A2.5 2.5 0 0 1 4 4.5v0A2.5 2.5 0 0 1 6.5 2h3Z" />
    <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7h-3a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 11.5 2h3Z" />
    <path d="M12 12a2.5 2.5 0 0 0-2.5-2.5h-3A2.5 2.5 0 0 0 4 12v3A2.5 2.5 0 0 0 6.5 17.5h3A2.5 2.5 0 0 0 12 15v-3Z" />
    <path d="M12 12a2.5 2.5 0 0 1 2.5-2.5h3A2.5 2.5 0 0 1 20 12v3a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 12 15v-3Z" />
    <path d="M12 7.5V9" />
    <path d="M12 17.5v1.5" />
    <path d="m14.5 9.5 1-1" />
    <path d="m9.5 9.5-1-1" />
  </svg>
);
const PlusIcon = () => <Icon path="M12 5v14 M5 12h14" className="w-5 h-5" />;
const SettingsIcon = () => (
  <Icon
    path="M12.22 2h-0.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
    className="w-5 h-5"
  />
);
const CanvasIcon = () => (
  <Icon
    path="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M12 18H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V8h10v2z"
    className="w-5 h-5"
  />
);
const SendIcon = () => (
  <Icon path="M22 2L11 13 2 9l-1.5 9L22 2z" className="w-5 h-5" />
);

// --- Components ---

const ChatHeader: React.FC = () => (
  <div className="text-center p-4 md:p-6">
    <div className="inline-block p-4 bg-gray-800 rounded-full mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke={theme.secondaryText}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    {/* Changed title from "AI Tutor" to "AI Padhai" */}
    <h1
      className="text-2xl sm:text-3xl font-bold"
      style={{ color: theme.primaryText }}
    >
      Learn with AI Padhai
    </h1>
  </div>
);

const SuggestionChip: React.FC<{ text: string }> = ({ text }) => (
  <button className="bg-gray-700/80 hover:bg-gray-600 transition-colors duration-200 text-sm md:text-base text-gray-200 py-2 px-4 rounded-full backdrop-blur-sm">
    {text}
  </button>
);

const SuggestionChips: React.FC = () => {
  const suggestions = ["Quiz", "Flashcards", "Summary"];
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 p-4">
      {suggestions.map((item) => (
        <SuggestionChip key={item} text={item} />
      ))}
    </div>
  );
};

const Message: React.FC<MessageType> = ({ text, isUser }) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
    <div
      style={{ backgroundColor: isUser ? theme.accent : theme.cardBackground }}
      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isUser
          ? "bg-blue-600 text-white rounded-br-none"
          : "bg-gray-700 text-gray-200 rounded-bl-none"
      }`}
    >
      {text}
    </div>
  </div>
);

const MessageList: React.FC<{ messages: MessageType[] }> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
      {messages.map((msg, index) => (
        <Message key={index} text={msg.text} isUser={msg.isUser} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

const PlanSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Free");
  const plans = ["Free", "Paid"];
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 sm:p-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <span
          className="text-xs sm:text-sm font-medium"
        >
          {selectedPlan}
        </span>
        <svg
          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-28 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
          {plans.map((plan) => (
            <a
              key={plan}
              href="#"
              className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                setSelectedPlan(plan);
                setIsOpen(false);
              }}
            >
              {plan}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const ModeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Learn");
  const modes = ["Learn", "Chat"];
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Changed styling from green to blue */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 sm:p-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <span className="hidden sm:inline text-xs sm:text-sm font-medium">
          {selectedMode}
        </span>
        <svg
          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-28 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
          {modes.map((mode) => (
            <a
              key={mode}
              href="#"
              className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                setSelectedMode(mode);
                setIsOpen(false);
              }}
            >
              {mode}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const ChatInput: React.FC<{
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}> = ({ onSendMessage, isLoading = false }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-2 bg-gray-800 border-t border-gray-700">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-2 flex flex-col">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          rows={1}
          style={{ minHeight: "40px", maxHeight: "200px" }}
          className="w-full bg-gray text-white placeholder-gray-400 focus:outline-none p-2 sm:pl-4 sm:pr-4 text-sm sm:text-base min-w-0"
        />
        <div className="flex items-center justify-between gap-1">
        <div className="flex items-center justify-between mt-2">
          {/* Plan Selector - Hidden on very small screens */}
          <div className="hidden sm:block">
            <PlanSelector />
          </div>

          {/* Mode Selector - More compact on small screens */}
          <div className="sm:ml-2">
            <ModeSelector />
          </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
            >
              <PlusIcon />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
            >
              <SettingsIcon />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
            >
              <CanvasIcon />
            </button>
          <button
          onClick={handleSend}
            type="submit"
            className="p-2 text-white bg-gray-700 rounded-full hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 cursor-pointer"
            disabled={isLoading}
          >
            <SendIcon />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function Chat({
  videoId,
  messages,
  isLoading,
  error,
  onSendMessage,
}: ChatProps) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: theme.background }}
    >
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 p-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col justify-center items-center p-4">
            <ChatHeader />
            <SuggestionChips />
          </div>
        )}
        {messages.length > 0 && <MessageList messages={messages} />}
        {error && <div className="text-red-400 text-sm">{error}</div>}
      </div>
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
