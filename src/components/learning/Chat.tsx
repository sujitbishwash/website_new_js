import { ArrowUp, MessageCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  messages: Array<{ text: string; isUser: boolean }>;
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  isLeftColumnVisible: boolean;
  // Optional props to prevent duplicate API calls when passed from parent
  canSubmitFeedback?: boolean;
  existingFeedback?: any;
  markAsSubmitted?: () => void;
}

// --- SVG Icons ---
// Using inline SVGs to keep the component self-contained.
// --- Icon Components (using inline SVG for portability) ---

// commented until usage is confirmed
/*
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
*/

// --- Components ---

const ChatHeader: React.FC = () => (
  <div className="text-center p-6 md:p-8">
    <div className="inline-block p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full mb-6 border border-blue-600/30 shadow-lg backdrop-blur-sm">
      <MessageCircle height={48} width={48}/>
    </div>
    {/* Changed title from "AI Tutor" to "AI Padhai" */}
    <h1
      className="text-3xl sm:text-4xl font-bold mb-4 text-primary"
      style={{
        background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      Learn with AI Padhai
    </h1>
    <p className="text-foreground text-lg max-w-md mx-auto leading-relaxed">
      Your intelligent learning companion for personalized education and
      interactive discussions
    </p>
  </div>
);

const SuggestionChip: React.FC<{ text: string }> = ({ text }) => (
  <button className="bg-gradient-to-r from-gray-700/80 to-gray-600/80 hover:from-gray-600/90 hover:to-gray-500/90 transition-all duration-300 text-sm md:text-base text-foreground py-3 px-6 rounded-full backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/60 shadow-lg hover:shadow-xl transform hover:scale-105">
    {text}
  </button>
);

const SuggestionChips: React.FC = () => {
  const suggestions = ["Quiz", "Flashcards", "Summary"];
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 p-6">
      {suggestions.map((item) => (
        <SuggestionChip key={item} text={item} />
      ))}
    </div>
  );
};

const Message: React.FC<MessageType> = ({ text, isUser }) => {
  const markdownText = text.replace(/\\n/g, "\n");

  // Check if message contains specific content types for enhanced styling
  const hasKeyPoints =
    text.includes("💡") ||
    text.toLowerCase().includes("key point") ||
    text.toLowerCase().includes("important");
  const hasExamples =
    text.toLowerCase().includes("example") ||
    text.toLowerCase().includes("for instance");
  const hasConcepts =
    text.toLowerCase().includes("concept") ||
    text.toLowerCase().includes("definition");
  const hasExplanation =
    text.toLowerCase().includes("explanation") ||
    text.toLowerCase().includes("means") ||
    text.toLowerCase().includes("refers to");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-center"} mb-6`}>
      <div
        className={`px-5 rounded-2xl ${
          isUser
            ? "bg-primary text-white rounded-tr-none"
            : hasKeyPoints
            ? "bg-transparent text-yellow-100 rounded-bl-none"
            : hasExamples
            ? "bg-transparent text-purple-100 rounded-bl-none"
            : hasConcepts
            ? "bg-transparent text-blue-100 rounded-bl-none"
            : hasExplanation
            ? "bg-transparent text-green-100 rounded-bl-none"
            : "bg-transparent text-foreground rounded-bl-none"
        }`}
      >
        <MarkdownRenderer content={markdownText} />
      </div>
    </div>
  );
};

const MessageList: React.FC<{ messages: MessageType[] }> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-2 py-4">
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
        <span className="text-xs sm:text-sm font-medium">{selectedPlan}</span>
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
              className="block px-4 py-2 text-sm text-foreground hover:bg-gray-700 rounded-lg"
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
              className="block px-4 py-2 text-sm text-foreground hover:bg-gray-700 rounded-lg"
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

