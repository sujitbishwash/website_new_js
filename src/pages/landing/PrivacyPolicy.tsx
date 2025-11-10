
import {  Lock } from 'lucide-react';

export default function PrivacyPolicy() {

  return (
    <div className="min-h-screen bg-gray-800 font-sans">

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header Section */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl text-white tracking-tight mb-6">
            Privacy Policy
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm font-medium uppercase tracking-wider text-[#586069]">
            <span>Last Updated: November 1, 2025</span>
            <span className="hidden sm:block">•</span>
            <span>Effective Date: November 1, 2025</span>
          </div>
        </header>

        {/* Content Section */}
        <article className="space-y-12">
          {/* Introduction */}
          <section>
            <p className="leading-relaxed text-lg">
              Welcome to <strong className="text-white">AIPadhai</strong> ("Company", "we", "us", or "our").
              This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our educational technology platform ("Platform", "Service"), available through our website, mobile app, or any other medium.
            </p>
            <p className="leading-relaxed text-lg mt-4">
              By accessing or using AIPadhai, you agree to the collection and use of information as described in this Privacy Policy. If you do not agree, please discontinue using our platform.
            </p>
          </section>

          <hr className="border-[#1c2128]" />

          {/* 1. About Us */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">1.</span> About Us
            </h2>
            <p className="leading-relaxed">
              AIPadhai is an EdTech company based in Bangalore, Karnataka, India, dedicated to enhancing student learning through personalized, AI-powered tools. Our platform helps students access curated educational content, assessments, study recommendations, and personalized learning experiences using the latest advances in artificial intelligence.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-[#3b82f6] mr-2">2.</span> Information We Collect
            </h2>
            <p className="mb-6">We collect the following categories of information to provide, personalize, and improve our services:</p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-[#161b22] p-5 rounded-lg border border-[#30363d]">
                <div className="flex items-center mb-3 text-white">
                  <h3 className="font-semibold">a. Personal Information</h3>
                </div>
                <ul className="list-disc pl-6 space-y-1 text-sm marker:text-[#586069]">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Age, gender, and educational background (optional)</li>
                  <li>Payment and billing details (for premium features)</li>
                </ul>
              </div>

              <div className="bg-[#161b22] p-5 rounded-lg border border-[#30363d]">
                <div className="flex items-center mb-3 text-white">
                  <h3 className="font-semibold">b. Usage Data</h3>
                </div>
                 <ul className="list-disc pl-6 space-y-1 text-sm marker:text-[#586069]">
                  <li>Device information (type, OS, browser version, IP)</li>
                  <li>Log data (timestamps, pages visited, time spent)</li>
                  <li>App interaction data and user behavior patterns</li>
                </ul>
              </div>

              <div className="bg-[#161b22] p-5 rounded-lg border border-[#30363d]">
                <div className="flex items-center mb-3 text-white">
                  <h3 className="font-semibold">c. Educational & Behavioral Data</h3>
                </div>
                 <ul className="list-disc pl-6 space-y-1 text-sm marker:text-[#586069]">
                  <li>Subjects or topics of interest</li>
                  <li>Test results and learning progress</li>
                  <li>Study activity, content engagement, and performance trends</li>
                </ul>
              </div>

              <div className="bg-[#161b22] p-5 rounded-lg border border-[#30363d]">
                <div className="flex items-center mb-3 text-white">
                  <h3 className="font-semibold">d. Communication Data</h3>
                </div>
                 <ul className="list-disc pl-6 space-y-1 text-sm marker:text-[#586069]">
                  <li>Customer support requests, chat interactions, feedback</li>
                  <li>Voice or text data when using AI-based features</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. How We Use Your Data */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">3.</span> How We Use Your Data
            </h2>
            <p className="mb-4">We use your information to:</p>
            <div className="space-y-4 ml-2 pl-4 border-l border-gray-600">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Provide and improve our services</h3>
                <p className="text-sm">Deliver personalized content, quizzes, recommendations, tailored learning paths, and study plans.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Enhance AI and LLM-based features</h3>
                <p className="text-sm">Process your study data using LLMs to generate summaries, answer questions, and continuously improve accuracy through anonymized insights.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Maintain and operate the platform</h3>
                <p className="text-sm">Fix bugs, optimize performance, and ensure platform reliability.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Communicate with you</h3>
                <p className="text-sm">Send updates, learning progress reports, service announcements, and notify you about new features or relevant content.</p>
              </div>
               <div>
                <h3 className="text-lg font-semibold text-white mb-1">Comply with legal obligations</h3>
                <p className="text-sm">Prevent fraud, abuse, or misuse of services and respond to lawful requests.</p>
              </div>
            </div>
          </section>

          {/* 4. Use of OpenAI and Other LLMs */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">4.</span> Use of OpenAI and Other LLMs
            </h2>
            <p className="mb-4 leading-relaxed">
              AIPadhai integrates OpenAI and other LLM-based services to provide personalized and intelligent educational assistance. When using AI-powered features:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#3b82f6]">
              <li>Your input data (e.g., text, questions, or context) may be securely sent to AI providers for processing and generating responses.</li>
              <li>We do not share personally identifiable information unless necessary for core functionality.</li>
              <li>All processing is handled securely in compliance with OpenAI's data protection standards and applicable data privacy regulations in India.</li>
            </ul>
          </section>

          {/* 5. Data Sharing & Disclosure */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">5.</span> Data Sharing & Disclosure
            </h2>
            <p className="mb-4 font-medium text-white">We do not sell your data to any third parties.</p>
            <p className="mb-4">However, we may share limited information with:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#3b82f6]">
              <li>Technology partners such as OpenAI, analytics, or hosting providers to support platform operations.</li>
              <li>Payment processors to handle secure transactions.</li>
              <li>Legal authorities when required by law, or to protect the rights and safety of users.</li>
            </ul>
            <p className="leading-relaxed bg-[#161b22] p-4 rounded-lg border border-[#30363d] text-sm">
              <Lock className="inline-block w-4 h-4 mr-2 mb-0.5 text-[#3b82f6]" />
              All third parties are bound by confidentiality and strict data protection agreements.
            </p>
          </section>

           {/* 6 - 8 Grouped */}
           <div className="grid gap-12 sm:grid-cols-2">
              <section>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">6.</span> Data Retention
                </h2>
                <p className="text-sm leading-relaxed mb-2">
                    We retain your data only for as long as necessary to fulfill the purposes outlined in this policy and comply with applicable legal obligations.
                </p>
                <p className="text-sm">You may request deletion of your data at any time.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">7.</span> Data Security
                </h2>
                <p className="text-sm leading-relaxed mb-2">
                    We implement measures such as SSL/TLS encryption, secure servers, restricted access controls, and regular internal audits.
                </p>
                <p className="text-sm">Despite these safeguards, no method of transmission is completely secure.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">8.</span> Cookies & Tracking
                </h2>
                <p className="text-sm leading-relaxed">
                   We use cookies to remember your preferences, analyze platform usage, and deliver a faster, more personalized user experience. You can control or disable cookies via browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">9.</span> Your Rights
                </h2>
                <ul className="list-disc pl-6 space-y-1 text-sm marker:text-[#3b82f6] mb-2">
                  <li>Access, review, correct, or delete your data.</li>
                  <li>Withdraw consent for processing.</li>
                  <li>Opt-out of marketing communications.</li>
                </ul>
                <a href="mailto:contact@aipadhai.com" className="text-sm text-[#3b82f6] hover:underline">Contact us to exercise these rights.</a>
              </section>
          </div>

          <hr className="border-[#1c2128]" />

           {/* 10 - 12 Grouped */}
           <section className="space-y-12">
             <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">10.</span> Children's Privacy
                </h2>
                <p className="leading-relaxed">
                    AIPadhai is intended for individuals aged 13 years and above. We do not knowingly collect personal data from children under 13. If such data is discovered, it will be deleted immediately.
                </p>
             </div>

             <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">11.</span> International Data Transfers
                </h2>
                <p className="leading-relaxed">
                    As we rely on cloud and AI service providers that may operate globally, your data may be transferred or processed outside India. We ensure all such transfers comply with applicable Indian data protection laws.
                </p>
             </div>

             <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">12.</span> Policy Updates
                </h2>
                <p className="leading-relaxed">
                    We may update this Privacy Policy periodically. If material changes occur, we will notify you via email or an in-app notice. We encourage you to review this policy regularly.
                </p>
             </div>
           </section>

          {/* 13. Contact Information */}
          <section id="contact">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
               <span className="text-[#3b82f6] mr-2">13.</span> Contact Us
            </h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#0d1117] p-6 rounded-xl border border-[#30363d]">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-white font-bold text-lg mb-1">AIPadhai</h3>
                    <p className="text-[#9daab6]">Bangalore, Karnataka, India</p>
                </div>
                <div className="flex flex-col space-y-3">
                    <a href="mailto:contact@aipadhai.com" className="flex items-center text-white hover:text-[#3b82f6] transition-colors group">
                        <span className="bg-[#1c2128] p-2 rounded-md mr-3 group-hover:bg-[#30363d] transition-colors">📧</span>
                        contact@aipadhai.com
                    </a>
                    <a href="tel:+917330385497" className="flex items-center text-white hover:text-[#3b82f6] transition-colors group">
                        <span className="bg-[#1c2128] p-2 rounded-md mr-3 group-hover:bg-[#30363d] transition-colors">📞</span>
                        +91 733 038 5497
                    </a>
                </div>
            </div>
          </section>

        </article>
      </main>
    </div>
  );
}