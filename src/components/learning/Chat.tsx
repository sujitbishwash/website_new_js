import React, { useEffect, useRef, useState } from "react";
import { chatApi } from "../../lib/api-client";

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
interface MessageType {
  text: string;
  isUser: boolean;
}

interface ChatProps {
  videoId: string;
}

// --- SVG Icons ---
// Using inline SVGs to keep the component self-contained.

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
  <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
    <div
      className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] px-4 py-3 rounded-2xl ${
        isUser ? "bg-blue-600" : ""
      }`}
      style={{ backgroundColor: isUser ? theme.accent : theme.cardBackground }}
    >
      <p className="text-base break-words" style={{ color: theme.primaryText }}>
        {text}
      </p>
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
    <div className="flex-grow p-3 sm:p-4 md:p-6 overflow-y-auto">
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
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <span
          className="text-sm font-medium"
          style={{ color: theme.primaryText }}
        >
          {selectedPlan}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
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
        className="flex items-center ml-2 space-x-2 px-3 py-1.5 bg-blue-900/50 rounded-full border border-blue-400/50 hover:bg-blue-800/60 hover:border-blue-300/70 transition-all duration-300 cursor-pointer"
      >
        <BrainIcon />
        <span className="hidden sm:inline text-blue-300 text-sm font-medium">
          {selectedMode}
        </span>
        <svg
          className={`w-4 h-4 text-blue-300 transition-transform duration-200 ${
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
    <div className="px-2 sm:px-4 md:px-6 py-4">
      <div
        className="flex items-center p-2 rounded-2xl"
        style={{ backgroundColor: theme.cardBackground }}
      >
        <PlanSelector />
        <ModeSelector />

        <div className="flex-grow mx-2 sm:mx-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything"
            className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none pl-4 pr-4"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={isLoading}
          className="ml-2 sm:ml-4 px-3 sm:px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          )}
          <span className="hidden sm:inline">
            {isLoading ? "Sending..." : "Send"}
          </span>
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function Chat({ videoId }: ChatProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChatHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const history = await chatApi.getChatHistory(videoId);
      if (history.memory && history.memory.length > 0) {
        const convertedMessages = history.memory.map((msg) => ({
          text: msg.content,
          isUser: msg.role === "user",
        }));
        setMessages(convertedMessages);
      } else {
        // If no history, start a new chat
        try {
          const startResponse = await chatApi.startChat(videoId);
          setMessages([{ text: startResponse.content, isUser: false }]);
        } catch (startErr) {
          console.error("Failed to start chat:", startErr);
          setError("Failed to start new chat.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
      setError("Failed to load chat history. Starting new chat.");

      // Try to start a new chat if history fails
      try {
        const startResponse = await chatApi.startChat(videoId);
        setMessages([{ text: startResponse.content, isUser: false }]);
      } catch (startErr) {
        console.error("Failed to start chat:", startErr);
        setError("Failed to start new chat.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message immediately
    const userMessage = { text: message, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.sendMessage(videoId, message);
      const assistantMessage = { text: response.content, isUser: false };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
      // Remove the user message if sending failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [videoId]);

  return (
    <div
      className="font-sans flex flex-col h-screen"
      style={{ backgroundColor: theme.background }}
    >
      <main className="flex-grow flex flex-col max-w-5xl w-full mx-auto">
        <div className="flex-grow flex flex-col justify-end min-h-0">
          {messages.length === 0 && (
            <div className="flex-grow flex flex-col justify-center items-center">
              <ChatHeader />
              <SuggestionChips />
            </div>
          )}
          {messages.length > 0 && <MessageList messages={messages} />}
          {error && (
            <div className="p-4 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}
