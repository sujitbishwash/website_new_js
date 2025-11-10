
export default function TermsAndConditions() {

  return (
    <div className="min-h-screen bg-gray-800 font-sans">

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header Section */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl text-white tracking-tight mb-6">
            Terms and Conditions
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
              These Terms and Conditions ("Terms") govern your access to and use of our website, mobile app,
              and services ("Platform", "Service").
            </p>
            <p className="leading-relaxed text-lg mt-4">
              By using AIPadhai, you agree to these Terms. If you do not agree, please discontinue using our platform.
            </p>
          </section>

          <hr className="border-[#1c2128]" />

          {/* 1. Overview */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">1.</span> Overview
            </h2>
            <p className="leading-relaxed">
              AIPadhai is an educational technology platform based in Bangalore, India, providing personalized learning experiences through artificial intelligence (AI), machine learning (ML), and other digital tools. These Terms apply to all users, including students, educators, parents, or visitors who access our services.
            </p>
          </section>

          {/* 2. Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">2.</span> Acceptance of Terms
            </h2>
            <p className="mb-4">By creating an account or accessing our platform, you confirm that:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[#3b82f6]">
              <li>You have read and understood these Terms.</li>
              <li>You are at least 13 years of age, or using the platform under parental/guardian supervision.</li>
              <li>You have the legal capacity to enter into this agreement.</li>
              <li>If you are using AIPadhai on behalf of an institution or organization, you agree that you are authorized to accept these Terms on its behalf.</li>
            </ul>
          </section>

          {/* 3. Services Provided */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">3.</span> Services Provided
            </h2>
            <p className="mb-4">AIPadhai offers:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-[#3b82f6]">
              <li>Personalized learning paths based on user data and activity.</li>
              <li>AI-powered summaries, quizzes, and study materials using OpenAI and other Large Language Models (LLMs).</li>
              <li>Access to educational content, progress tracking, and recommendations tailored to each learner.</li>
            </ul>
            <p className="leading-relaxed">
              AIPadhai may update, modify, or discontinue parts of its services at any time without prior notice.
            </p>
          </section>

          {/* 4. User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-[#3b82f6] mr-2">4.</span> User Accounts
            </h2>
            <div className="space-y-6 ml-2 pl-4 border-l border-[#1c2128]">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">a. Registration</h3>
                <p className="leading-relaxed">
                  To access certain features, you must create an account with accurate details (name, email, phone number, etc.). You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">b. Responsibility</h3>
                <ul className="list-disc pl-6 space-y-2 marker:text-[#586069]">
                  <li>You agree to use your account only for lawful purposes.</li>
                  <li>You must immediately notify AIPadhai of any unauthorized access or breach.</li>
                  <li>AIPadhai is not responsible for loss or misuse of your credentials due to your negligence.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Use of AI and Data Processing */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">5.</span> Use of AI and Data Processing
            </h2>
            <p className="mb-4 leading-relaxed">
              AIPadhai uses AI models, including OpenAI's APIs and other LLMs, to personalize learning and generate insights. By using our platform, you consent to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#3b82f6]">
              <li>Allowing your anonymized educational data (such as learning activity or queries) to be processed by AI systems for generating recommendations.</li>
              <li>Understanding that responses generated by AI are informational and may not always be perfect or contextually accurate.</li>
              <li>Not using the AI features for harmful, misleading, or unethical purposes.</li>
            </ul>
            <p className="leading-relaxed bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
              <span className="text-white font-semibold">Note:</span> AIPadhai continuously reviews and monitors AI outputs to maintain quality and compliance.
            </p>
          </section>

          {/* 6. User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">6.</span> User Responsibilities
            </h2>
            <p className="mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-red-400">
              <li>Upload or share harmful, unlawful, or infringing content.</li>
              <li>Attempt to hack, reverse-engineer, or disrupt AIPadhai's systems.</li>
              <li>Misuse AI features to create inappropriate or plagiarized content.</li>
              <li>Impersonate other users or misrepresent your identity.</li>
            </ul>
            <p className="leading-relaxed text-red-400/90">
              Violation of these Terms may result in suspension or permanent termination of your account.
            </p>
          </section>

           {/* 7. Payments and Subscriptions */}
           <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">7.</span> Payments and Subscriptions
            </h2>
            <p className="mb-4">Certain features may require payment or subscription.</p>
            <dl className="grid gap-4 sm:grid-cols-2">
                <div className="bg-[#161b22] p-4 rounded border border-[#30363d]">
                    <dt className="text-white font-semibold mb-1">Pricing</dt>
                    <dd>All prices are displayed in Indian Rupees (INR) unless stated otherwise.</dd>
                </div>
                <div className="bg-[#161b22] p-4 rounded border border-[#30363d]">
                    <dt className="text-white font-semibold mb-1">Billing</dt>
                    <dd>You authorize AIPadhai or its payment partners to process transactions securely.</dd>
                </div>
                <div className="bg-[#161b22] p-4 rounded border border-[#30363d]">
                    <dt className="text-white font-semibold mb-1">Refunds</dt>
                    <dd>Payments made are non-refundable, except in cases of technical or billing errors at AIPadhai's discretion.</dd>
                </div>
                <div className="bg-[#161b22] p-4 rounded border border-[#30363d]">
                    <dt className="text-white font-semibold mb-1">Renewals</dt>
                    <dd>Subscriptions may renew automatically unless canceled before the renewal date.</dd>
                </div>
            </dl>
          </section>

          {/* 8. Intellectual Property Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">8.</span> Intellectual Property Rights
            </h2>
            <p className="leading-relaxed mb-4">
              All content on AIPadhai, including text, design, software, code, graphics, and trademarks, are the property of AIPadhai or its licensors. You are granted a limited, non-transferable, non-exclusive license to use the platform for personal learning purposes only.
            </p>
            <p className="font-semibold text-white mb-2">You must not:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[#3b82f6]">
              <li>Copy, distribute, modify, or resell any platform content.</li>
              <li>Remove or alter any copyright notices.</li>
            </ul>
          </section>

          {/* 9. Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">9.</span> Third-Party Services
            </h2>
            <p className="mb-4">AIPadhai may integrate third-party services such as:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-[#3b82f6]">
               <li>AI APIs (e.g., OpenAI, Google AI)</li>
               <li>Payment gateways (e.g., Razorpay, Stripe)</li>
               <li>Analytics and cloud storage tools</li>
            </ul>
            <p className="leading-relaxed">
              These providers have their own terms and privacy policies. AIPadhai is not responsible for third-party actions but ensures compliance through secure integrations.
            </p>
          </section>

          {/* 10. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-[#3b82f6] mr-2">10.</span> Limitation of Liability
            </h2>
            <p className="mb-4">AIPadhai strives for accuracy and reliability but does not guarantee uninterrupted or error-free service. To the fullest extent permitted by law:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#3b82f6]">
              <li>AIPadhai is not liable for indirect, incidental, or consequential damages arising from your use of the platform.</li>
              <li>We are not responsible for any academic, financial, or professional losses resulting from reliance on AI-generated content.</li>
            </ul>
            <p className="text-lg text-white font-medium">
              Use of the platform is entirely at your own risk.
            </p>
          </section>

          {/* 11 - 15 grouped for brevity in display but fully present */}
          <div className="grid gap-12 sm:grid-cols-2">
              <section>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">11.</span> Indemnification
                </h2>
                <p className="text-sm leading-relaxed">
                    You agree to indemnify and hold harmless AIPadhai, its affiliates, employees, and partners from any claims, damages, or liabilities arising from your violation of these Terms, misuse of AI features or intellectual property, or infringement of third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">12.</span> Termination
                </h2>
                <p className="text-sm leading-relaxed mb-2">
                    AIPadhai reserves the right to suspend or terminate your account for violations of these Terms or applicable law, or restrict access to features in case of suspicious or abusive activity.
                </p>
                <p className="text-sm text-white">Upon termination, your right to use the platform ceases immediately.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">13.</span> Data Protection & Privacy
                </h2>
                <p className="text-sm leading-relaxed">
                    Your use of AIPadhai is governed by our Privacy Policy, which outlines how we collect, use, and protect your data. By agreeing to these Terms, you also consent to our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="text-[#3b82f6] mr-2">14.</span> Changes to Terms
                </h2>
                <p className="text-sm leading-relaxed">
                    We may revise or update these Terms periodically. If changes are significant, we will notify you via email or a notice on the platform. Continued use of AIPadhai after updates constitutes acceptance of the revised Terms.
                </p>
              </section>
          </div>

          {/* 15. Governing Law */}
          <section className="bg-[#161b22] p-6 rounded-lg border border-[#30363d]">
             <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-[#3b82f6] mr-2">15.</span> Governing Law & Jurisdiction
            </h2>
            <p className="leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
            </p>
          </section>

          {/* 16. Contact Information */}
          <section id="contact">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
               <span className="text-[#3b82f6] mr-2">16.</span> Contact Information
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