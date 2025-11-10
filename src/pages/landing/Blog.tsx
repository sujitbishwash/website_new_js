import React, { useState } from "react";
import { Image } from "lucide-react";

// --- TYPE DEFINITIONS ---

interface BlogPost {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
  category: string;
}

interface BlogCardProps {
  post: BlogPost;
}

// --- MOCK DATA ---

const categories = [
  "All",
  "PO",
  "Clerk",
  "SSC",
  "Railways",
  "NTPC",
  "Class 10",
];

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "AI Strategies for IBPS PO Success",
    date: "1 day ago",
    imageUrl: "https://placehold.co/600x400/1a202c/9ca3af?text=AI+Strategies",
    category: "PO",
  },
  {
    id: 2,
    title: "Mastering Clerk Exams with AI Tools",
    date: "3 days ago",
    imageUrl: "https://placehold.co/600x400/1a202c/9ca3af?text=AI+Tools",
    category: "Clerk",
  },
  {
    id: 3,
    title: "Crack SSC CGL with Personalized AI Plans",
    date: "7 days ago",
    imageUrl:
      "https://placehold.co/600x400/1a202c/9ca3af?text=Personalized+Plans",
    category: "SSC",
  },
  {
    id: 4,
    title: "AI-Powered Preparation for Railway Exams",
    date: "5 days ago",
    imageUrl: "https://placehold.co/600x400/1a202c/9ca3af?text=Railway+Prep",
    category: "Railways",
  },
  {
    id: 5,
    title: "NTPC Exam Prep: Leverage AI Insights",
    date: "1 month ago",
    imageUrl: "https://placehold.co/600x400/1a202c/9ca3af?text=AI+Insights",
    category: "NTPC",
  },
  {
    id: 6,
    title: "Boost Your Class 10 Scores with AI Tutors",
    date: "6 days ago",
    imageUrl: "https://placehold.co/600x400/1a202c/9ca3af?text=AI+Tutors",
    category: "Class 10",
  },
  {
    id: 7,
    title: "Advanced Quant Techniques for PO Mains",
    date: "4 days ago",
    imageUrl:
      "https://placehold.co/600x400/1a202c/9ca3af?text=Quant+Techniques",
    category: "PO",
  },
  {
    id: 8,
    title: "Reasoning Shortcuts for SSC CHSL",
    date: "10 days ago",
    imageUrl:
      "https://placehold.co/600x400/1a202c/9ca3af?text=Reasoning+Shortcuts",
    category: "SSC",
  },
];

// --- SVG ICONS ---

// --- COMPONENTS ---

/**
 * Blog Card Component
 */
const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="group hover:cursor-pointer text-left bg-white/5 rounded-4xl border border-white/10 shadow-lg overflow-hidden transition-all duration-300">
      <div className="aspect-video bg-white/5 flex items-center justify-center overflow-hidden">
        <Image
          className="text-gray-400 text-sm w-8 h-8 transition-transform duration-300 group-hover:scale-115"
        />
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-semibold text-white mb-2">{post.title}</h3>
        <p className="text-gray-500 text-sm">{post.date}</p>
      </div>
    </div>
  );
};


/**
 * Main App Component
 */
const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Page Title Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">AI Padhai Blog</h1>
          <p className="text-xl text-blue-100">
            Insights & Strategies Powered by AI
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="pt-12 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`hover:cursor-pointer px-4 py-3 rounded-full text-md font-medium transition-colors duration-150 
                ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : " bg-white/5 text-gray-300 hover:text-white border border-white/10 hover:border-white/30"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Blog;
