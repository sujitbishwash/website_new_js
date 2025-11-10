
import { Shield, Info, CheckCircle, Zap, User, Bot, AlertTriangle, 
  CreditCard, Copyright, Share2, AlertCircle, XCircle, Lock, RefreshCw, 
  Scale, Mail 
} from 'lucide-react';

export default function TermsAndConditions() {

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg sm:rounded-xl overflow-hidden">
          <div className="px-6 py-10 sm:p-14">
            
            {/* Header Section */}
            <header className="mb-12 border-b border-gray-100 pb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Terms and Conditions
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 text-sm space-y-2 sm:space-y-0 sm:space-x-6">
                <p>Last Updated: <span className="font-medium text-gray-900">November 1, 2025</span></p>
                <span className="hidden sm:inline text-gray-300">•</span>
                <p>Effective Date: <span className="font-medium text-gray-900">November 1, 2025</span></p>
              </div>
              <div className="mt-8 text-lg text-gray-600 leading-relaxed space-y-4 bg-blue-50 p-6 rounded-xl border border-blue-100">
                <p className="font-medium text-blue-900">
                  Welcome to AIPadhai (“Company”, “we”, “us”, or “our”).
                </p>
                <p>
                  These Terms and Conditions (“Terms”) govern your access to and use of our website, mobile app, and services (“Platform”, “Service”).
                </p>
                <p className="text-sm text-gray-500">
                  By using AIPadhai, you agree to these Terms. If you do not agree, please discontinue using our platform.
                </p>
              </div>
            </header>

            {/* Terms Sections */}
            <div className="space-y-14">
              
              {/* 1. Overview */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-gray-100 p-3 rounded-xl mr-4">
                    <Info className="h-6 w-6 text-gray-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">1. Overview</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 leading-relaxed">
                  <p>
                    AIPadhai is an educational technology platform based in Bangalore, India, providing personalized learning experiences through artificial intelligence (AI), machine learning (ML), and other digital tools. These Terms apply to all users, including students, educators, parents, or visitors who access our services.
                  </p>
                </div>
              </section>

              {/* 2. Acceptance of Terms */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-3 rounded-xl mr-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">2. Acceptance of Terms</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4">
                  <p>By creating an account or accessing our platform, you confirm that:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>You have read and understood these Terms.</li>
                    <li>You are at least 13 years of age, or using the platform under parental/guardian supervision.</li>
                    <li>You have the legal capacity to enter into this agreement.</li>
                    <li>If you are using AIPadhai on behalf of an institution or organization, you agree that you are authorized to accept these Terms on its behalf.</li>
                  </ul>
                </div>
              </section>

              {/* 3. Services Provided */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-100 p-3 rounded-xl mr-4">
                    <Zap className="h-6 w-6 text-yellow-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">3. Services Provided</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4">
                  <p>AIPadhai offers:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Personalized learning paths based on user data and activity.</li>
                    <li>AI-powered summaries, quizzes, and study materials using OpenAI and other Large Language Models (LLMs).</li>
                    <li>Access to educational content, progress tracking, and recommendations tailored to each learner.</li>
                  </ul>
                  <p className="text-sm italic mt-4">AIPadhai may update, modify, or discontinue parts of its services at any time without prior notice.</p>
                </div>
              </section>

              {/* 4. User Accounts */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">4. User Accounts</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">a. Registration</h3>
                    <p>To access certain features, you must create an account with accurate details (name, email, phone number, etc.). You are responsible for maintaining the confidentiality of your account credentials.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">b. Responsibility</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>You agree to use your account only for lawful purposes.</li>
                      <li>You must immediately notify AIPadhai of any unauthorized access or breach.</li>
                      <li>AIPadhai is not responsible for loss or misuse of your credentials due to your negligence.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 5. Use of AI and Data Processing */}
              <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                    <Bot className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-indigo-900">5. Use of AI and Data Processing</h2>
                </div>
                <div className="text-indigo-800 ml-0 sm:ml-16 space-y-4 leading-relaxed">
                  <p>AIPadhai uses AI models, including OpenAI’s APIs and other LLMs, to personalize learning and generate insights. By using our platform, you consent to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Allowing your anonymized educational data to be processed by AI systems for generating recommendations.</li>
                    <li>Understanding that responses generated by AI are informational and may not always be perfect or contextually accurate.</li>
                    <li>Not using the AI features for harmful, misleading, or unethical purposes.</li>
                  </ul>
                  <p className="font-medium mt-4">AIPadhai continuously reviews and monitors AI outputs to maintain quality and compliance.</p>
                </div>
              </section>

              {/* 6. User Responsibilities */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-orange-100 p-3 rounded-xl mr-4">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">6. User Responsibilities</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4">
                  <p>You agree not to:</p>
                  <ul className="grid sm:grid-cols-2 gap-3 mt-4">
                    {['Upload or share harmful, unlawful, or infringing content', 'Attempt to hack, reverse-engineer, or disrupt AIPadhai’s systems', 'Misuse AI features to create inappropriate or plagiarized content', 'Impersonate other users or misrepresent your identity'].map((item, i) => (
                       <li key={i} className="flex items-start bg-orange-50 p-3 rounded-lg border border-orange-100 text-orange-900 text-sm">
                         <span className="mr-2">•</span>{item}
                       </li>
                     ))}
                  </ul>
                  <p className="text-sm font-medium text-red-600 mt-4">Violation of these Terms may result in suspension or permanent termination of your account.</p>
                </div>
              </section>

              {/* 7. Payments and Subscriptions */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-xl mr-4">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">7. Payments and Subscriptions</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 grid sm:grid-cols-2 gap-6">
                   <div>
                      <h3 className="font-semibold text-gray-900">Pricing</h3>
                      <p className="text-sm mt-1">All prices are displayed in Indian Rupees (INR) unless stated otherwise.</p>
                   </div>
                   <div>
                      <h3 className="font-semibold text-gray-900">Billing</h3>
                      <p className="text-sm mt-1">You authorize AIPadhai or its payment partners to process transactions securely.</p>
                   </div>
                   <div>
                      <h3 className="font-semibold text-gray-900">Refunds</h3>
                      <p className="text-sm mt-1">Payments made are non-refundable, except in cases of technical or billing errors at AIPadhai’s discretion.</p>
                   </div>
                   <div>
                      <h3 className="font-semibold text-gray-900">Renewals</h3>
                      <p className="text-sm mt-1">Subscriptions may renew automatically unless canceled before the renewal date.</p>
                   </div>
                </div>
              </section>

              {/* 8. Intellectual Property Rights */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-pink-100 p-3 rounded-xl mr-4">
                    <Copyright className="h-6 w-6 text-pink-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">8. Intellectual Property Rights</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4 leading-relaxed">
                  <p>All content on AIPadhai, including text, design, software, code, graphics, and trademarks, are the property of AIPadhai or its licensors.</p>
                  <p>You are granted a limited, non-transferable, non-exclusive license to use the platform for personal learning purposes only.</p>
                  <p className="font-medium text-gray-900">You must not:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Copy, distribute, modify, or resell any platform content.</li>
                    <li>Remove or alter any copyright notices.</li>
                  </ul>
                </div>
              </section>

              {/* 9. Third-Party Services */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-teal-100 p-3 rounded-xl mr-4">
                    <Share2 className="h-6 w-6 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">9. Third-Party Services</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4">
                  <p>AIPadhai may integrate third-party services such as:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>AI APIs (e.g., OpenAI, Google AI)</li>
                    <li>Payment gateways (e.g., Razorpay, Stripe)</li>
                    <li>Analytics and cloud storage tools</li>
                  </ul>
                  <p className="text-sm bg-teal-50 p-3 rounded-lg text-teal-800 border border-teal-100">
                    These providers have their own terms and privacy policies. AIPadhai is not responsible for third-party actions but ensures compliance through secure integrations.
                  </p>
                </div>
              </section>

              {/* 10. Limitation of Liability */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-xl mr-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">10. Limitation of Liability</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4 leading-relaxed">
                  <p>AIPadhai strives for accuracy and reliability but does not guarantee uninterrupted or error-free service.</p>
                  <p className="font-medium">To the fullest extent permitted by law:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>AIPadhai is not liable for indirect, incidental, or consequential damages arising from your use of the platform.</li>
                    <li>We are not responsible for any academic, financial, or professional losses resulting from reliance on AI-generated content.</li>
                  </ul>
                  <p className="font-semibold">Use of the platform is entirely at your own risk.</p>
                </div>
              </section>

              {/* 11. Indemnification */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">11. Indemnification</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16">
                  <p>You agree to indemnify and hold harmless AIPadhai, its affiliates, employees, and partners from any claims, damages, or liabilities arising from:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Your violation of these Terms.</li>
                    <li>Misuse of AI features or intellectual property.</li>
                    <li>Infringement of third-party rights.</li>
                  </ul>
                </div>
              </section>

              {/* 12. Termination */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-gray-900 p-3 rounded-xl mr-4">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">12. Termination</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4">
                  <p>AIPadhai reserves the right to suspend or terminate your account for violations of these Terms or applicable law, or to restrict access to features in case of suspicious or abusive activity.</p>
                  <p className="font-medium text-gray-900">Upon termination, your right to use the platform ceases immediately.</p>
                </div>
              </section>

              {/* 13 & 14 grouped */}
              <div className="grid md:grid-cols-2 gap-8">
                 {/* 13. Data Protection */}
                <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                   <div className="flex items-center mb-4">
                     <Lock className="h-5 w-5 text-green-600 mr-2" />
                     <h3 className="text-xl font-bold text-gray-900">13. Data Protection</h3>
                   </div>
                   <p className="text-gray-600 text-sm leading-relaxed">
                     Your use of AIPadhai is governed by our Privacy Policy. By agreeing to these Terms, you also consent to our Privacy Policy.
                   </p>
                </section>

                 {/* 14. Changes to Terms */}
                <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                   <div className="flex items-center mb-4">
                     <RefreshCw className="h-5 w-5 text-teal-600 mr-2" />
                     <h3 className="text-xl font-bold text-gray-900">14. Changes to Terms</h3>
                   </div>
                   <p className="text-gray-600 text-sm leading-relaxed">
                     We may revise these Terms periodically. Significant changes will be notified via email or platform notice. Continued use after updates constitutes acceptance.
                   </p>
                </section>
              </div>

               {/* 15. Governing Law */}
               <section>
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                    <Scale className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">15. Governing Law & Jurisdiction</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 leading-relaxed">
                  <p>
                    These Terms are governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
                  </p>
                </div>
              </section>

              {/* 16. Contact Section */}
              <section id="contact" className="bg-gray-900 rounded-2xl p-8 sm:p-10 text-white shadow-xl">
                <div className="flex items-center mb-8">
                  <div className="bg-white/10 p-3 rounded-xl mr-4 backdrop-blur-sm">
                    <Mail className="h-8 w-8 text-blue-300" />
                  </div>
                  <h2 className="text-3xl font-bold">16. Contact Information</h2>
                </div>
                <p className="text-gray-300 mb-8 text-lg">
                  For questions, complaints, or legal notices, please contact us at:
                </p>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-32 flex-shrink-0 text-gray-400 uppercase text-xs font-semibold tracking-wider pt-1">Company</div>
                    <div className="text-lg font-medium">AIPadhai</div>
                  </div>
                   <div className="flex items-start">
                    <div className="w-32 flex-shrink-0 text-gray-400 uppercase text-xs font-semibold tracking-wider pt-1">Location</div>
                    <div className="text-lg">Bangalore, Karnataka, India</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-32 flex-shrink-0 text-gray-400 uppercase text-xs font-semibold tracking-wider pt-1">Email</div>
                    <a href="mailto:contact@aipadhai.com" className="text-lg text-blue-300 hover:text-blue-200 transition-colors">contact@aipadhai.com</a>
                  </div>
                  <div className="flex items-start">
                    <div className="w-32 flex-shrink-0 text-gray-400 uppercase text-xs font-semibold tracking-wider pt-1">Phone</div>
                    <div className="text-lg">+91 733 038 5497</div>
                  </div>
                </div>
              </section>

            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-6 border-t border-gray-100 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} AIPadhai. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
}