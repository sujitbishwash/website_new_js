import React, { useState } from 'react';

// --- CSS Styles Component ---
// The CSS is included directly in the component to avoid file resolution errors.
const SubscriptionStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* --- Main Page Styles --- */
    .subscription-page {
      background-color: #0d1117;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      color: #c9d1d9;
    }

    .subscription-container {
      background-color: #161b22;
      border: 1px solid #30363d;
      border-radius: 16px;
      padding: 32px;
      max-width: 600px;
      width: 100%;
      text-align: center;
    }

    /* --- Offer Banner --- */
    .offer-banner {
      background: linear-gradient(90deg, rgba(56, 139, 253, 0.1), rgba(4, 88, 207, 0.2));
      border: 1px solid rgba(88, 166, 255, 0.3);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 32px;
    }
    
    .offer-banner .limited-time {
      background-color: #1f6feb;
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.8rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .offer-banner p {
      margin: 8px 0 0;
      font-size: 1rem;
      color: #f0f6fc;
    }

    .offer-banner .promo-code {
      font-weight: 700;
      background-color: rgba(88, 166, 255, 0.15);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(88, 166, 255, 0.3);
    }

    .offer-banner .valid-until {
      font-size: 0.8rem;
      color: #8b949e;
      margin-top: 4px;
    }

    /* --- Main Content --- */
    .main-title {
      color: #f0f6fc;
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 24px;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0 0 32px;
      text-align: left;
      display: inline-block;
    }

    .feature-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 1rem;
      color: #c9d1d9;
    }
    
    .feature-list .sub-text {
        color: #8b949e;
        font-size: 0.9rem;
        margin-left: 4px;
    }

    /* --- Plan Selection --- */
    .plan-selection {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 32px;
    }

    .plan-card {
      background-color: #0d1117;
      border: 2px solid #30363d;
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: border-color 0.3s ease, background-color 0.3s ease;
      position: relative;
    }

    .plan-card.active {
      border-color: #58a6ff;
      background-color: rgba(88, 166, 255, 0.1);
    }
    
    .plan-card h3 {
        margin: 0 0 8px;
        font-size: 1.25rem;
        color: #f0f6fc;
    }
    
    .plan-card .price {
        font-size: 2.25rem;
        font-weight: 700;
        color: #f0f6fc;
    }

    .plan-card .price-per {
        font-size: 1rem;
        color: #8b949e;
    }

    .plan-card .billing-info {
        font-size: 0.8rem;
        color: #8b949e;
        margin-top: 4px;
    }

    .save-badge {
        position: absolute;
        top: 16px;
        right: 16px;
        background-color: #238636;
        color: #ffffff;
        padding: 4px 8px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    /* --- Button and Footer --- */
    .select-plan-button {
      background: linear-gradient(90deg, #388bfd, #1f6feb);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 14px;
      font-size: 1rem;
      font-weight: 600;
      width: 100%;
      cursor: pointer;
      transition: opacity 0.3s ease;
    }

    .select-plan-button:hover {
      opacity: 0.9;
    }

    .footer-text {
      margin-top: 16px;
      font-size: 0.9rem;
      color: #8b949e;
    }
  `}</style>
);

// --- Main Subscription Page Component ---
const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('annual'); // 'annual' or 'monthly'

  const features = [
    "Unlimited uploads, pastes, and records",
    "Unlimited AI chats",
    "Unlimited quiz generation",
    "Unlimited practice exams",
    "Extended voice mode usage",
    "Upload files up to 100 pages / 15 MB"
  ];

  const handleSelectPlan = () => {
    // In a real app, you would handle the checkout process here
    alert(`You have selected the ${selectedPlan} plan.`);
  };

  return (
    <>
      <SubscriptionStyles />
      <div className="subscription-page">
        <div className="subscription-container">
          <div className="offer-banner">
            <div className="limited-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z"/>
              </svg>
              Limited Time Offer!
            </div>
            <p>Get <strong>25% OFF</strong> Premium! Use code: <span className="promo-code">FINALS25</span></p>
            <div className="valid-until">(Valid until April 30)</div>
          </div>

          <h1 className="main-title">Upgrade Your Plan</h1>

          <ul className="feature-list">
            {features.map((feature, index) => (
              <li key={index}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#238636" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                {feature}
                {feature === "Unlimited AI chats" && <span className="sub-text">(Learn+ mode: 100 chats/month)</span>}
              </li>
            ))}
          </ul>

          <div className="plan-selection">
            <div 
              className={`plan-card ${selectedPlan === 'annual' ? 'active' : ''}`}
              onClick={() => setSelectedPlan('annual')}
            >
              <div className="save-badge">Save 40%</div>
              <h3>Annual</h3>
              <div className="price">₹199<span className="price-per"> / month</span></div>
              <div className="billing-info">Billed annually</div>
            </div>
            <div 
              className={`plan-card ${selectedPlan === 'monthly' ? 'active' : ''}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <h3>Monthly</h3>
              <div className="price">₹399<span className="price-per"> / month</span></div>
              <div className="billing-info">Billed monthly</div>
            </div>
          </div>

          <button className="select-plan-button" onClick={handleSelectPlan}>
            Select Plan
          </button>

          <p className="footer-text">Join 1M+ learners studying smarter with Ai Padhai</p>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
