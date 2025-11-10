import React, { useState } from "react";
import { Mail, Phone, MapPin, Copy, Check } from "lucide-react";

// Since this is a single file, we define all components here.

// --- Reusable Info Block Component ---
interface InfoBlockProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  copyText?: string; // Added optional prop for text to copy
}

const InfoBlock: React.FC<InfoBlockProps> = ({
  icon,
  title,
  children,
  copyText,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  // Handle copying text to clipboard
  const handleCopy = (text: string) => {
    // Use document.execCommand('copy') for compatibility in restricted environments (like iFrames)
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px"; // Hide the element
    document.body.appendChild(textArea);

    textArea.select();

    try {
      document.execCommand("copy");
      setIsCopied(true);
      // Reset the "copied" state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }

    document.body.removeChild(textArea);
  };
  return (
    <div className="flex items-center space-x-4 rounded-lg bg-white/5 border border-white/10 p-6 justify-between">
      <div className="flex gap-4">
        <div className="flex-shrink-0 text-blue-500">{icon}</div>
          <div className="text-xl text-gray-400">{children}</div>
      </div>
      {/* Right side: Copy Button (conditional) */}
      {copyText && (
        <button
          onClick={() => handleCopy(copyText)}
          className={`hover:cursor-pointer flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
            isCopied
              ? " text-white" // Feedback state
              : " text-gray-300  hover:bg-white/5" // Default state
          }`}
          aria-label={isCopied ? "Copied" : `Copy ${title}`}
        >
          {isCopied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

// --- Contact Form Component ---
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="text-left">
      <h2 className="text-3xl text-blue-400 mb-6">
        Send Us a Message
      </h2>
      <form
        className="space-y-6"
        action="https://formsubmit.co/support@aipadhai.com"
        method="POST"
      >
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="table" />
        <input
          type="hidden"
          name="_next"
          value="https://aipadhai.com/thank-you"
        />
        <input type="hidden" name="_subject" value="New Contact Form Message" />

        <div>
          <label
            htmlFor="name"
            className="block text-md font-medium text-gray-400 mb-2"
          >
            Your Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="eg, Sunaina Sharma"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white/5 text-lg border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-md font-medium text-gray-400 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="eg, sunaina@abc.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-white/5 text-lg border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-md font-medium text-gray-400 mb-2"
          >
            Your Message
          </label>
          <textarea
            name="message"
            id="message"
            rows={3}
            placeholder="eg, purpose of contact"
            value={formData.message}
            onChange={handleChange}
            maxLength={70}
            minLength={5}
            required
            className="resize-none w-full bg-white/5 text-lg border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
          <div className="text-gray-500 text-right text-sm">
            {formData.message.length}/70
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="hover:cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Contact Info Component ---
const ContactInfo: React.FC = () => {
  return (
    <div className="text-left">
      <h2 className="text-3xl text-blue-400 mb-6">
        Other Ways to Reach Us
      </h2>
      <div className="space-y-8">
        <InfoBlock
          icon={<Mail className="w-6 h-6" />}
          title="Email"
          copyText="support@aipadhai.com"
        >
          <p>support@aipadhai.com</p>
        </InfoBlock>
        <InfoBlock
          icon={<Phone className="w-6 h-6" />}
          title="Phone"
          copyText="+91 733 038 5497"
        >
          <p>+91 733 038 5497</p>
        </InfoBlock>
        <InfoBlock
          icon={<MapPin className="w-6 h-6" />}
          title="Address"
          copyText="Bengaluru, Karnataka, India"
        >
          <p>Bengaluru, Karnataka, India</p>
        </InfoBlock>
      </div>
    </div>
  );
};

// --- Main App Component ---
const Contact: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black font-sans">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8">Contact Us</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              We'd love to hear from you! Reach out with any questions or
              feedback.
            </p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="bg-black text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
