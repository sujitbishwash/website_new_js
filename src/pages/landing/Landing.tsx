import "./Landing.css";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import aipadhailogo from "@/assets/images/ai_padhai_logo.svg";
import aipadhailogowhite from "@/assets/images/ai_padhai_logo_white.svg";
import { Icon } from "@/components/landing/Icon";
import { ICONS } from "@/components/landing/icons";
import { Linkedin } from "lucide-react";
import ScrollToTop from "@/components/landing/scrollToTop";
import { ROUTES } from "@/routes/constants";

// Type alias for theme
type Theme = "light" | "dark";

// Props interface for the Header component
interface HeaderProps {
  toggleTheme: () => void;
  theme: Theme;
}

window.addEventListener("error", (e) => console.warn("GLOBAL ERROR", e.error));
//{ name: "Blog", path: "/blog" },
// Header Component
const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { name: "Home", path: ROUTES.HOME },
    { name: "Features", path: ROUTES.FEATURES },

    { name: "Contact", path: ROUTES.CONTACT },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl text-zinc-800 py-3 px-4 sm:px-8 md:px-16 border-b border-zinc-400/50 transition-colors duration-300 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-x-16">
          <div className="flex items-center gap-2">
            <img src={aipadhailogo} className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-white">AI Padhai</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden md:flex items-center space-x-6 text-md font-medium text-zinc-100 pr-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-white/90 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          {/*<button className="hover:cursor-pointer hidden md:block text-sm font-bold py-2 px-6 rounded-full transition-all shadow-md text-white bg-gradient-to-br from-blue-500/70 via-blue-600/50 to-indigo-700/70 backdrop-blur-lg border border-blue-400/50 hover:border-blue-400/80 hover:from-blue-500/80 hover:via-blue-600/60 hover:to-indigo-700/80">
            Login
          </button>*/}
          <Link
            className="hover:cursor-pointer hidden md:block text-sm font-semibold py-2 px-6 rounded-full transition-all shadow-md text-white bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-white/20 dark:via-white/10 dark:to-transparent backdrop-blur-lg border border-white/30 dark:border-white/20 hover:border-white/50 dark:hover:border-white/30"
             to={ROUTES.LOGIN}
          >
            Sign In
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-200"
          >
            <Icon
              path={isMenuOpen ? ICONS.close : ICONS.menu}
              className="w-6 h-6 text-white"
            />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 z-50 w-full bg-black backdrop-blur-2xl shadow-lg text-zinc-800 px-4 sm:px-8 md:px-16 border-b border-zinc-400/50 transition-colors duration-300">
          <nav className="container mx-auto flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg text-gray-300 hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

// Footer Component
const Footer = () => {
  const markdownContent = `
# Prepare for government exams smarter, not harder—with YouTube and AI.

## Your favorite teachers, your learning journey—enhanced by AI.

With AI-driven recommendations based on your learning journey, you will always know what to study next. From practice questions to curated videos and notes, everything is tailored to your goals so you can focus on mastering the syllabus.

**It just works. See it in action.**

**Simply paste the YouTube links and watch the magic unfold.**

Our smart agent finds you questions, recommends the right videos, builds flashcards, summarizes lessons, and chats with you to deepen your understanding.

### Key Features

* **Understand Concepts:** Learn from unlimited YouTube videos and chats. AI Padhai helps you like a true friend. It gives you questions to practice, creates personalized notes, suggests the best videos and books, and keeps you on track.
* **Detailed Analysis:** It highlights mistakes, strengths, and weaknesses based on your activity.
* **Do More with Less Hard Work:** Achieve your goals faster through strategic preparation and regular feedback.

---

## Frequently Asked Questions (FAQ)

1. **What exactly is AI Padhai?**  
   AI Padhai is your AI study companion that connects your videos, notes, books, and mocks into one clear learning journey.

2. **How is this different from other EdTech apps?**  
   Most apps overload you with content. This one studies your habits and builds a plan designed for you.

3. **Which exams can I prepare for?**  
   SSC, Banking, Railways, and Class 10 Boards. UPSC, CAT, and others are coming.

4. **How does the AI know what is right for me?**  
   It learns from your daily activity and adjusts your roadmap automatically.

5. **Can I use my own notes or YouTube videos?**  
   Yes. Upload notes or paste links and the AI will summarize and create practice questions.

6. **Is my data safe?**  
   Yes. Your data stays private and encrypted.

7. **Is it free?**  
   You can start for free. Premium unlocks deeper analytics.

8. **Will this replace coaching or self-study?**  
   No. It supports both by giving structure and filling gaps.

9. **Can I use it on my phone?**  
   Yes. It works on web and mobile with synced progress.

10. **How do I begin?**  
   Sign up, choose your exam, and add videos or notes. The AI builds your dashboard in seconds.
`;

  const openLLMtxt = () => {
    const newTab = window.open();

    if (!newTab) {
      console.error("Popup blocked. Enable popups for this site.");
      return;
    }

    newTab.document.write(`<pre>${markdownContent}</pre>`);
    newTab.document.close();
  };
  return (
    <footer className="relative bg-blue-900 text-white py-12 px-4 sm:px-8">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-1 text-left">
          <div className="flex items-center gap-2">
            <img src={aipadhailogowhite} className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-white dark:text-white">
              AI Padhai
            </h2>
          </div>
        </div>
        <div className="text-left">
          <h3 className="text-zinc-300 mb-4 uppercase text-sm font-semibold tracking-wider">
            Product
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to={ROUTES.FEATURES}
                className="hover:text-blue-200 dark:hover:text-white"
              >
                Features
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-left">
          <h3 className="text-zinc-300 mb-4 uppercase text-sm font-semibold tracking-wider">
            Company
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to={ROUTES.CONTACT}
                className="hover:text-blue-200 dark:hover:text-white"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-left">
          <h3 className="text-zinc-300 mb-4 uppercase text-sm font-semibold tracking-wider">
            Legal
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to={ROUTES.PRIVACY}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-200 dark:hover:text-white"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.TERMS}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-200 dark:hover:text-white"
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-left">
          <h3 className="text-zinc-300 mb-4 uppercase text-sm font-semibold tracking-wider">
            Community
          </h3>
          <div className="flex space-x-4">
            {/*<a href="#" className="hover:text-blue-200 dark:hover:text-white">
              <Facebook />
            </a>*/}
            <a href="#" className="hover:text-blue-200 dark:hover:text-white">
              <Linkedin />
            </a>
            {/*<a href="#" className="hover:text-blue-200 dark:hover:text-white">
              <Instagram />
            </a>
            <a href="#" className="hover:text-blue-200 dark:hover:text-white">
              <Twitter />
            </a>*/}
          </div>
          <button
            onClick={openLLMtxt}
            className="hover:cursor-pointer mt-4 rounded-full hover:text-blue-200 transition"
          >
            LLM.txt
          </button>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-white/10 dark:border-zinc-800 text-center">
        <p className="text-sm">&copy; 2025 AI Padhai. All rights reserved.</p>
      </div>
    </footer>
  );
};

function Landing() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light"; // Default theme for server-side rendering
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <>
      <ScrollToTop /> {/* ✅ Always scrolls on route change */}
      <div className="bg-black">
        <Header toggleTheme={toggleTheme} theme={theme} />
        <Outlet />

        <Footer />
      </div>
    </>
  );
}

export default Landing;
