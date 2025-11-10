import { ROUTES } from "@/routes/constants";
import { Link } from "react-router-dom";


// Final Call to Action Section
export const FinalCTA = () => (
  <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
    {/* Layer 1: Background image (bottom) */}
    
    <div className="container mx-auto">
      <div className="bg-white/10 dark:bg-zinc-900/40 backdrop-blur-2xl rounded-3xl p-10 text-center shadow-2xl border border-white/20 dark:border-zinc-800/50">
        <h3 className="text-4xl md:text-5xl font-semibold mb-4 text-white">
          Join {" "}
          <span
            className="font-[100] italic"
            style={{ fontFamily: '"Instrument Serif", serif' }}
          >
            <span className="text-4xl md:text-5xl">
              3k+ Students
            </span>
          </span>{" "} Already Crushing Their Exams
        </h3>
        <p className="text-lg text-zinc-500 mb-8 max-w-2xl mx-auto">
          Get started with a free trial today—no credit card required.
        </p>
        <Link to={ROUTES.LOGIN} className="hover:cursor-pointer text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-xl hover:shadow-[0_0_20px_6px_rgba(96,165,250,0.6)] bg-gradient-to-br from-blue-400/50 via-blue-500/30 to-indigo-600/20 backdrop-blur-xl border border-blue-400/50 hover:border-blue-400/80">
          Start Learning for Free
        </Link>
      </div>
    </div>
  </section>
);