import { useState } from "react";

// --- CSS Styles Component ---
// The CSS is included directly in the component to avoid file resolution errors.
const ReferralStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .referral-page {
      /* New: Added a subtle radial gradient for depth */
      background-color: #0d1117;
      background-image: radial-gradient(circle at top, rgba(56, 139, 253, 0.1), transparent 40%);
      min-height: 100vh;
      padding: 40px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      color: #c9d1d9;
    }

    .referral-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .referral-card {
      background-color: #161b22;
      border: 1px solid #30363d;
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
      color: #f0f6fc;
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
      color: #f0f6fc;
      margin: 0;
      /* New: Added text shadow for emphasis */
      text-shadow: 0 0 15px rgba(88, 166, 255, 0.3);
    }
    .referral-header .subtitle {
      font-size: 1.2rem;
      color: #8b949e;
      margin: 8px 0 0;
    }
    .referral-header .subtitle span {
        color: #2ea043; /* Brighter green */
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
        color: #f0f6fc;
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
        background: #161b22;
        padding: 16px;
        border-radius: 8px;
        font-weight: 500;
        border: 1px solid #30363d;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .premium-unlock-section .footer-text {
        color: #8b949e;
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
      background-color: #0d1117;
      border: 1px dashed #484f58;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #f0f6fc;
      letter-spacing: 1px;
    }

    .copy-button {
      background-color: #238636;
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
      background-color: #2ea043;
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
      background-color: #0d1117;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid transparent;
      transition: border-color 0.3s ease;
    }
    .step-card:hover {
        border-color: #30363d;
    }
    
    .step-card .icon {
        background-color: rgba(88, 166, 255, 0.1);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        border: 1px solid rgba(88, 166, 255, 0.2);
    }

    .step-card h4 {
        margin: 0 0 0.5rem;
        color: #f0f6fc;
    }
    
    .step-card p {
        font-size: 0.9rem;
        color: #8b949e;
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
        color: #8b949e;
        font-weight: 500;
    }

    .stat-item .value {
        font-size: 2rem;
        font-weight: 700;
        color: #f0f6fc;
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
        border-bottom: 1px solid #30363d;
    }

    .leaderboard-table th {
        font-size: 0.9rem;
        color: #8b949e;
        font-weight: 600;
    }
    
    /* New: Zebra-striping for better readability */
    .leaderboard-table tbody tr:nth-child(odd) {
        background-color: #0d1117;
    }

    .leaderboard-table tbody tr:hover {
        background-color: #21262d;
    }
    
    .leaderboard-table td {
        color: #c9d1d9;
    }
    
    .leaderboard-table .rank {
        font-weight: 700;
        color: #58a6ff;
    }
    
    .leaderboard-table .rewards {
        color: #2ea043;
        font-weight: 600;
    }
  `}</style>
);

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
                    fill="#58a6ff"
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
                    fill="#58a6ff"
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
                    fill="#58a6ff"
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
