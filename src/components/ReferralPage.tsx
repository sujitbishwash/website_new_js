 import React, { useState } from 'react';
import './ReferralPage.css'; // Import the stylesheet

// --- Main Referral Page Component ---
const ReferralPage = () => {
  const [copyText, setCopyText] = useState('Copy');
  const referralCode = 'AIPADHAI123XYZ';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Copy'), 2000);
  };

  const leaderboardData = [
    { rank: 1, name: 'Rohan Sharma', referrals: 42, rewards: '₹2100' },
    { rank: 2, name: 'Priya Patel', referrals: 35, rewards: '₹1750' },
    { rank: 3, name: 'Amit Kumar', referrals: 28, rewards: '₹1400' },
    { rank: 4, name: 'Sneha Reddy', referrals: 21, rewards: '₹1050' },
    { rank: 5, name: 'Vikram Singh', referrals: 15, rewards: '₹750' },
  ];

  return (
    <div className="referral-page">
      <div className="referral-container">
        {/* --- Header --- */}
        <div className="referral-header">
          <h1>Refer Friends, Earn Big!</h1>
          <p>Share the love for Ai Padhai & get rewarded for every friend who joins premium.</p>
        </div>

        {/* --- Referral Code Card --- */}
        <div className="referral-card">
          <h3 className="card-title">Your Unique Referral Code</h3>
          <div className="referral-code-section">
            <div className="referral-code-box">{referralCode}</div>
            <button onClick={handleCopy} className={`copy-button ${copyText === 'Copied!' ? 'copied' : ''}`}>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#58a6ff" viewBox="0 0 16 16"><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>
              </div>
              <h4>Share Your Code</h4>
              <p>Share your unique referral code with your friends via social media or direct message.</p>
            </div>
            <div className="step-card">
               <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#58a6ff" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>
              </div>
              <h4>Friend Signs Up</h4>
              <p>Your friend signs up for an Ai Padhai premium plan using your referral code.</p>
            </div>
            <div className="step-card">
               <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#58a6ff" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/></svg>
              </div>
              <h4>You Get Rewarded</h4>
              <p>You receive cash rewards for every successful referral. It's that simple!</p>
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
              {leaderboardData.map(user => (
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
  );
};

export default ReferralPage;
