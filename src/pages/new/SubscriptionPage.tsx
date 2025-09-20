import { theme } from "@/styles/theme";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Main Subscription Page Component ---
const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("annual"); // 'annual' or 'monthly'
  const navigate = useNavigate();

  const features = [
    "Unlimited uploads, pastes, and records",
    "Unlimited AI chats (100 chats/month)",
    "Unlimited quiz generation",
    "Unlimited practice exams",
    "Extended voice mode usage",
    "Upload files up to 100 pages / 15 MB",
  ];

  const handleSelectPlan = () => {
    // Calculate the amount based on selected plan
    const amount = selectedPlan === "annual" ? 199 * 12 : 399; // Annual: 199/month * 12, Monthly: 399
    // In a real app, you would handle the checkout process here
    navigate("/payment", { state: { amount } });
  };

  // Function to go back to the previous page using standard browser history
  const handleClose = () => {
    window.history.back();
  };

  return (
    <>
      <div className="justify-items-center mx-4 my-20 sm:m-10">
        <button
          className="absolute top-4 right-4 p-2 text-gray-400 rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer hidden sm:block"
          onClick={handleClose}
          onMouseOver={(e) => (e.currentTarget.style.color = theme.primaryText)}
          onMouseOut={(e) =>
            (e.currentTarget.style.color = theme.secondaryText)
          }
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative bg-card border border-border rounded-2xl p-4 sm:p-8 max-w-[600px] w-full text-center">
          {<div className="mb-8 rounded-xl border border-primary/20 p-4 bg-accent">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.8rem] font-semibold bg-primary text-white">
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
              <span className="font-bold bg-[rgba(88,166,255,0.15)] px-1.5 py-0.5 rounded border border-[rgba(88,166,255,0.3)]">
                FINALS25
              </span>
            </p>
            <div className="mt-1 text-xs text-[#8b949e]">
              (Valid until April 30)
            </div>
          </div>}

          <h1 className="text-foreground text-2xl sm:text-[2.5rem] font-bold mb-[1.5rem]">
            Upgrade Your Plan
          </h1>

          <p className="text-muted-foreground max-w-[450px] ml-auto mr-auto mb-[2.5rem]">
            Unlock all premium features and accelerate your learning.
          </p>
          <ul className="list-none p-0 m-0 mb-8 text-left inline-block">
            {features.map((feature, index) => (
              <li
                className="flex items-center gap-3 mb-3 text-base text-muted-foreground"
                key={index}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#238636"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div
              className={`relative rounded-xl border-1 p-4 sm:p-6 cursor-pointer transition-colors duration-300 ${
                selectedPlan === "annual"
                  ? "bg-accent border-primary"
                  : "border-border bg-background-subtle"
              }`}
              onClick={() => setSelectedPlan("annual")}
            >
              <div className="absolute top-4 right-4 bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-[0.75rem] font-semibold">
                Save 40%
              </div>
              <h3 className="text-foreground text-xl mb-2 font-semibold">Annual</h3>
              <div className="text-foreground text-[2.25rem] font-bold">
                ₹199
                <span className="text-muted-foreground text-base">
                  {" "}
                  / month
                </span>
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                Billed annually
              </div>
            </div>
            <div
              className={`relative rounded-xl border-1 p-4 sm:p-6 cursor-pointer transition-colors duration-300 ${
                selectedPlan === "monthly"
                  ? "bg-accent border-primary"
                  : "border-border bg-background-subtle"
              }`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <h3 className="text-foreground text-xl mb-2 font-semibold">Monthly</h3>
              <div className="text-foreground text-[2.25rem] font-bold">
                ₹399
                <span className="text-muted-foreground text-base">
                  {" "}
                  / month
                </span>
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                Billed monthly
              </div>
            </div>
          </div>

          <button
            className="w-full rounded-md bg-primary text-white border-none py-3.5 text-lg font-semibold cursor-pointer transition-opacity duration-300 hover:opacity-90"
            onClick={handleSelectPlan}
          >
            Select Plan
          </button>

          <p className="mt-4 text-sm text-muted-foreground">
            Trusted by over 1M+ students
          </p>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
