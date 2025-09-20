import { ArrowUp, MessageCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import VideoFeedbackModal from "@/components/feedback/VideoFeedbackModal";

// Centralized theme colors for easy customization

// --- Type Definitions ---

interface MessageType {
  text: string;
  isUser: boolean;
}

interface FeedbackData {
  id: string;
  rating: number;
  description: string;
  date_submitted: string;
  page_url: string;
}

interface ChatProps {
  videoId: string;
  messages: Array<{ text: string; isUser: boolean }>;
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  isLeftColumnVisible: boolean;
  // Optional props to prevent duplicate API calls when passed from parent
  canSubmitFeedback?: boolean | undefined;
  existingFeedback?: FeedbackData | null;
  markAsSubmitted?: () => void;
}

// --- Components ---

// Typing indicator component with animated dots
const TypingIndicator: React.FC = () => (
  <div className="flex justify-center mb-6">
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1">
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "200ms", animationDuration: "1.4s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "400ms", animationDuration: "1.4s" }}
        ></div>
      </div>
      <span className="text-sm text-blue-200 font-medium">
        AI is thinking...
      </span>
    </div>
  </div>
);




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
        <MarkdownRenderer content={markdownText} isUser={isUser} />
      </div>
    </div>
  );
};

const MessageList: React.FC<{
  messages: MessageType[];
  isLoading: boolean;
}> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-2 py-4">
      {messages.map((msg, index) => {
        return <Message key={index} text={msg.text} isUser={msg.isUser} />;
      })}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

