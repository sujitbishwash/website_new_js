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
  <Icon
    path="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
    className="w-5 h-5"
  />
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

const Message: React.FC<MessageType> = ({ text, isUser }) => {
  const markdownText = text.replace(/\\n/g, "\n");
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        style={{
          backgroundColor: isUser ? theme.accent : theme.cardBackground,
        }}
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-700 text-gray-200 rounded-bl-none"
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
      <div className="text-sm leading-relaxed space-y-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Enhanced paragraph styling with better spacing
            p: ({ children, ...props }) => (
              <p
                {...props}
                className="mb-4 text-gray-100 leading-7"
                style={{
                  fontSize: "0.95rem",
                  lineHeight: "1.8",
                  marginBottom: "1.25rem",
                }}
              >
                {children}
              </p>
            ),
            // Enhanced heading styling with distinct backgrounds
            h1: ({ children, ...props }) => (
              <h1
                {...props}
                className="text-xl font-bold text-white mb-6 mt-8 pb-3 px-4 py-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border-l-4 border-blue-400"
                style={{ fontSize: "1.25rem" }}
              >
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2
                {...props}
                className="text-lg font-semibold text-blue-200 mb-4 mt-6 px-3 py-2 bg-blue-900/20 rounded-md border-l-3 border-blue-300"
                style={{ fontSize: "1.1rem" }}
              >
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3
                {...props}
                className="text-base font-medium text-blue-100 mb-3 mt-5 px-3 py-2 bg-blue-800/15 rounded-md border-l-2 border-blue-200"
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
                className="text-gray-200 leading-7 pl-2"
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
                className="bg-gray-700 text-green-300 px-2 py-1 rounded text-sm font-mono border border-gray-600"
                style={{
                  backgroundColor: "#374151",
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
                className="bg-gray-800 p-4 rounded-lg mb-6 overflow-x-auto border border-gray-600 shadow-lg"
                style={{
                  backgroundColor: "#1F2937",
                  padding: "1.25rem",
                  marginBottom: "2rem",
                }}
              >
                {children}
              </pre>
            ),
            // Enhanced blockquote styling for key points
            blockquote: ({ children, ...props }) => (
              <blockquote
                {...props}
                className="border-l-4 border-yellow-400 pl-6 py-4 my-6 bg-yellow-900/20 rounded-r-lg shadow-sm"
                style={{
                  borderLeftColor: "#FBBF24",
                  paddingLeft: "1.5rem",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem",
                  backgroundColor: "rgba(251, 191, 36, 0.1)",
                }}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 text-lg">💡</span>
                  <div className="text-yellow-100 font-medium">{children}</div>
                </div>
              </blockquote>
            ),
            // Enhanced strong/bold styling for concepts
            strong: ({ children, ...props }) => (
              <strong
                {...props}
                className="font-bold text-white bg-blue-900/30 px-2 py-1 rounded border border-blue-700/50"
                style={{ fontWeight: "700" }}
              >
                {children}
              </strong>
            ),
            // Enhanced emphasis/italic styling for examples
            em: ({ children, ...props }) => (
              <em
                {...props}
                className="italic text-purple-200 bg-purple-900/20 px-2 py-1 rounded border border-purple-700/50"
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
                  className="min-w-full border-collapse border border-gray-600 rounded-lg overflow-hidden shadow-lg"
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
                className="border border-gray-600 px-4 py-3 text-left font-bold text-white bg-gradient-to-r from-gray-700 to-gray-600"
                style={{
                  border: "1px solid #4B5563",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontWeight: "700",
                  backgroundColor: "#374151",
                }}
              >
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td
                {...props}
                className="border border-gray-600 px-4 py-3 text-gray-200 bg-gray-800/50"
                style={{
                  border: "1px solid #4B5563",
                  padding: "0.75rem 1rem",
                }}
              >
                {children}
              </td>
            ),
            // Enhanced horizontal rule styling
            hr: ({ ...props }) => (
              <hr
                {...props}
                className="my-8 border-gray-600 border-2"
                style={{
                  marginTop: "2rem",
                  marginBottom: "2rem",
                  borderColor: "#4B5563",
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
    <div className="p-2 bg-card border-t border-gray-700">
      <div className="bg-background border border-gray-700 rounded-xl p-2 flex flex-col">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          rows={1}
          style={{ minHeight: "40px", maxHeight: "200px" }}
          className="w-full bg-gray text-foreground placeholder-gray-400 focus:outline-none p-2 sm:pl-4 sm:pr-4 text-sm sm:text-base min-w-0"
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
            {/*
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
            </button>*/}
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
    <div className="flex flex-col h-full bg-background text-primaryText">
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