// --- Markdown Renderer ---
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // Clean and process the content for better rendering
  const processContent = (text: string) => {
    return text
      .replace(/\\n/g, "\n") // Convert escaped newlines to actual newlines
      .trim();
  };

  const processedContent = processContent(content);

  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <div className="text-sm leading-relaxed space-y-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Enhanced paragraph styling with better spacing
            p: ({ children, ...props }) => (
              <p
                {...props}
                className="mb-5 text-foreground leading-7"
                style={{
                  fontSize: "0.95rem",
                  lineHeight: "1.8",
                  marginBottom: "1.5rem",
                }}
              >
                {children}
              </p>
            ),
            // Clean, minimal heading styling without backgrounds
            h1: ({ children, ...props }) => (
              <h1
                {...props}
                className="text-xl font-bold text-foreground mb-6 mt-8 pb-2 border-b border-gray-600/30"
                style={{ fontSize: "1.25rem" }}
              >
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2
                {...props}
                className="text-lg font-semibold text-blue-200 mb-4 mt-6"
                style={{ fontSize: "1.1rem" }}
              >
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3
                {...props}
                className="text-base font-medium text-blue-100 mb-3 mt-5"
                style={{ fontSize: "1rem" }}
              >
                {children}
              </h3>
            ),
            // Enhanced list styling with proper spacing and visual hierarchy
            ul: ({ children, ...props }) => (
              <ul
                {...props}
                className="ml-6 mb-6 space-y-3"
                style={{ listStyleType: "disc" }}
              >
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol
                {...props}
                className="ml-6 mb-6 space-y-3"
                style={{ listStyleType: "decimal" }}
              >
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li
                {...props}
                className="text-foreground leading-7 pl-2"
                style={{
                  fontSize: "0.9rem",
                  lineHeight: "1.8",
                  marginBottom: "0.75rem",
                  display: "list-item",
                }}
              >
                {children}
              </li>
            ),
            // Enhanced code styling with better contrast
            code: ({ children, ...props }) => (
              <code
                {...props}
                className="bg-gray-700/50 text-green-300 px-2 py-1 rounded text-sm font-mono border border-gray-600/50"
                style={{
                  backgroundColor: "rgba(55, 65, 81, 0.5)",
                  fontSize: "0.85rem",
                  padding: "0.25rem 0.5rem",
                }}
              >
                {children}
              </code>
            ),
            pre: ({ children, ...props }) => (
              <pre
                {...props}
                className="bg-gray-800/50 p-4 rounded-lg mb-6 overflow-x-auto border border-gray-600/50 shadow-lg backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(31, 41, 55, 0.5)",
                  padding: "1.25rem",
                  marginBottom: "2rem",
                }}
              >
                {children}
              </pre>
            ),
            // Enhanced blockquote styling for key points with full-width design
            blockquote: ({ children, ...props }) => (
              <blockquote
                {...props}
                className="border-l-4 border-yellow-400 pl-6 py-4 my-6 bg-yellow-900/10 rounded-r-lg shadow-sm backdrop-blur-sm"
                style={{
                  borderLeftColor: "#FBBF24",
                  paddingLeft: "1.5rem",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem",
                  backgroundColor: "rgba(251, 191, 36, 0.05)",
                }}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">💡</span>
                  <div className="text-yellow-100 font-medium">{children}</div>
                </div>
              </blockquote>
            ),
            // Enhanced strong/bold styling for concepts
            strong: ({ children, ...props }) => (
              <strong
                {...props}
                className="font-bold text-foreground bg-blue-900/20 px-2 py-1 rounded border border-blue-700/30"
                style={{ fontWeight: "700" }}
              >
                {children}
              </strong>
            ),
            // Enhanced emphasis/italic styling for examples
            em: ({ children, ...props }) => (
              <em
                {...props}
                className="italic text-purple-200 bg-purple-900/20 px-2 py-1 rounded border border-purple-700/30"
                style={{ fontStyle: "italic" }}
              >
                {children}
              </em>
            ),
            // Enhanced link styling
            a: ({ children, href, ...props }) => (
              <a
                {...props}
                href={href}
                className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 bg-blue-900/20 px-2 py-1 rounded hover:bg-blue-800/30 transition-colors"
                style={{
                  color: "#60A5FA",
                  textDecorationColor: "rgba(96, 165, 250, 0.5)",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            // Enhanced table styling
            table: ({ children, ...props }) => (
              <div className="overflow-x-auto mb-6">
                <table
                  {...props}
                  className="min-w-full border-collapse border border-gray-600/50 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm"
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                  }}
                >
                  {children}
                </table>
              </div>
            ),
            th: ({ children, ...props }) => (
              <th
                {...props}
                className="border border-gray-600/50 px-4 py-3 text-left font-bold text-foreground bg-gray-700/50"
                style={{
                  border: "1px solid rgba(75, 85, 99, 0.5)",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontWeight: "700",
                  backgroundColor: "rgba(55, 65, 81, 0.5)",
                }}
              >
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td
                {...props}
                className="border border-gray-600/50 px-4 py-3 text-foreground bg-gray-800/30"
                style={{
                  border: "1px solid rgba(75, 85, 99, 0.5)",
                  padding: "0.75rem 1rem",
                  backgroundColor: "rgba(31, 41, 55, 0.3)",
                }}
              >
                {children}
              </td>
            ),
            // Enhanced horizontal rule styling
            hr: ({ ...props }) => (
              <hr
                {...props}
                className="my-8 border-gray-600/30 border-2"
                style={{
                  marginTop: "2rem",
                  marginBottom: "2rem",
                  borderColor: "rgba(75, 85, 99, 0.3)",
                  borderWidth: "2px",
                }}
              />
            ),
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const ChatInput: React.FC<{
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
  isLeftColumnVisible: boolean;
}> = ({ onSendMessage, isLoading = false, isLeftColumnVisible }) => {
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
    <div className={`p-4 w-full flex justify-center`}>
      <div
        className={`bg-card border border-border rounded-2xl p-2 flex flex-col ${
          isLeftColumnVisible ? "w-full" : "sm:w-[50vw]"
        }`}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          rows={1}
          style={{ minHeight: "40px", maxHeight: "200px" }}
          className="w-full bg-gray text-foreground placeholder-gray-400 focus:outline-none p-2 sm:pl-4 sm:pr-4 text-sm sm:text-base min-w-0"
        />
        <div className="flex items-center justify-end gap-1">
          {/**<div className="flex items-center justify-between mt-2">
            <div className="hidden sm:block">
              <PlanSelector />
            </div>

            <div className="sm:ml-2">
              <ModeSelector />
            </div>
          </div>*/}

          <div className="flex items-center gap-1">
            {/*
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-foreground hover:bg-gray-700 rounded-full"
            >
              <PlusIcon />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-foreground hover:bg-gray-700 rounded-full"
            >
              <SettingsIcon />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-foreground hover:bg-gray-700 rounded-full"
            >
              <CanvasIcon />
            </button>*/}
            <button
              onClick={handleSend}
              type="submit"
              className="p-2 text-white bg-border-medium rounded-full hover:bg-border-high disabled:bg-border disabled:text-border cursor-pointer"
              disabled={isLoading}
            >
              <ArrowUp />
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
  isLeftColumnVisible,
  canSubmitFeedback,
  existingFeedback,
  markAsSubmitted,
}: ChatProps) {

  return (
    <div className="flex flex-col flex-1 h-full bg-background text-primaryText w-full">
      {/* Wrapper to center content if left column hidden */}
      <div
        className={`flex flex-1 overflow-y-auto pr-2 ${
          !isLeftColumnVisible ? "justify-center " : ""
        }`}
      >
        <div className={`w-full ${!isLeftColumnVisible ? "max-w-[60vw]" : ""}`}>
          {messages.length === 0 && (
            <div className="flex flex-col justify-center items-center p-8 space-y-8">
              <ChatHeader />
              <SuggestionChips />
            </div>
          )}
          {messages.length > 0 && <MessageList messages={messages} />}
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-600/30 rounded-lg px-4 py-3 text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        isLeftColumnVisible={isLeftColumnVisible}
      />
    </div>
  );
}
