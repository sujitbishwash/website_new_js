import { useState } from "react";
import { useThemeColors } from "../../contexts/ThemeContext";

// --- CSS Styles Component ---
// The CSS is included directly in the component to avoid file resolution errors.
const ReferralStyles = () => {
  const theme = useThemeColors();

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      .referral-page {
        /* New: Added a subtle radial gradient for depth */
        background-color: ${theme.background};
        background-image: radial-gradient(circle at top, rgba(56, 139, 253, 0.1), transparent 40%);
        min-height: 100vh;
        padding: 40px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
          Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: ${theme.primaryText};
      }

      .referral-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .referral-card {
        background-color: ${theme.card};
        border: 1px solid ${theme.border};
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
        text-shadow: 0 0 15px rgba(88, 166, 255, 0.3);
      }
      .referral-header .subtitle {
        font-size: 1.2rem;
        color: ${theme.secondaryText};
        margin: 8px 0 0;
      }
      .referral-header .subtitle span {
          color: ${theme.success};
          font-weight: 700;
      }

      /* --- Premium Unlock Section --- */
      .premium-unlock-section {
          background: linear-gradient(90deg, rgba(56, 139, 253, 0.1), rgba(4, 88, 207, 0.2));
          border: 1px solid rgba(88, 166, 255, 0.3);
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
      }

      .premium-unlock-section p {
        color: ${theme.secondaryText};
        margin: 0 0 1.5rem;
      }

      .premium-unlock-section .unlock-button {
        background-color: ${theme.success};
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .premium-unlock-section .unlock-button:hover {
        background-color: ${theme.success};
        opacity: 0.9;
      }

      .premium-unlock-section .unlock-button:active {
        background-color: ${theme.accent};
      }

      /* --- Referral Link Section --- */
      .referral-link-section {
        background-color: ${theme.background};
        border: 1px dashed ${theme.border};
        border-radius: 12px;
        padding: 24px;
        text-align: center;
      }

      .referral-link-section h3 {
        color: ${theme.primaryText};
        margin: 0 0 1rem;
      }

      .referral-link-section .copy-button {
        background-color: ${theme.success};
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .referral-link-section .copy-button:hover {
        background-color: ${theme.success};
        opacity: 0.9;
      }

      .referral-link-section .copy-button:active {
        background-color: ${theme.accent};
      }

      /* --- Stats Section --- */
      .stats-section {
        background-color: ${theme.background};
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .stat-card {
        background-color: ${theme.card};
        border: 1px solid ${theme.border};
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
      }

      .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: ${theme.primaryText};
        margin: 0;
      }

      .stat-label {
        color: ${theme.secondaryText};
        margin: 0.5rem 0 0;
        font-size: 0.875rem;
      }

      /* --- Referral History --- */
      .referral-history {
        background-color: ${theme.background};
      }

      .history-table {
        width: 100%;
        border-collapse: collapse;
      }

      .history-table th {
        background-color: ${theme.card};
        color: ${theme.secondaryText};
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid ${theme.border};
        font-weight: 500;
      }

      .history-table td {
        padding: 12px;
        border-bottom: 1px solid ${theme.border};
        color: ${theme.primaryText};
      }

      .history-table tr:hover {
        background-color: ${theme.background};
      }

      .status-pending {
        color: ${theme.secondaryText};
      }

      .status-completed {
        color: ${theme.accent};
      }

      .status-rewarded {
        color: ${theme.success};
      }

      /* --- Responsive Design --- */
      @media (max-width: 768px) {
        .referral-page {
          padding: 20px;
        }
        
        .referral-header h1 {
          font-size: 2rem;
        }
        
        .stats-grid {
          grid-template-columns: 1fr;
        }
        
        .history-table {
          font-size: 0.875rem;
        }
      }
    `}</style>
  );
};

// --- Main Referral Page Component ---
const ReferralPage = () => {
  const theme = useThemeColors();
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

  const premiumFeatures = [
    "✨ Unlimited Questions",
    "💬 Unlimited AI Chats",
    "📝 Free Quizzes & Mock Tests",
    "📊 Detailed Performance Reports",
  ];

  return (
    <>
      <ReferralStyles />
      <div className="referral-page">
        <div className="referral-container">
          {/* --- Header --- */}
          <div className="referral-header">
            <h1>Refer Friends, Earn Big!</h1>
            <p className="subtitle">
              Share AI Padhai & Earn <span>₹50</span> for Every Friend Who
              Joins!
            </p>
          </div>

          {/* --- Premium Unlock Section --- */}
          <div className="premium-unlock-section">
            <h2>Plus, unlock a FREE 1-Month Premium Subscription!</h2>
            <p>Enjoy unlimited access when your first referral signs up:</p>
            <ul className="premium-features-list">
              {premiumFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <p className="footer-text">Start sharing your unique code today!</p>
          </div>

          {/* --- Referral Code Card --- */}
          <div className="referral-card">
            <h3 className="card-title">Your Unique Referral Code</h3>
            <div className="referral-code-section">
              <div className="referral-code-box">{referralCode}</div>
              <button
                onClick={handleCopy}
                className={`copy-button ${
                  copyText === "Copied!" ? "copied" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zM-1 8a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H-.5A.5.5 0 0 1-1 8z" />
                </svg>
                {copyText}
              </button>
            </div>
          </div>

          {/* --- How It Works Card --- */}
          <div className="referral-card">
            <h3 className="card-title">How It Works</h3>
            <div className="how-it-works-grid">
              <div className="step-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill={theme.accent}
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                  </svg>
                </div>
                <h4>Share Your Code</h4>
                <p>
                  Share your unique referral code with your friends via social
                  media or direct message.
                </p>
              </div>
              <div className="step-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill={theme.accent}
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                </div>
                <h4>Friend Signs Up</h4>
                <p>
                  Your friend signs up for an Ai Padhai premium plan using your
                  referral code.
                </p>
              </div>
              <div className="step-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill={theme.accent}
                    viewBox="0 0 16 16"
                  >
                    <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                    <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z" />
                  </svg>
                </div>
                <h4>You Get Rewarded</h4>
                <p>
                  You receive cash rewards for every successful referral. It's
                  that simple!
                </p>
              </div>
            </div>
          </div>

          {/* --- Stats Card --- */}
          <div className="referral-card">
            <h3 className="card-title">Your Referral Status</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <h4>Friends Referred</h4>
                <div className="value">12</div>
              </div>
              <div className="stat-item">
                <h4>Rewards Earned</h4>
                <div className="value">₹1150</div>
              </div>
              <div className="stat-item">
                <h4>Pending Rewards</h4>
                <div className="value">₹450</div>
              </div>
            </div>
          </div>

          {/* --- Leaderboard Card --- */}
          <div className="referral-card">
            <h3 className="card-title">Referral Leaderboard</h3>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Referrals</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user) => (
                  <tr key={user.rank}>
                    <td className="rank">#{user.rank}</td>
                    <td>{user.name}</td>
                    <td>{user.referrals}</td>
                    <td className="rewards">{user.rewards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralPage;
