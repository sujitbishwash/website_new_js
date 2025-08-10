import React, { FC, useEffect } from "react";

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

// --- DATA ---
// The terms and conditions data, structured for dynamic rendering.
// This makes it easy to add, remove, or edit sections without changing the component logic.
const termsData = [
  {
    title: "1. Our Service",
    content:
      "AIPadhai is an educational technology platform that uses Artificial Intelligence (AI) to generate questions and educational content based on videos sourced from YouTube via the YouTube API Services. Our goal is to provide an interactive and effective learning experience.",
  },
  {
    title: "2. Use of YouTube Content",
    content: (
      <>
        Our Service utilizes the YouTube API to find and display educational
        videos. By using AIPadhai, you acknowledge and agree to be bound by
        YouTube's Terms of Service, which can be found at{" "}
        <a
          href="https://www.youtube.com/t/terms"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.accent }}
        >
          https://www.youtube.com/t/terms
        </a>
        . AIPadhai does not claim ownership of and is not responsible for the
        content of these third-party videos.
      </>
    ),
  },
  {
    title: "3. User Accounts",
    content:
      "To use certain features of the Service, you may be required to register for an account. You must provide accurate and complete information and keep your account information updated. You are responsible for safeguarding your password and for any activities or actions under your account.",
  },
  {
    title: "4. Data Collection and Usage",
    content: (
      <>
        Your privacy is important to us. We are committed to transparency in how
        we handle your data.
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "20px",
            marginTop: "1rem",
          }}
        >
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Internal Improvement:</strong> We collect data on how you
            use our Service, such as the questions you answer, your performance
            metrics, and general usage patterns. This data is crucial for our
            internal team to analyze, improve, and enhance the product,
            features, and overall user experience.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>AI Model Training & Testing:</strong> To improve the quality
            and accuracy of our AI-generated questions, we may use your data for
            internal testing and analysis. In some cases, this may involve
            sending data to third-party Large Language Models (LLMs) that power
            our features. This data is used strictly for internal research and
            development to refine our AI capabilities.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>No Sharing with Third Parties:</strong> We will not share
            your personally identifiable data with any third-party individuals,
            companies, or organizations for their marketing or promotional use.
            The only exception is the controlled use of data with LLM providers
            for the purpose of internal testing as described above.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>We Will Never Sell Your Data:</strong> We are committed to
            never selling your personal data to any third party under any
            circumstances.
          </li>
        </ul>
        For more detailed information, please review our Privacy Policy.
      </>
    ),
  },
  {
    title: "5. AI-Generated Content",
    content:
      "The questions and educational materials provided by our AI are generated automatically. While we strive for accuracy, we cannot guarantee that the AI-generated content will be free of errors or inaccuracies. The content is provided for educational and informational purposes only and should not be considered a substitute for professional academic advice.",
  },
  {
    title: "6. Prohibited Activities",
    content: (
      <>
        You agree not to engage in any of the following prohibited activities:
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "20px",
            marginTop: "1rem",
          }}
        >
          <li style={{ marginBottom: "0.5rem" }}>
            Copying, distributing, or disclosing any part of the Service in any
            medium.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Using the Service for any illegal or unauthorized purpose.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Attempting to interfere with, compromise the system integrity or
            security of, or decipher any transmissions to or from the servers
            running the Service.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Reverse engineering or attempting to extract the source code of our
            software.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "7. Intellectual Property",
    content:
      "All intellectual property rights in the Service, including the application's design, branding, text, graphics, and software (excluding content from third parties like YouTube), are the exclusive property of AIPadhai and its licensors.",
  },
  {
    title: "8. Termination",
    content:
      "We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. You can terminate your account by discontinuing the use of the Service.",
  },
  {
    title: "9. Limitation of Liability",
    content:
      'To the maximum extent permitted by applicable law, in no event shall AIPadhai or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. The Service is provided on an "AS IS" and "AS AVAILABLE" basis.',
  },
  {
    title: "10. Governing Law and Jurisdiction",
    content:
      "These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts located in India.",
  },
  {
    title: "11. Changes to Terms",
    content:
      "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice before any new terms take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.",
  },
  {
    title: "12. Contact Us",
    content: (
      <>
        If you have any questions about these Terms, please contact us at:{" "}
        <a href="mailto:support@aipadhai.com" style={{ color: theme.accent }}>
          support@aipadhai.com
        </a>
      </>
    ),
  },
];

// --- TYPESCRIPT INTERFACES ---
interface TermSection {
  title: string;
  content: React.ReactNode;
}

interface SectionProps {
  section: TermSection;
}

// --- STYLES ---
// Using JS objects for styling to keep everything in one file.
// This approach is similar to CSS-in-JS libraries.
const styles = {
  // Main App container styles
  app: {
    backgroundColor: theme.background,
    color: theme.primaryText,
    fontFamily: "'Inter', sans-serif",
    minHeight: "100vh",
    padding: "2rem 1rem",
  },
  // Main content container
  container: {
    backgroundColor: theme.cardBackground,
    maxWidth: "800px",
    margin: "0 auto",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
  },
  // Header styles
  header: {
    textAlign: "center" as const,
    marginBottom: "2rem",
    borderBottom: `1px solid ${theme.divider}`,
    paddingBottom: "1.5rem",
  },
  h1: {
    fontSize: "2.25rem",
    fontWeight: 700,
    color: theme.primaryText,
    marginBottom: "0.5rem",
  },
  lastUpdated: {
    fontSize: "0.9rem",
    color: theme.secondaryText,
  },
  // Individual section styles
  section: {
    marginBottom: "2rem",
  },
  h2: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: theme.accent,
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: `1px solid ${theme.divider}`,
  },
  p: {
    fontSize: "1rem",
    lineHeight: 1.7,
    color: theme.secondaryText,
  },
  // Footer styles
  footer: {
    textAlign: "center" as const,
    marginTop: "3rem",
    paddingTop: "1.5rem",
    borderTop: `1px solid ${theme.divider}`,
    color: theme.mutedText,
    fontSize: "0.875rem",
  },
};

// --- COMPONENTS ---

/**
 * Section Component
 * A modular component to render a single section of the terms.
 * @param {SectionProps} props - The properties for the component.
 */
const Section: FC<SectionProps> = ({ section }) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.h2}>{section.title}</h2>
      <div style={styles.p}>{section.content}</div>
    </div>
  );
};

/**
 * Main App Component
 * The root component that lays out the entire page.
 */
const TermsAndConditions: FC = () => {
  // Effect to set the body background color and import font
  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Cleanup function
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.h1}>Terms and Conditions</h1>
          <p style={styles.lastUpdated}>Last Updated: August 8, 2025</p>
        </header>

        <main>
          {termsData.map((section, index) => (
            <Section key={index} section={section} />
          ))}
        </main>

        <footer style={styles.footer}>
          &copy; {new Date().getFullYear()} AIPadhai. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default TermsAndConditions;
