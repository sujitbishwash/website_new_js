import { theme } from "@/styles/theme";
import { Copy, Plus } from "lucide-react";
import { useState } from "react";

// --- Apple-inspired Theme ---
// A refined color palette for a clean, modern aesthetic.
const appleTheme = {
  background: "#f5f5f7",
  cardBackground: "#ffffff",
  primaryText: "#1d1d1f",
  secondaryText: "#6e6e73",
  mutedText: "#86868b",
  divider: "#d2d2d7",
  accent: "#007aff", // Apple's signature blue
  accentLight: "rgba(0, 122, 255, 0.1)",
  lightBlueBackground: "#f0f8ff",
};
// --- CSS Styles Component ---
// The CSS is included directly in the component to avoid file resolution errors.
const ReferralStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .referral-page {
      /* New: Added a subtle radial gradient for depth */
      background-color: ${theme.background};
      background-image: radial-gradient(circle at top, ${theme.accentLight}, transparent 40%);
      min-height: 100vh;
      padding: 40px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      color: ${theme.secondaryText};
    }

    .referral-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .referral-card {
      background-color: ${theme.cardBackground};
      border: 1px solid ${theme.divider};
      border-radius: 12px;
      padding: 24px;
      /* New: Added transition for hover effects */
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    /* New: Added a hover effect to lift the cards */
    .referral-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: ${theme.primaryText};
      margin: 0 0 1.5rem;
    }

    /* --- Header --- */
    .referral-header {
      text-align: center;
      margin-bottom: 1rem;
    }
    .referral-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: ${theme.primaryText};
      margin: 0;
      /* New: Added text shadow for emphasis */
      text-shadow: 0 0 15px ${theme.accentLight};
    }
    .referral-header .subtitle {
      font-size: 1.2rem;
      color: ${theme.mutedText};
      margin: 8px 0 0;
    }
    .referral-header .subtitle span {
        color: #2ea043; /* Brighter green */
        font-weight: 700;
    }

    /* --- Premium Unlock Section --- */
    .premium-unlock-section {
        background: linear-gradient(90deg, ${theme.accentLight}, rgba(4, 88, 207, 0.2));
        border: 1px solid ${theme.accentLight};
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        position: relative;
        overflow: hidden;
    }
    /* New: Added a glowing effect */
    .premium-unlock-section::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(88, 166, 255, 0.15), transparent 40%);
        animation: rotateGlow 15s linear infinite;
    }

    @keyframes rotateGlow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .premium-unlock-section h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: ${theme.primaryText};
        margin: 0 0 1rem;
        position: relative; /* To keep it above the glow */
    }
    .premium-features-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
        list-style: none;
        padding: 0;
        position: relative; /* To keep it above the glow */
    }
    .premium-features-list li {
        background: ${theme.cardBackground};
        padding: 16px;
        border-radius: 8px;
        font-weight: 500;
        border: 1px solid ${theme.divider};
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .premium-unlock-section .footer-text {
        color: ${theme.mutedText};
        margin: 0;
        position: relative; /* To keep it above the glow */
    }


    /* --- Referral Code Section --- */
    .referral-code-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .referral-code-box {
      background-color: ${theme.background};
      border: 1px dashed ${theme.divider};
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      color: ${theme.primaryText};
      letter-spacing: 1px;
    }

    .copy-button {
      background-color: ${theme.green};
      color: white;
      border: none;
      padding: 12px 20px;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .copy-button:hover {
      background-color: ${theme.green};
    }
    
    .copy-button.copied {
        background-color: #58a6ff;
    }

    /* --- How It Works Section --- */
    .how-it-works-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      text-align: center;
    }

    .step-card {
      background-color: ${theme.background};
      padding: 20px;
      border-radius: 8px;
      border: 1px solid transparent;
      transition: border-color 0.3s ease;
    }
    .step-card:hover {
        border-color: ${theme.divider};
    }
    
    .step-card .icon {
        background-color: ${theme.accentLight};
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        border: 1px solid ${theme.accentLight};
    }

    .step-card h4 {
        margin: 0 0 0.5rem;
        color: ${theme.primaryText};
    }
    
    .step-card p {
        font-size: 0.9rem;
        color: ${theme.mutedText};
        line-height: 1.5;
        margin: 0;
    }

    /* --- Stats Section --- */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
    }
    
    .stat-item h4 {
        margin: 0 0 0.5rem;
        font-size: 1rem;
        color: ${theme.mutedText};
        font-weight: 500;
    }

    .stat-item .value {
        font-size: 2rem;
        font-weight: 700;
        color: ${theme.primaryText};
    }

    /* --- Leaderboard --- */
    .leaderboard-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .leaderboard-table th, .leaderboard-table td {
        padding: 12px 16px;
        text-align: left;
    }
    
    .leaderboard-table thead {
        border-bottom: 1px solid ${theme.divider};
    }

    .leaderboard-table th {
        font-size: 0.9rem;
        color: ${theme.mutedText};
        font-weight: 600;
    }
    
    /* New: Zebra-striping for better readability */
    .leaderboard-table tbody tr:nth-child(odd) {
        background-color: ${theme.background};
    }

    .leaderboard-table tbody tr:hover {
        background-color: ${theme.cardBackground};
    }
    
    .leaderboard-table td {
        color: ${theme.secondaryText};
    }
    
    .leaderboard-table .rank {
        font-weight: 700;
        color: ${theme.accent};
    }
    
    .leaderboard-table .rewards {
        color: ${theme.green};
        font-weight: 600;
    }
        
    /* --- FAQ Section --- */
    .faq-item {
        border-bottom: 1px solid ${appleTheme.divider};
        padding: 20px 0;
    }
    .faq-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
    .faq-question {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 500;
        color: ${appleTheme.primaryText};
    }
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out, margin-top 0.3s ease-out;
        color: ${appleTheme.secondaryText};
        line-height: 1.6;
    }
    .faq-answer.open {
        max-height: 200px; /* Adjust as needed */
        margin-top: 16px;
    }
    .faq-toggle {
        font-size: 1.5rem;
        font-weight: 300;
        transition: transform 0.3s ease;
    }
    .faq-toggle.open {
        transform: rotate(45deg);
    }

  `}</style>
);

// --- FAQ Item Component ---
const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border py-5 last:border-b-0 last:pb-0">
            <div 
                className="flex cursor-pointer items-center justify-between text-lg font-medium text-foreground" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{q}</span>
                <span className={`text-2xl font-light transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : ''}`}>
                  <Plus /></span>
            </div>
            <div 
                className={`overflow-hidden text-muted-foreground transition-all duration-300 ease-in-out ${isOpen ? 'mt-4 max-h-48' : 'max-h-0'}`}
            >
                <p className="leading-relaxed">{a}</p>
            </div>
        </div>
    );
};

// --- Main Referral Page Component ---
const ReferralPage = () => {
  const [copyText, setCopyText] = useState("Copy");
  const referralCode = "AIPADHAI123XYZ";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopyText("Copied!");
    setTimeout(() => setCopyText("Copy"), 2000);
  };

  const leaderboardData = [
    { rank: 1, name: "Rohan Sharma", referrals: 42, rewards: "₹2100" },
    { rank: 2, name: "Priya Patel", referrals: 35, rewards: "₹1750" },
    { rank: 3, name: "Amit Kumar", referrals: 28, rewards: "₹1400" },
    { rank: 4, name: "Sneha Reddy", referrals: 21, rewards: "₹1050" },
    { rank: 5, name: "Vikram Singh", referrals: 15, rewards: "₹750" },
  ];

  // const premiumFeatures = [
  //   "✨ Unlimited Questions",
  //   "💬 Unlimited AI Chats",
  //   "📝 Free Quizzes & Mock Tests",
  //   "📊 Detailed Performance Reports",
  // ];
  const faqData = [
    {
      q: "Who is eligible to refer friends?",
      a: "Anyone with an active AI Padhai account can refer friends. There's no limit to how many friends you can refer.",
    },
    {
      q: "How do I refer a friend?",
      a: "Simply share your unique referral code or link with them. When they sign up and make their first purchase, you'll both get rewarded.",
    },
    {
      q: "What do I get?",
      a: "You receive ₹50 in cash rewards for every successful referral. After your first successful referral, you also unlock a free month of our Premium plan.",
    },
    {
      q: "What does my friend get?",
      a: "Your friend gets a 10% discount on their first purchase when they use your referral code.",
    },
  ];
  return (
    <>
      <ReferralStyles />
      <div className="min-h-screen bg-background p-4 font-sans text-foreground antialiased sm:p-6 md:p-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-6">
          {/* --- Header --- */}
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">Refer & Earn</h1>
          </header>

          {/* --- Premium Unlock Section --- */}
          {/**<div className="premium-unlock-section">
            <h2>Plus, unlock a FREE 1-Month Premium Subscription!</h2>
            <p>Enjoy unlimited access when your first referral signs up:</p>
            <ul className="premium-features-list">
              {premiumFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <p className="footer-text">Start sharing your unique code today!</p>
          </div>*/}

          {/* --- Offer Section --- */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-divider bg-background-subtle p-6 text-center hover:shadow-xl hover:translate-y-0.5 transition-all duration-500 ease-in-out">
                  <h3 className="mb-2 text-base font-semibold text-muted-foreground">Your friend gets</h3>
                  <p className="text-lg font-semibold text-foreground sm:text-xl">10% discount on first purchase</p>
              </div>
              <div className="rounded-2xl border border-divider bg-background-subtle p-6 text-center hover:shadow-xl">
                  <h3 className="mb-2 text-base font-semibold text-muted-foreground">You get</h3>
                  <p className="text-lg font-semibold text-foreground sm:text-xl">₹50 for each referral</p>
              </div>
          </div>

          {/* --- Referral Code Card --- */}
          <div className="rounded-2xl border border-divider bg-card p-2 sm:p-6 shadow-sm md:p-8 hover:shadow-xl hover:translate-y-0.5 transition-all duration-500 ease-in-out">
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-background-subtle p-4">
              <div className="flex-grow text-center sm:text-left font-mono text-lg sm:text-xl font-semibold tracking-wider text-foreground">{referralCode}</div>
              <button
                onClick={handleCopy}
                className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-medium text-white transition-all duration-200 ease-in-out active:scale-95 cursor-pointer ${copyText === 'Copied!' ? 'bg-[#34c759]' : 'bg-primary hover:bg-primary/80'}`}
              >
                <Copy />
                {copyText}
              </button>
            </div>
          </div>
          {/* --- How It Works Card --- */}
          <div className="rounded-2xl border border-divider bg-card p-6 shadow-sm md:p-8 hover:shadow-xl hover:translate-y-0.5 transition-all duration-500 ease-in-out">
            <h3 className="mb-6 text-xl font-semibold text-foreground sm:text-2xl">How It Works</h3>
            <ol className="flex flex-col gap-5">
                <li className="flex items-center gap-4 text-base text-foreground sm:text-lg">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 font-semibold text-primary">1</span> 
                    Share the code or link with a friend.
                </li>
                <li className="flex items-center gap-4 text-base text-foreground sm:text-lg">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 font-semibold text-primary">2</span> 
                    Your friend buys a course at a discount.
                </li>
                <li className="flex items-center gap-4 text-base text-foreground sm:text-lg">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 font-semibold text-primary">3</span> 
                    Get a reward for your referral.
                </li>
            </ol>
          </div>

          {/* --- Stats & Leaderboard Card --- */}
          <div className="rounded-2xl border border-divider bg-card p-6 shadow-sm md:p-8 hover:shadow-xl hover:translate-y-0.5 transition-all duration-500 ease-in-out">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
                {/* --- Stats Section --- */}
                <div className="flex justify-between sm:justify-start sm:flex-col gap-6">
                  <div className="stat-item">
                    <h4 className="flex mb-2 text-base font-medium text-muted-foreground"><span className="hidden sm:block">Friends</span>Referred</h4>
                    <div className="text-3xl font-semibold leading-none text-foreground sm:text-4xl">12</div>
                  </div>
                  <div className="stat-item">
                    <h4 className="flex mb-2 text-base font-medium text-muted-foreground"><span className="hidden sm:block">Rewards</span>Earned</h4>
                    <div className="text-3xl font-semibold leading-none text-foreground sm:text-4xl">₹1150</div>
                  </div>
                  <div className="stat-item">
                    <h4 className="flex mb-2 text-base font-medium text-muted-foreground">Pending</h4>
                    <div className="text-3xl font-semibold leading-none text-foreground sm:text-4xl">₹450</div>
                  </div>
                </div>

                {/* --- Leaderboard Section --- */}
                <div className="overflow-x-auto">
                    <table className="w-full sm:min-w-[400px] border-collapse">
                      <thead>
                        <tr className="border-b border-divider">
                          <th className="pb-4 text-left text-sm font-medium uppercase text-muted-foreground">Rank</th>
                          <th className="pb-4 pl-2 text-left text-sm font-medium uppercase text-muted-foreground">Name</th>
                          <th className="pb-4 text-left text-sm font-medium uppercase text-muted-foreground">Referrals</th>
                          <th className="pb-4 text-right sm:text-left text-sm font-medium uppercase text-muted-foreground">Earns</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboardData.map((user) => (
                          <tr key={user.rank} className="border-b border-divider last:border-b-0">
                            <td className="whitespace-nowrap py-4 pr-4 font-semibold text-foreground">#{user.rank}</td>
                            <td className="whitespace-nowrap py-4 px-2 font-medium text-foreground">{user.name}</td>
                            <td className="whitespace-nowrap py-4 px-2 text-muted-foreground">{user.referrals}</td>
                            <td className="whitespace-nowrap py-4 pl-2 font-medium text-primary">{user.rewards}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
            </div>
          </div>
          {/* --- FAQ Card --- */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-8 shadow-sm hover:shadow-xl hover:translate-y-0.5 transition-all duration-500 ease-in-out">
              <h3 className="mb-2 sm:mb-6 text-xl sm:text-2xl font-semibold text-foreground">Frequently Asked Questions</h3>
              {faqData.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralPage;
