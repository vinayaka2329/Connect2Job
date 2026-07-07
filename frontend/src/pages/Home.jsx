import "./Home.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "../../images/anime.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">

      {/* ================= HERO ================= */}
      <section className="hero-section">
        <div className="hero-container">

          {/* Left */}
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">
              ✨ AI Powered Hiring Platform
            </span>

            <h1>
              Find Your
              <br />
              <span>Dream Career</span>
            </h1>

            <p>
              Shape Your Future With A Career that Matches Your Ambition!
            </p>

            <div className="hero-buttons">
              <button onClick={() => navigate("/jobs")}>
                Browse Jobs
              </button>

              <button
                className="outline"
                onClick={() => navigate("/contact")}
              >
                Hire Talent
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <h2>10K+</h2>
                <p>Jobs</p>
              </div>

              <div>
                <h2>5K+</h2>
                <p>Companies</p>
              </div>

              <div>
                <h2>25K+</h2>
                <p>Candidates</p>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, scale: .9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: .8 }}
          >
            <div className="hero-glow"></div>

            <img src={heroImage} alt="Connect2Job" />

            <div className="floating-card top">
              <h3>10K+</h3>
              <p>Jobs Available</p>
            </div>

            <div className="floating-card bottom">
              <h3>5K+</h3>
              <p>Companies Hiring</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= SERVICES ================= */}

      <section className="services-section">

        <span className="section-tag">
          SERVICES
        </span>

        <h2>
          Hiring tools with a premium,
          <br />
          human rhythm.
        </h2>

        <p>
          A focused platform for candidates and companies that makes hiring
          smarter, faster and more transparent.
        </p>

        <div className="services-grid">

          <div className="service-card">
            <div className="service-icon">💼</div>
            <h3>Smart Job Discovery</h3>
            <p>
              AI-powered recommendations matching your skills,
              interests and experience.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">👥</div>
            <h3>Talent Shortlisting</h3>
            <p>
              Employers receive better candidate matches with
              intelligent filtering.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">📈</div>
            <h3>Career Positioning</h3>
            <p>
              Resume optimization, profile scoring and career
              guidance for better visibility.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">🤝</div>
            <h3>Recruitment Support</h3>
            <p>
              End-to-end hiring support from application
              tracking to onboarding.
            </p>
          </div>

        </div>

      </section>

      <section className="why-section">

        <div className="why-left">

          <span className="section-tag">
            WHY CHOOSE US
          </span>

          <h2>
            Built for serious career moves
            <br />
            and confident hiring.
          </h2>

          <p>
            Connect2Job keeps the hiring experience clean, transparent,
            and focused on matching the right talent with the right opportunity.
          </p>

          <ul className="why-list">
            <li>✔ Verified companies and trusted employers</li>
            <li>✔ AI-powered candidate matching</li>
            <li>✔ Application tracking in real time</li>
            <li>✔ Premium hiring experience</li>
          </ul>

        </div>

        <div className="why-right">

          <div className="dashboard-card">

            <h4>CONNECT2JOB SIGNAL</h4>

            <h2>High-intent hiring dashboard</h2>

            <div className="dashboard-grid">

              <div>
                <h3>92%</h3>
                <span>Precision Match</span>
              </div>

              <div>
                <h3>3x</h3>
                <span>Faster Screening</span>
              </div>

              <div>
                <h3>100%</h3>
                <span>Trusted Profiles</span>
              </div>

            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>

          </div>

        </div>

      </section>

      {/* ================= TESTIMONIALS ================= */}

      <section className="testimonial-section">

        <span className="section-tag">
          TESTIMONIALS
        </span>

        <div className="testimonial-header">

          <div>
            <h2>
              Trusted by people building
              <br />
              their next chapter.
            </h2>
          </div>

          <div className="rating-box">
            ⭐ ⭐ ⭐ ⭐ ⭐
            <span>4.9 / 5</span>
          </div>

        </div>

        <div className="testimonial-grid">

          <div className="testimonial-card">

            <div className="quote">❝</div>

            <p>
              Connect2Job gave me fewer listings, but every one was
              relevant. I landed interviews within one week.
            </p>

            <h4>Aarav Mehta</h4>

            <span>Frontend Engineer</span>

          </div>

          <div className="testimonial-card">

            <div className="quote">❝</div>

            <p>
              The candidate quality is what stands out. Our team spends
              less time filtering and more time interviewing.
            </p>

            <h4>Priya Nair</h4>

            <span>Talent Acquisition Lead</span>

          </div>

          <div className="testimonial-card">

            <div className="quote">❝</div>

            <p>
              The hiring flow felt clean and premium. I always knew what
              stage my application was in.
            </p>

            <h4>Nisha Rao</h4>

            <span>Product Designer</span>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="home-cta-wrapper">
        <div className="home-cta-left">
          <span className="section-tag">START TODAY</span>
          <h2>
            Ready to connect with
            <br />
            better jobs and
            <br />
            better talent?
          </h2>
          <p>
            Create your profile, browse premium opportunities,
            or partner with Connect2Job to build your next team.
          </p>
          <div className="home-cta-buttons">
            <button className="home-cta-btn-primary" onClick={() => navigate("/jobs")}>
              Browse Jobs
            </button>
            <button className="home-cta-btn-secondary" onClick={() => navigate("/contact")}>
              Hire Talent
            </button>
          </div>
        </div>

        <div className="home-cta-right">
          <div className="home-cta-card">
            <div className="home-cta-icon">💼</div>
            <div className="home-cta-card-content">
              <h3>For Job Seekers</h3>
              <p>
                Find premium opportunities matching your skills,
                passion and career goals.
              </p>
            </div>
          </div>

          <div className="home-cta-card">
            <div className="home-cta-icon">🏢</div>
            <div className="home-cta-card-content">
              <h3>For Employers</h3>
              <p>
                Hire verified candidates with AI-powered
                recruitment tools and faster shortlisting.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}


