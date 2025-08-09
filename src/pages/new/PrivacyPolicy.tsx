import React from "react";

// Define the structure for a single policy section
interface PolicySectionData {
  id: string;
  title: string;
  content: React.ReactNode[];
}

// Data for the privacy policy, structured for dynamic rendering.
// This makes it easy to add, remove, or edit sections without changing the component logic.
const privacyPolicyData: PolicySectionData[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: [
      'Welcome to Ai Padhai ("we," "us," "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application (the "App"). Our App uses the YouTube API to display video content and leverages artificial intelligence, including Large Language Models (LLMs), to generate educational questions and materials from that content.',
      "Please read this Privacy Policy carefully. By using our App, you agree to the collection and use of information in accordance with this policy.",
    ],
  },
  {
    id: "information_collection",
    title: "2. Information We Collect",
    content: [
      "We may collect information about you in a variety of ways. The information we may collect via the App includes:",
      <h3
        key="personal-data-title"
        className="text-lg font-semibold text-white mt-4 mb-2"
      >
        a) Personal Data:
      </h3>,
      "Personally identifiable information, such as your name, email address, and age or grade level, that you voluntarily give to us when you register for the App.",
      <h3
        key="usage-data-title"
        className="text-lg font-semibold text-white mt-4 mb-2"
      >
        b) Usage Data:
      </h3>,
      "Information our servers automatically collect when you access the App, such as:",
      <ul
        key="usage-data-list"
        className="list-disc list-inside space-y-1 pl-4"
      >
        <li>The videos you watch.</li>
        <li>The questions you answer and your performance on them.</li>
        <li>Your progress and time spent within the App.</li>
        <li>Your device type, operating system, and IP address.</li>
      </ul>,
      <h3
        key="third-party-data-title"
        className="text-lg font-semibold text-white mt-4 mb-2"
      >
        c) Data from Third Parties:
      </h3>,
      "Our App uses the YouTube API to provide video content. When you view content from YouTube through our App, you are subject to the Google Privacy Policy. We do not receive personal account information from your Google or YouTube account.",
    ],
  },
  {
    id: "how_we_use",
    title: "3. How We Use Your Information",
    content: [
      "Having accurate information permits us to provide you with a smooth, efficient, and customized educational experience. Specifically, we use the information collected about you to:",
      <ul
        key="use-info-list"
        className="list-disc list-inside space-y-2 mt-2 pl-4"
      >
        <li>Create and manage your account.</li>
        <li>
          Personalize your learning experience and track your educational
          progress.
        </li>
        <li>
          Generate relevant questions and learning materials from video content.
        </li>
        <li>
          <strong>Improve Our Product:</strong> We analyze user interaction and
          data internally to improve the App\'s functionality, features, and
          artificial intelligence models. This analysis is conducted exclusively
          by our internal team.
        </li>
        <li>
          <strong>Internal AI Model Testing:</strong> We may use the content you
          interact with (like video topics or your answers) as data to test and
          refine the AI and LLM systems that power our question-generation
          features. This is for internal development purposes only.
        </li>
        <li>
          Communicate with you regarding your account or to provide support.
        </li>
      </ul>,
    ],
  },
  {
    id: "how_we_share",
    title: "4. How We Share Your Information",
    content: [
      "Your privacy is our priority. Our data sharing practices are very limited.",
      <h3
        key="no-sell-title"
        className="text-lg font-semibold text-white mt-4 mb-2"
      >
        We will never sell your personal data.
      </h3>,
      "We do not sell, trade, or rent your personal information to any third party for marketing or any other purpose.",
      <h3
        key="providers-title"
        className="text-lg font-semibold text-white mt-4 mb-2"
      >
        Third-Party Service Providers:
      </h3>,
      "We may share your information with third-party vendors and service providers who perform services for us or on our behalf. This is limited to:",
      <ul
        key="providers-list"
        className="list-disc list-inside space-y-2 mt-2 pl-4"
      >
        <li>
          <strong>Large Language Model (LLM) Providers:</strong> To provide the
          core functionality of our App, we send data (such as the transcript or
          topic of a video) to our LLM providers to generate questions. This is
          for processing and internal testing only. We take steps to anonymize
          this data where possible and ensure our agreements with these
          providers uphold strict confidentiality and security standards. They
          are not permitted to use your data for their own purposes or to train
          their general models on your data.
        </li>
        <li>
          <strong>Cloud Hosting Providers:</strong> To securely store your data.
        </li>
      </ul>,
      <h3
        key="law-title"
        className="text-lg font-semibold text-white mt-4 mb-2"
      >
        By Law or to Protect Rights:
      </h3>,
      "We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend our rights or property, or protect the personal safety of users or the public.",
    ],
  },
  {
    id: "data_security",
    title: "5. Data Security",
    content: [
      "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.",
    ],
  },
  {
    id: "children_privacy",
    title: "6. Children's Privacy",
    content: [
      "Protecting the privacy of young children is especially important. Our App is not directed to children under the age of 13 (or the relevant age in your jurisdiction), and we do not knowingly collect personal information from them without obtaining parental consent. If we learn that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove that information.",
    ],
  },
  {
    id: "data_rights",
    title: "7. Your Data Rights",
    content: [
      "You have the right to:",
      <ul
        key="rights-list"
        className="list-disc list-inside space-y-2 mt-2 pl-4"
      >
        <li>
          <strong>Access:</strong> Request a copy of the personal data we hold
          about you.
        </li>
        <li>
          <strong>Correction:</strong> Request that we correct any inaccurate or
          incomplete data.
        </li>
        <li>
          <strong>Deletion:</strong> Request that we delete your account and
          associated personal data.
        </li>
      </ul>,
      "To exercise these rights, please contact us at the email address below.",
    ],
  },
  {
    id: "policy_changes",
    title: "8. Changes to This Privacy Policy",
    content: [
      'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. We encourage you to review this Privacy Policy periodically for any changes.',
    ],
  },
];