// --- Markdown Renderer ---
const MarkdownRenderer: React.FC<{ content: string, isUser?: boolean }> = ({ content, isUser=false }) => {
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
                className={`${isUser ? "text-white":"text-foreground"} leading-7`}
                style={{
                  fontSize: "0.95rem",
                  lineHeight: "1.8",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
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
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
  isLeftColumnVisible: boolean;
}> = ({
  textAreaRef,
  onSendMessage,
  isLoading = false,
  isLeftColumnVisible,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  // Automatically adjust textarea height
  React.useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [inputValue, textAreaRef]);

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
        } ${isLoading ? "animate-pulse border-blue-400/50" : ""}`}
      >
        <textarea
          ref={textAreaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isLoading ? "AI is thinking..." : "Ask a question..."}
          rows={1}
          style={{ minHeight: "40px", maxHeight: "200px" }}
          disabled={isLoading}
          className={`w-full bg-gray text-foreground placeholder-gray-400 focus:outline-none p-2 sm:pl-4 sm:pr-4 text-sm sm:text-base min-w-0 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <div className="flex items-center justify-end gap-1">
          <div className="flex items-center gap-1">
            <button
              onClick={handleSend}
              type="submit"
              className={`p-2 text-white rounded-full transition-all duration-200 ${
                isLoading
                  ? "bg-blue-500/50 cursor-not-allowed animate-pulse"
                  : "bg-border-medium hover:bg-border-high cursor-pointer"
              }`}
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ArrowUp />
              )}
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
  // Feedback state management
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  // Check if feedback modal should open after 5 conversations
  useEffect(() => {
    // Count user messages (excluding AI responses)
    const userMessageCount = messages.filter((msg) => msg.isUser).length;

    if (
      userMessageCount >= 5 &&
      canSubmitFeedback === true &&
      !existingFeedback && // Check prop, not local state
      !isFeedbackModalOpen
    ) {
      setIsFeedbackModalOpen(true);
    }
  }, [messages, canSubmitFeedback, existingFeedback, isFeedbackModalOpen]);

  // Feedback handlers
  const handleFeedbackClose = () => {
    setIsFeedbackModalOpen(false);
  };

  const handleFeedbackDismiss = () => {
    setIsFeedbackModalOpen(false);
    // Mark that user has dismissed the feedback request
    if (markAsSubmitted) {
      markAsSubmitted();
    }
  };

  const handleFeedbackSkip = () => {
    setIsFeedbackModalOpen(false);
    // Mark that user has skipped the feedback request
    if (markAsSubmitted) {
      markAsSubmitted();
    }
  };

  const handleFeedbackSubmit = async (_payload: any) => {
    if (markAsSubmitted) {
      markAsSubmitted();
    }
    setIsFeedbackModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-background text-primaryText w-full">
      {/* Conversation progress indicator - Fixed sticky positioning */}
      {messages.length > 0 && (
        <div className="px-4 sm:px-4 sticky top-0 bg-background z-10 border-b border-border/50">
          <div
            className={`w-full ${
              !isLeftColumnVisible ? "max-w-[60vw] mx-auto" : ""
            }`}
          >
            {/**<div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Conversation Progress</span>
              <span className="flex items-center gap-2">
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  {messages.filter((msg) => msg.isUser).length} messages
                </span>
                {!existingFeedback && (
                  <span className="text-xs text-muted-foreground">
                    {Math.max(
                      0,
                      5 - messages.filter((msg) => msg.isUser).length
                    )}{" "}
                    more for feedback
                  </span>
                )}
              </span>
            </div>*/}
            {/* Progress bar */}
            {!existingFeedback && (
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    width: `${Math.min(
                      100,
                      (messages.filter((msg) => msg.isUser).length / 5) * 100
                    )}%`,
                  }}
                />
              </div>
            )}

            {!existingFeedback && (
              <span className="text-xs text-muted-foreground">
                {Math.max(0, 5 - messages.filter((msg) => msg.isUser).length)}{" "}
                messages left
              </span>
            )}
          </div>
        </div>
      )}

      {/* Wrapper to center content if left column hidden */}
      <div
        className={`flex flex-1 overflow-y-auto pr-2 ${
          !isLeftColumnVisible ? "justify-center " : ""
        }`}
      >
        <div className={`w-full ${!isLeftColumnVisible ? "max-w-[60vw]" : ""}`}>
          {messages.length === 0 && (
            <div className="flex flex-col justify-center items-center px-8 py-4">
              {/* Centered content container */}
              <div className="text-center p-2 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                {/* Icon container with Apple's "frosted glass" or "glassmorphism" effect */}
                <div className="inline-block p-4 sm:p-5 mb-2 sm:mb-6">
                  <MessageCircle className="text-muted-foreground h-18 w-18 sm:h-20 sm:w-20" />
                </div>
                {/* Title with a vibrant gradient for emphasis */}
                <h1 className="text-2xl sm:text-5xl font-semibold mb-2 sm:mb-4 tracking-tight bg-gradient-to-br from-primary to-purple-400 bg-clip-text text-transparent">
                  Learn with AI Padhai
                </h1>

                {/* Subtitle with a softer, off-white color for readability */}
                <p className="text-muted-foreground text-sm sm:text-lg max-w-md mx-auto leading-relaxed">
                  Your smart companion for personalized learning and interactive
                  discussions.
                </p>
              </div>
            </div>
          )}
          {messages.length > 0 && (
            <>
              <MessageList messages={messages} isLoading={isLoading} />
            </>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="w-fit text-red-400 text-sm bg-red-900/20 border border-red-600/30 rounded-lg px-4 py-3 justify-center">
                {error}
              </div>
            </div>
          )}

          {/* Show feedback status if feedback has been submitted */}
          {existingFeedback && (
            <div className="mt-4 flex justify-center">
              <div className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 text-gray-300 flex items-center gap-2">
                <span>✓ Chat feedback submitted</span>
                {existingFeedback.rating && (
                  <span className="text-yellow-400">
                    {existingFeedback.rating}/5 stars
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ChatInput
        textAreaRef={textAreaRef}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        isLeftColumnVisible={isLeftColumnVisible}
      />

      {/* Feedback Modal */}
      <VideoFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleFeedbackClose}
        videoId={videoId}
        videoTitle={"AI Chat"}
        playPercentage={100}
        onSubmit={handleFeedbackSubmit}
        onSkip={handleFeedbackSkip}
        onDismiss={handleFeedbackDismiss}
        canSubmitFeedback={canSubmitFeedback}
        existingFeedback={existingFeedback}
        markAsSubmitted={markAsSubmitted}
        componentName="Chat"
      />
    </div>
  );
}
