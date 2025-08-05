import {
  BookOpen,
  Bot,
  BrainCircuit,
  FileText,
  Lightbulb,
  Loader,
  Send,
  Sparkles,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Type definitions
interface ChatMessage {
  type: "user" | "bot" | "summary" | "flashcards" | "suggestions";
  role: "user" | "bot";
  text?: string;
  content?: string | any[];
}

interface BookSuggestionCardProps {
  title: string;
  author: string;
  description: string;
  coverColor: string;
  onSelect: () => void;
}

interface ChatMessageProps {
  message: ChatMessage;
}

interface FlashcardGroupProps {
  cards: Array<{ term: string; definition: string }>;
}

interface SuggestionsGroupProps {
  suggestions: string[];
}

interface ToolButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  disabled: boolean;
}

interface BookModalProps {
  text: string;
  bookName?: string;
  onClose: () => void;
}

interface QuizModalProps {
  questions: Array<{
    question: string;
    options: string[];
    answer: string;
  }>;
  onClose: () => void;
}

// Extend Window interface for PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

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

// --- MAIN APP COMPONENT ---
const BookPage: React.FC = () => {
  // Core State
  const [book, setBook] = useState<File | null>(null);
  const [bookText, setBookText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // For PDF processing
  const [isLoading, setIsLoading] = useState(false); // For API calls
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"upload" | "chat">("upload"); // 'upload' or 'chat'
  const [isPdfJsReady, setIsPdfJsReady] = useState(false);

  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Modal States
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    question: string;
    options: string[];
    answer: string;
  }> | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Scroll to bottom of chat on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Setup PDF.js worker and check for library readiness
  useEffect(() => {
    const checkPdfJs = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://mozilla.github.io/pdf.js/build/pdf.worker.js`;
        setIsPdfJsReady(true);
        clearInterval(pdfJsInterval); // Stop checking once it's found
      }
    };

    const pdfJsInterval = setInterval(checkPdfJs, 500); // Check every 500ms

    // Cleanup interval on component unmount
    return () => clearInterval(pdfJsInterval);
  }, []);

  // --- FILE HANDLING ---
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setBook(file);
      setBookText("");
      setChatHistory([]);
      setError(null);
      setIsProcessing(true);
      setCurrentView("chat"); // Go to chat view immediately
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = e.target?.result;
          if (result instanceof ArrayBuffer) {
            const typedarray = new Uint8Array(result);
            const pdf = await window.pdfjsLib.getDocument({ data: typedarray })
              .promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              fullText +=
                textContent.items.map((item: any) => item.str).join(" ") + "\n";
            }
            setBookText(fullText);
            setChatHistory([
              {
                type: "bot",
                role: "bot",
                text: `Great! I've finished reading "${file.name}". What would you like to do first?`,
              },
            ]);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        console.error("Error processing PDF:", err);
        setError(
          "Sorry, I had trouble reading that PDF. Please try another file."
        );
        setBook(null);
        setCurrentView("upload"); // Go back to upload view on error
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // --- API & CHAT LOGIC ---
  const handleApiCall = async (prompt: string, type: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      };
      const apiKey = ""; // Handled by environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API request failed.`);

      const result = await response.json();
      const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseText) {
        let newBotMessage: ChatMessage;
        // Create a message object based on the tool used
        switch (type) {
          case "summary":
            newBotMessage = {
              type: "summary",
              role: "bot",
              content: responseText,
            };
            break;
          case "flashcards":
            newBotMessage = {
              type: "flashcards",
              role: "bot",
              content: JSON.parse(responseText).cards || [],
            };
            break;
          case "suggestions":
            newBotMessage = {
              type: "suggestions",
              role: "bot",
              content: JSON.parse(responseText).suggestions || [],
            };
            break;
          case "quiz":
            // Open quiz modal instead of adding to chat history
            setQuizQuestions(JSON.parse(responseText).quiz || []);
            return; // Exit early
          case "chat":
          default:
            newBotMessage = { type: "bot", role: "bot", text: responseText };
            break;
        }
        setChatHistory((prev) => [...prev, newBotMessage]);
      } else {
        throw new Error("No content in API response.");
      }
    } catch (err) {
      console.error(`Error with ${type}:`, err);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          role: "bot",
          text: "Sorry, I ran into an issue. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || !bookText) return;
    setChatHistory((prev) => [
      ...prev,
      { type: "user", role: "user", text: userInput },
    ]);
    const prompt = `Based on the book content provided below, answer the user's question.
        --- BOOK CONTENT ---
        ${bookText.substring(0, 15000)}
        --- END BOOK CONTENT ---
        Question: "${userInput}"`;
    handleApiCall(prompt, "chat");
    setUserInput("");
  };

  const handleToolClick = (tool: string) => {
    if (!bookText) return;
    let prompt = "";
    switch (tool) {
      case "summary":
        prompt = `Summarize the key points of the following text in a few clear paragraphs.
                --- TEXT ---
                ${bookText.substring(0, 30000)}
                --- END TEXT ---`;
        setChatHistory((prev) => [
          ...prev,
          {
            type: "user",
            role: "user",
            text: "Can you summarize this for me?",
          },
        ]);
        handleApiCall(prompt, "summary");
        break;
      case "flashcards":
        prompt = `Create a list of 5 key concepts from the following text to be used as flashcards. Respond with ONLY a JSON object with a single key "cards", which is an array of objects, each with a "term" and a "definition".
                --- TEXT ---
                ${bookText.substring(0, 20000)}
                --- END TEXT ---`;
        setChatHistory((prev) => [
          ...prev,
          { type: "user", role: "user", text: "Make some flashcards for me." },
        ]);
        handleApiCall(prompt, "flashcards");
        break;
      case "suggestions":
        prompt = `Analyze the following text and provide 3 actionable study suggestions for a student. Respond with ONLY a JSON object with a single key "suggestions", which is an array of 3 strings.
                --- TEXT ---
                ${bookText.substring(0, 20000)}
                --- END TEXT ---`;
        setChatHistory((prev) => [
          ...prev,
          {
            type: "user",
            role: "user",
            text: "Can you give me some study suggestions?",
          },
        ]);
        handleApiCall(prompt, "suggestions");
        break;
      case "quiz":
        prompt = `Create a multiple-choice quiz with 5 questions based on the following text. Respond with ONLY a JSON object with a single key "quiz", which is an array of objects. Each object must have "question" (string), "options" (array of 4 strings), and "answer" (string).
                --- TEXT ---
                ${bookText.substring(0, 25000)}
                --- END TEXT ---`;
        setChatHistory((prev) => [
          ...prev,
          { type: "user", role: "user", text: "Let's do a quick quiz." },
        ]);
        handleApiCall(prompt, "quiz");
        break;
      default:
        break;
    }
  };

  // --- RENDER COMPONENTS ---
  const BookSuggestionCard: React.FC<BookSuggestionCardProps> = ({
    title,
    author,
    description,
    coverColor,
    onSelect,
  }) => (
    <div
      className="rounded-lg shadow-md p-4 border-t-4 cursor-pointer hover:shadow-xl transition-shadow"
      style={{
        backgroundColor: theme.cardBackground,
        borderTopColor: coverColor,
      }}
      onClick={onSelect}
    >
      <h3 className="font-bold" style={{ color: theme.primaryText }}>
        {title}
      </h3>
      <p className="text-sm mb-2" style={{ color: theme.secondaryText }}>
        {author}
      </p>
      <p className="text-sm" style={{ color: theme.secondaryText }}>
        {description}
      </p>
    </div>
  );

  const UploadView: React.FC = () => (
    <div className="text-center p-8">
      <Sparkles
        className="mx-auto h-16 w-16 mb-4"
        style={{ color: theme.accent }}
      />
      <h2
        className="text-3xl font-bold mb-2"
        style={{ color: theme.primaryText }}
      >
        AI Study Buddy
      </h2>
      <p className="mb-8" style={{ color: theme.secondaryText }}>
        Upload a PDF to get started.
      </p>
      <div
        className="relative border-2 border-dashed rounded-lg p-10 text-center hover:border-indigo-500 transition-colors max-w-lg mx-auto"
        style={{ borderColor: theme.divider }}
      >
        <UploadCloud
          className="mx-auto h-12 w-12"
          style={{ color: theme.mutedText }}
        />
        <p className="mt-4 text-sm" style={{ color: theme.secondaryText }}>
          {isPdfJsReady
            ? "Drag & drop a PDF here, or click to select"
            : "Initializing PDF reader..."}
        </p>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept=".pdf"
          disabled={isProcessing || !isPdfJsReady}
        />
      </div>
      {isProcessing && (
        <div
          className="mt-4 flex items-center justify-center space-x-2"
          style={{ color: theme.accent }}
        >
          <Loader className="animate-spin h-5 w-5" />
          <span>Reading your book...</span>
        </div>
      )}
      {error && <div className="mt-4 text-red-500">{error}</div>}

      <button
        onClick={() => setCurrentView("chat")}
        className="mt-6 text-sm hover:underline"
        style={{ color: theme.accent }}
      >
        Continue to demo without uploading
      </button>

      <div className="mt-12 max-w-4xl mx-auto">
        <h3
          className="text-xl font-semibold mb-4"
          style={{ color: theme.primaryText }}
        >
          Or start with a classic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BookSuggestionCard
            title="Pride and Prejudice"
            author="Jane Austen"
            description="A classic romance novel exploring themes of love, class, and social expectations in 19th-century England."
            coverColor="#e53e3e"
            onSelect={() => setCurrentView("chat")}
          />
          <BookSuggestionCard
            title="1984"
            author="George Orwell"
            description="A dystopian novel about a totalitarian society where Big Brother is always watching."
            coverColor="#3b82f6"
            onSelect={() => setCurrentView("chat")}
          />
          <BookSuggestionCard
            title="The Great Gatsby"
            author="F. Scott Fitzgerald"
            description="A story of wealth, love, and the American Dream set in the Roaring Twenties."
            coverColor="#10b981"
            onSelect={() => setCurrentView("chat")}
          />
        </div>
      </div>
    </div>
  );

  const ChatView: React.FC = () => (
    <div
      className="w-full h-full flex flex-col rounded-lg shadow-lg"
      style={{ backgroundColor: theme.cardBackground }}
    >
      {/* Chat History */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-6 space-y-6 overflow-y-auto"
      >
        {!bookText && (
          <div
            className="text-center p-8 h-full flex flex-col justify-center items-center"
            style={{ color: theme.secondaryText }}
          >
            <BookOpen size={48} className="mx-auto mb-4" />
            <h3
              className="font-semibold text-lg"
              style={{ color: theme.primaryText }}
            >
              Welcome to the Demo!
            </h3>
            <p>Upload a book to activate the AI tools.</p>
            <button
              onClick={() => setCurrentView("upload")}
              className="mt-4 px-4 py-2 rounded-lg shadow"
              style={{
                background: `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
                color: theme.primaryText,
              }}
            >
              Upload a Book
            </button>
          </div>
        )}
        {chatHistory.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <BotIcon />
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: theme.inputBackground }}
            >
              <Loader
                className="animate-spin h-5 w-5"
                style={{ color: theme.accent }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tools & Input */}
      <div
        className="p-4 border-t"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.divider,
        }}
      >
        <div className="flex justify-center gap-2 mb-3">
          <ToolButton
            onClick={() => handleToolClick("summary")}
            icon={FileText}
            label="Summarize"
            disabled={!bookText || isLoading}
          />
          <ToolButton
            onClick={() => handleToolClick("flashcards")}
            icon={Lightbulb}
            label="Flashcards"
            disabled={!bookText || isLoading}
          />
          <ToolButton
            onClick={() => handleToolClick("suggestions")}
            icon={Sparkles}
            label="Suggestions"
            disabled={!bookText || isLoading}
          />
          <ToolButton
            onClick={() => handleToolClick("quiz")}
            icon={BrainCircuit}
            label="Quiz"
            disabled={!bookText || isLoading}
          />
          <ToolButton
            onClick={() => setIsBookModalOpen(true)}
            icon={BookOpen}
            label="Read Book"
            disabled={!bookText || isLoading}
          />
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 rounded-full border focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.inputBackground,
              borderColor: theme.divider,
              color: theme.primaryText,
            }}
            placeholder={
              bookText ? "Ask a question..." : "Upload a book to chat"
            }
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading || !bookText}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim() || !bookText}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-white disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col h-screen font-sans items-center justify-center p-4"
      style={{ backgroundColor: theme.background }}
    >
      {quizQuestions && (
        <QuizModal
          questions={quizQuestions}
          onClose={() => setQuizQuestions(null)}
        />
      )}
      {isBookModalOpen && (
        <BookModal
          text={bookText}
          bookName={book?.name}
          onClose={() => setIsBookModalOpen(false)}
        />
      )}
      <div className="w-full max-w-4xl h-full max-h-[95vh]">
        {currentView === "upload" ? <UploadView /> : <ChatView />}
      </div>
      <script src="//mozilla.github.io/pdf.js/build/pdf.js"></script>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, text, type, content } = message;
  const isUser = role === "user";

  const renderContent = () => {
    switch (type) {
      case "summary":
        return (
          <div
            className="p-4 rounded-lg whitespace-pre-wrap"
            style={{
              backgroundColor: theme.inputBackground,
              color: theme.secondaryText,
            }}
          >
            {content}
          </div>
        );
      case "flashcards":
        return (
          <FlashcardGroup
            cards={content as Array<{ term: string; definition: string }>}
          />
        );
      case "suggestions":
        return <SuggestionsGroup suggestions={content as string[]} />;
      default:
        return (
          <p className="text-sm" style={{ whiteSpace: "pre-wrap" }}>
            {text}
          </p>
        );
    }
  };

  return (
    <div
      className={`flex items-end gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <BotIcon />}
      <div
        className={`max-w-lg p-3 rounded-lg`}
        style={{
          backgroundColor: isUser ? theme.accent : theme.inputBackground,
          color: theme.primaryText,
          borderBottomRightRadius: isUser ? "0px" : "0.5rem",
          borderBottomLeftRadius: isUser ? "0.5rem" : "0px",
        }}
      >
        {renderContent()}
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};

const FlashcardGroup: React.FC<FlashcardGroupProps> = ({ cards }) => {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  return (
    <div className="space-y-3">
      <h4 className="font-bold" style={{ color: theme.primaryText }}>
        Here are your flashcards:
      </h4>
      {cards.map((card, index) => (
        <div
          key={index}
          className="p-3 border rounded-lg"
          style={{
            backgroundColor: "rgba(252, 211, 77, 0.1)",
            borderColor: "rgba(252, 211, 77, 0.3)",
          }}
        >
          <p className="font-semibold" style={{ color: "#FBBF24" }}>
            {card.term}
          </p>
          {flipped[index] ? (
            <p className="mt-1" style={{ color: "#FDE68A" }}>
              {card.definition}
            </p>
          ) : (
            <button
              onClick={() => setFlipped((prev) => ({ ...prev, [index]: true }))}
              className="text-sm font-semibold mt-1"
              style={{ color: theme.accent }}
            >
              Show Definition
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const SuggestionsGroup: React.FC<SuggestionsGroupProps> = ({ suggestions }) => {
  return (
    <div className="space-y-3">
      <h4 className="font-bold" style={{ color: theme.primaryText }}>
        Here are some study suggestions:
      </h4>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="flex items-start gap-2 p-3 border rounded-lg"
            style={{
              backgroundColor: "rgba(52, 211, 153, 0.1)",
              borderColor: "rgba(52, 211, 153, 0.3)",
              color: "#A7F3D0",
            }}
          >
            <Sparkles
              className="w-4 h-4 mt-1 flex-shrink-0"
              style={{ color: "#34D399" }}
            />
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ToolButton: React.FC<ToolButtonProps> = ({
  onClick,
  icon: Icon,
  label,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 flex items-center gap-2 text-sm font-semibold border rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    style={{
      backgroundColor: theme.inputBackground,
      color: theme.secondaryText,
      borderColor: theme.divider,
    }}
  >
    <Icon size={16} />
    {label}
  </button>
);

const BotIcon: React.FC = () => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
    style={{ backgroundColor: theme.accent }}
  >
    <Bot size={20} />
  </div>
);
const UserIcon: React.FC = () => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
    style={{
      backgroundColor: theme.inputBackground,
      color: theme.secondaryText,
    }}
  >
    <User size={20} />
  </div>
);

const BookModal: React.FC<BookModalProps> = ({ text, bookName, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div
      className="rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
      style={{ backgroundColor: theme.cardBackground }}
    >
      <div
        className="p-4 border-b flex justify-between items-center"
        style={{ borderColor: theme.divider }}
      >
        <h2
          className="text-xl font-bold truncate pr-4"
          style={{ color: theme.primaryText }}
        >
          {bookName || "Book Content"}
        </h2>
        <button onClick={onClose} style={{ color: theme.secondaryText }}>
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <pre
          className="whitespace-pre-wrap font-sans"
          style={{ color: theme.secondaryText }}
        >
          {text}
        </pre>
      </div>
    </div>
  </div>
);

const QuizModal: React.FC<QuizModalProps> = ({ questions, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (option: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = Object.keys(selectedAnswers).reduce((acc, index) => {
    return selectedAnswers[parseInt(index)] ===
      questions[parseInt(index)].answer
      ? acc + 1
      : acc;
  }, 0);

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div
          className="rounded-xl shadow-2xl p-8 max-w-lg w-full text-center"
          style={{ backgroundColor: theme.cardBackground }}
        >
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: theme.primaryText }}
          >
            Quiz Results
          </h2>
          <p
            className="text-5xl font-bold mb-4"
            style={{ color: theme.accent }}
          >
            {score} / {questions.length}
          </p>
          <p className="mb-6" style={{ color: theme.secondaryText }}>
            Great job! Keep reviewing to master the material.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 font-semibold rounded-lg shadow-md"
            style={{
              background: `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
              color: theme.primaryText,
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-xl shadow-2xl p-8 max-w-2xl w-full relative"
        style={{ backgroundColor: theme.cardBackground }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          style={{ color: theme.secondaryText }}
        >
          <X size={24} />
        </button>
        <div className="mb-4">
          <p className="text-sm" style={{ color: theme.mutedText }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <h3
            className="text-xl font-semibold mt-1"
            style={{ color: theme.primaryText }}
          >
            {currentQuestion.question}
          </h3>
        </div>
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all`}
              style={{
                color: theme.primaryText,
                borderColor:
                  selectedAnswers[currentQuestionIndex] === option
                    ? theme.accent
                    : theme.divider,
                backgroundColor:
                  selectedAnswers[currentQuestionIndex] === option
                    ? "rgba(96, 165, 250, 0.1)"
                    : "transparent",
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className="w-full px-6 py-3 font-semibold rounded-lg shadow-md disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, ${theme.buttonGradientFrom}, ${theme.buttonGradientTo})`,
            color: theme.primaryText,
          }}
        >
          {currentQuestionIndex < questions.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </button>
      </div>
    </div>
  );
};

export default BookPage;