// --- Reusable Components ---

// Component for a single section of the policy
// It takes a title and content as props and styles them.
const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-8">
    <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-4 pb-2 border-b border-gray-700">
      {title}
    </h2>
    <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed">
      {children}
    </div>
  </div>
);

// Component for the header of the page
const PolicyHeader: React.FC = () => (
  <div className="text-center mb-10">
    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
      Privacy Policy for Ai Padhai
    </h1>
    <p className="text-gray-400 text-lg">Effective Date: August 8, 2025</p>
  </div>
);

// Component for the contact information at the end
const ContactInfo: React.FC = () => (
  <div className="mt-12 p-6 bg-gray-800 rounded-lg border border-gray-700 text-center">
    <h2 className="text-2xl font-bold text-white mb-3">9. Contact Us</h2>
    <p className="text-gray-300 mb-4">
      If you have any questions or concerns about this Privacy Policy, please
      contact us at:
    </p>
    <p className="font-semibold text-white">Ai Padhai</p>
    <a
      href="mailto:support@aipadhai.com"
      className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
    >
      support@aipadhai.com
    </a>
  </div>
);

// --- Main App Component ---
// This is the root component that assembles the entire page.
export default function PrivacyPolicy() {
  /*
    Color Palette Mapping:
    - background: "#111827" -> bg-gray-900
    - cardBackground: "#1F2937" -> bg-gray-800
    - inputBackground: "#374151" -> bg-gray-700
    - primaryText: "#FFFFFF" -> text-white
    - secondaryText: "#9CA3AF" -> text-gray-400
    - mutedText: "#6B7280" -> text-gray-500
    - accent: "#60A5FA" -> text-blue-400
    - divider: "#4B5563" -> border-gray-700
  */
  return (
    <div className="min-h-screen bg-gray-900 font-sans text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <PolicyHeader />

        {/* Map over the data array to dynamically render each policy section */}
        {privacyPolicyData.map((section) => (
          <PolicySection key={section.id} title={section.title}>
            {section.content.map((paragraph, index) =>
              // Check if the content is a string or a JSX element
              typeof paragraph === "string" ? (
                <p key={index}>{paragraph}</p>
              ) : (
                paragraph
              )
            )}
          </PolicySection>
        ))}

        <ContactInfo />
      </div>
    </div>
  );
}
