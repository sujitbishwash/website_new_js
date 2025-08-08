import { useState } from "react";
import { useThemeColors } from "../../contexts/ThemeContext";

// --- CSS Styles Component ---
// The CSS is included directly in the component to avoid file resolution errors.
const SubscriptionStyles = () => {
  const theme = useThemeColors();

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      /* --- Main Page Styles --- */
      .subscription-page {
        background-color: ${theme.background};
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
          Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: ${theme.primaryText};
      }

      .subscription-container {
        background-color: ${theme.card};
        border: 1px solid ${theme.border};
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
        background-color: ${theme.accent};
        color: ${theme.primaryText};
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
        color: ${theme.primaryText};
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
        color: ${theme.secondaryText};
        margin-top: 4px;
      }

      /* --- Main Content --- */
      .main-title {
        color: ${theme.primaryText};
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
        color: ${theme.primaryText};
      }
      
      .feature-list .sub-text {
          color: ${theme.secondaryText};
          font-size: 0.9rem;
          margin-left: 28px;
      }

      /* --- Pricing Section --- */
      .pricing-section {
        background-color: ${theme.background};
        border: 2px solid ${theme.border};
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 32px;
        position: relative;
      }

      .pricing-section:hover {
        border-color: ${theme.accent};
      }

      .pricing-section .price {
        font-size: 3rem;
        font-weight: 700;
        color: ${theme.primaryText};
        margin: 0;
      }

      .pricing-section .price .currency {
        font-size: 1.5rem;
        vertical-align: top;
      }

      .pricing-section .price .period {
        font-size: 1rem;
        color: ${theme.secondaryText};
        font-weight: 400;
      }

      .pricing-section .original-price {
        color: ${theme.secondaryText};
        text-decoration: line-through;
        font-size: 1.2rem;
        margin: 0 0 8px;
      }

      .pricing-section .discount {
        color: ${theme.secondaryText};
        font-size: 0.9rem;
        margin: 0;
      }

      /* --- CTA Button --- */
      .cta-button {
        background: linear-gradient(90deg, ${theme.gradientFrom}, ${theme.gradientTo});
        color: ${theme.primaryText};
        border: none;
        padding: 16px 32px;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        width: 100%;
        margin-bottom: 16px;
      }

      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(88, 166, 255, 0.3);
      }

      .cta-button:active {
        transform: translateY(0);
      }

      .money-back {
        color: ${theme.secondaryText};
        font-size: 0.9rem;
        margin: 0;
      }

      /* --- Responsive Design --- */
      @media (max-width: 768px) {
        .subscription-page {
          padding: 20px;
        }
        
        .subscription-container {
          padding: 24px;
        }
        
        .main-title {
          font-size: 1.5rem;
        }
        
        .pricing-section .price {
          font-size: 2.5rem;
        }
      }
    `}</style>
  );
};

// --- Main Subscription Page Component ---
const SubscriptionPage = () => {
  const theme = useThemeColors();
  const [selectedPlan, setSelectedPlan] = useState("annual"); // 'annual' or 'monthly'

  const features = [
    "Unlimited uploads, pastes, and records",
    "Unlimited AI chats",
    "Unlimited quiz generation",
    "Unlimited practice exams",
    "Extended voice mode usage",
    "Upload files up to 100 pages / 15 MB",
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z" />
              </svg>
              Limited Time Offer!
            </div>
            <p>
              Get <strong>25% OFF</strong> Premium! Use code:{" "}
              <span className="promo-code">FINALS25</span>
            </p>
            <div className="valid-until">(Valid until April 30)</div>
          </div>

          <h1 className="main-title">Upgrade Your Plan</h1>

          <ul className="feature-list">
            {features.map((feature, index) => (
              <li key={index}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill={theme.success}
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                {feature}
                {feature === "Unlimited AI chats" && (
                  <span className="sub-text">
                    (Learn+ mode: 100 chats/month)
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="plan-selection">
            <div
              className={`plan-card ${
                selectedPlan === "annual" ? "active" : ""
              }`}
              onClick={() => setSelectedPlan("annual")}
            >
              <div className="save-badge">Save 40%</div>
              <h3>Annual</h3>
              <div className="price">
                ₹199<span className="price-per"> / month</span>
              </div>
              <div className="billing-info">Billed annually</div>
            </div>
            <div
              className={`plan-card ${
                selectedPlan === "monthly" ? "active" : ""
              }`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <h3>Monthly</h3>
              <div className="price">
                ₹399<span className="price-per"> / month</span>
              </div>
              <div className="billing-info">Billed monthly</div>
            </div>
          </div>

          <button className="select-plan-button" onClick={handleSelectPlan}>
            Select Plan
          </button>

          <p className="footer-text">
            Join 1M+ learners studying smarter with Ai Padhai
          </p>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
