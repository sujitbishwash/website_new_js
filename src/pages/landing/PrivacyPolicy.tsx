
import { Shield, Lock, FileText, Mail, Info, Bot, Share2, Clock, Cookie, Globe, RefreshCw, CheckCircle } from 'lucide-react';

export default function PrivacyPolicy() {

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg sm:rounded-xl overflow-hidden">
          <div className="px-6 py-10 sm:p-14">
            
            {/* Header Section */}
            <header className="mb-12 border-b border-gray-100 pb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Privacy Policy
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
                  This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our educational technology platform (“Platform”, “Service”), available through our website, mobile app, or any other medium.
                </p>
                <p className="text-sm text-gray-500">
                  By accessing or using AIPadhai, you agree to the collection and use of information as described in this Privacy Policy. If you do not agree, please discontinue using our platform.
                </p>
              </div>
            </header>

            {/* Policy Sections */}
            <div className="space-y-14">
              
              {/* 1. About Us */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-gray-100 p-3 rounded-xl mr-4">
                    <Info className="h-6 w-6 text-gray-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">1. About Us</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 leading-relaxed">
                  <p>
                    AIPadhai is an EdTech company based in Bangalore, Karnataka, India, dedicated to enhancing student learning through personalized, AI-powered tools. Our platform helps students access curated educational content, assessments, study recommendations, and personalized learning experiences using the latest advances in artificial intelligence.
                  </p>
                </div>
              </section>

              {/* 2. Information We Collect */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-6">
                  <p>We collect the following categories of information to provide, personalize, and improve our services:</p>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2">a. Personal Information</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Age, gender, and educational background (optional)</li>
                        <li>Payment and billing details (for premium features)</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2">b. Usage Data</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Device information (OS, browser version, IP address)</li>
                        <li>Log data (timestamps, pages visited, time spent)</li>
                        <li>App interaction data and user behavior patterns</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2">c. Educational & Behavioral Data</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Subjects or topics of interest</li>
                        <li>Test results and learning progress</li>
                        <li>Study activity, content engagement, and performance trends</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2">d. Communication Data</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Customer support requests and chat interactions</li>
                        <li>Feedback messages</li>
                        <li>Voice or text data when using AI-based features</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. How We Use Your Data */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-3 rounded-xl mr-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Data</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="font-semibold text-gray-900 min-w-[180px]">Provide and improve our services:</span>
                      <span>Deliver personalized content, quizzes, recommendations, and tailor learning paths to each user.</span>
                    </li>
                     <li className="flex items-start">
                      <span className="font-semibold text-gray-900 min-w-[180px]">Enhance AI features:</span>
                      <span>Process your study data using LLMs to generate summaries, suggest materials, and answer questions. Continuously improve accuracy through anonymized insights.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-gray-900 min-w-[180px]">Maintain the platform:</span>
                      <span>Fix bugs, optimize performance, and ensure platform reliability.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-gray-900 min-w-[180px]">Communicate with you:</span>
                      <span>Send updates, progress reports, service announcements, and notify you about new features or offers.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-gray-900 min-w-[180px]">Comply with legal obligations:</span>
                      <span>Prevent fraud, abuse, or misuse of services and respond to lawful requests.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 4. Use of OpenAI and Other LLMs */}
              <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                    <Bot className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-indigo-900">4. Use of OpenAI and Other LLMs</h2>
                </div>
                <div className="text-indigo-800 ml-0 sm:ml-16 space-y-4 leading-relaxed">
                  <p>
                    AIPadhai integrates OpenAI and other LLM-based services to provide personalized and intelligent educational assistance.
                  </p>
                  <p className="font-medium">When using AI-powered features:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Your input data (e.g., text, questions, or context) may be securely sent to AI providers for processing and generating responses.</li>
                    <li>We do not share personally identifiable information unless necessary for core functionality.</li>
                    <li>All processing is handled securely in compliance with OpenAI’s data protection standards and applicable data privacy regulations in India.</li>
                  </ul>
                </div>
              </section>

              {/* 5. Data Sharing & Disclosure */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-orange-100 p-3 rounded-xl mr-4">
                    <Share2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">5. Data Sharing & Disclosure</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4 leading-relaxed">
                  <p className="font-medium text-gray-900">We do not sell your data to any third parties.</p>
                  <p>However, we may share limited information with:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Technology partners</strong> such as OpenAI, analytics, or hosting providers to support platform operations.</li>
                    <li><strong>Payment processors</strong> to handle secure transactions.</li>
                    <li><strong>Legal authorities</strong> when required by law, or to protect the rights and safety of users.</li>
                  </ul>
                  <p className="text-sm italic mt-4">All third parties are bound by confidentiality and strict data protection agreements.</p>
                </div>
              </section>

              {/* 6. Data Retention */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-gray-100 p-3 rounded-xl mr-4">
                    <Clock className="h-6 w-6 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">6. Data Retention</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4">
                  <p>We retain your data only for as long as necessary to fulfill the purposes outlined in this policy or to comply with applicable legal obligations.</p>
                  <p>You may request deletion of your data at any time (see Section 9 below).</p>
                </div>
              </section>

              {/* 7. Data Security */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-xl mr-4">
                    <Lock className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">7. Data Security</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4 leading-relaxed">
                  <p>We take your data security seriously and implement measures such as:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>SSL/TLS encryption for all communications.</li>
                    <li>Secure servers and restricted access controls.</li>
                    <li>Regular internal audits and security monitoring.</li>
                  </ul>
                  <p className="text-sm bg-red-50 text-red-800 p-3 rounded-lg border border-red-100 mt-4">
                    Despite these safeguards, no method of data transmission or storage is completely secure, and we cannot guarantee absolute protection.
                  </p>
                </div>
              </section>

              {/* 8. Cookies */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-100 p-3 rounded-xl mr-4">
                    <Cookie className="h-6 w-6 text-yellow-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">8. Cookies & Tracking Technologies</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4">
                  <p>We use cookies and tracking tools to remember your preferences, analyze platform usage to improve learning recommendations, and deliver a faster, more personalized user experience.</p>
                  <p>You can control or disable cookies via your browser settings.</p>
                </div>
              </section>

              {/* 9. Your Rights */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-xl mr-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">9. Your Rights</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-4">
                  <p>As an AIPadhai user, you have the right to:</p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                     {['Access and review your personal data', 'Request correction, update, or deletion of your data', 'Withdraw consent for processing where applicable', 'Opt-out of marketing or promotional communications'].map((right, i) => (
                       <div key={i} className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100 text-purple-900">
                         <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 opacity-70" />
                         <span className="text-sm font-medium">{right}</span>
                       </div>
                     ))}
                  </div>
                  <p className="mt-4">To exercise any of these rights, contact us at <a href="mailto:contact@aipadhai.com" className="text-blue-600 hover:underline font-medium">contact@aipadhai.com</a>.</p>
                </div>
              </section>

              {/* 10 & 11 & 12 grouped for brevity but distinct */}
              <div className="grid md:grid-cols-2 gap-8">
                <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                   <h3 className="text-xl font-bold text-gray-900 mb-4">10. Children’s Privacy</h3>
                   <p className="text-gray-600 text-sm leading-relaxed">
                     AIPadhai is intended for individuals aged 13 years and above. We do not knowingly collect personal data from children under 13. If such data is discovered, it will be deleted immediately.
                   </p>
                </section>

                <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                   <div className="flex items-center mb-4">
                     <Globe className="h-5 w-5 text-blue-500 mr-2" />
                     <h3 className="text-xl font-bold text-gray-900">11. International Transfers</h3>
                   </div>
                   <p className="text-gray-600 text-sm leading-relaxed">
                     As we rely on global cloud and AI service providers, your data may be processed outside India. We ensure all such transfers comply with applicable Indian data protection laws, including contractual safeguards and security standards.
                   </p>
                </section>
              </div>

              {/* 12. Policy Updates */}
               <section>
                <div className="flex items-center mb-6">
                  <div className="bg-teal-100 p-3 rounded-xl mr-4">
                    <RefreshCw className="h-6 w-6 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">12. Policy Updates</h2>
                </div>
                <div className="text-gray-600 ml-0 sm:ml-16 space-y-2">
                  <p>We may update this Privacy Policy periodically. If material changes occur, we will notify you via email or an in-app notice.</p>
                  <p>We encourage you to review this policy regularly to stay informed.</p>
                </div>
              </section>


              {/* 13. Contact Section */}
              <section id="contact" className="bg-gray-900 rounded-2xl p-8 sm:p-10 text-white shadow-xl">
                <div className="flex items-center mb-8">
                  <div className="bg-white/10 p-3 rounded-xl mr-4 backdrop-blur-sm">
                    <Mail className="h-8 w-8 text-blue-300" />
                  </div>
                  <h2 className="text-3xl font-bold">13. Contact Us</h2>
                </div>
                <p className="text-gray-300 mb-8 text-lg">
                  If you have any questions or concerns about this Privacy Policy or how we handle your information, please reach out to us.
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