import "./Home.css";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import heroImage from "../../images/anime.png";
import AnimatedCounter from "../components/AnimatedCounter";

export default function Home() {
  const navigate = useNavigate();

  // ===== TESTIMONIALS DATA =====
  const testimonials = [
    {
      id: 1,
      name: "Aarav Mehta",
      role: "Frontend Engineer",
      text: "Connect2Job gave me fewer listings, but every one was relevant. I landed interviews within one week.",
    },
    {
      id: 2,
      name: "Priya Nair",
      role: "Talent Acquisition Lead",
      text: "The candidate quality is what stands out. Our team spends less time filtering and more time interviewing.",
    },
    {
      id: 3,
      name: "Nisha Rao",
      role: "Product Designer",
      text: "The hiring flow felt clean and premium. I always knew what stage my application was in.",
    },
    {
      id: 4,
      name: "Rahul Verma",
      role: "Software Engineer • Infosys",
      text: "Connect2Job made my job search incredibly smooth. The platform is clean, easy to navigate, and I landed multiple interview opportunities within a short time.",
    },
    {
      id: 5,
      name: "Priya Sharma",
      role: "Frontend Developer • TCS",
      text: "The application tracking feature kept everything organized. The interface is fast, professional, and made applying for jobs completely hassle-free.",
    },
    {
      id: 6,
      name: "Sneha Patel",
      role: "HR Manager • Wipro",
      text: "Posting jobs and reviewing applications has never been easier. Connect2Job helped us connect with quality candidates quickly and efficiently.",
    },
  ];

  // Determine cards per slide based on window width
  const getCardsPerSlide = () => (window.innerWidth < 768 ? 1 : 2);

  const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const totalSlides = Math.ceil(testimonials.length / cardsPerSlide);

  // Responsive resize handler
  useEffect(() => {
    const handleResize = () => {
      const newCardsPerSlide = getCardsPerSlide();
      if (newCardsPerSlide !== cardsPerSlide) {
        setCardsPerSlide(newCardsPerSlide);
        setCurrentSlide(0); // reset to first slide when layout changes
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cardsPerSlide]);

  // Reset slide if it exceeds total slides
  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(0);
    }
  }, [totalSlides, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-slide
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, totalSlides]);

  const pauseAutoPlay = () => setIsAutoPlaying(false);
  const resumeAutoPlay = () => setIsAutoPlaying(true);

  // Get the cards for the current slide
  const startIndex = currentSlide * cardsPerSlide;
  const visibleCards = testimonials.slice(startIndex, startIndex + cardsPerSlide);

  // Pad with empty placeholders if needed on last slide
  const padding = cardsPerSlide - visibleCards.length;
  const cardsToRender = [...visibleCards, ...Array(padding).fill(null)];

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
            <span className="hero-badge">✨ AI Powered Hiring Platform</span>
            <h1>
              Find Your
              <br />
              <span>Dream Career</span>
            </h1>
            <p>Shape Your Future With A Career that Matches Your Ambition!</p>
            <div className="hero-buttons">
              <button onClick={() => navigate("/jobs")}>Browse Jobs</button>
              <button className="outline" onClick={() => navigate("/contact")}>
                Hire Talent
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <h2><AnimatedCounter value="10K+" /></h2>
                <p>Jobs</p>
              </div>
              <div>
                <h2><AnimatedCounter value="5K+" /></h2>
                <p>Companies</p>
              </div>
              <div>
                <h2><AnimatedCounter value="25K+" /></h2>
                <p>Candidates</p>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-glow"></div>
            <img src={heroImage} alt="Connect2Job" />
            <div className="floating-card top">
              <h3><AnimatedCounter value="10K+" /></h3>
              <p>Jobs Available</p>
            </div>
            <div className="floating-card bottom">
              <h3><AnimatedCounter value="5K+" /></h3>
              <p>Companies Hiring</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="services-section">
        <span className="section-tag">SERVICES</span>
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

      {/* ================= WHY CHOOSE US ================= */}
      <section className="why-section">
        <div className="why-left">
          <span className="section-tag">WHY CHOOSE US</span>
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

      {/* ================= TESTIMONIALS – TWO-CARD CAROUSEL ================= */}
      <section className="testimonial-section">
        <div className="testimonial-header">
          <span className="section-tag">TESTIMONIALS</span>
          <h2>
            Trusted by people building
            <br />
            their next chapter.
          </h2>
          <div className="rating-box">
            ⭐ ⭐ ⭐ ⭐ ⭐
            <span>4.9 / 5</span>
          </div>
        </div>

        <div
          className="testimonial-carousel-wrapper"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          <button className="carousel-btn prev" onClick={prevSlide}>
            ◀
          </button>

          <div className="carousel-track">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="carousel-slide"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {cardsToRender.map((testimonial, idx) => (
                  <div
                    key={testimonial ? testimonial.id : `empty-${idx}`}
                    className="testimonial-card-wrapper"
                  >
                    {testimonial ? (
                      <div className="testimonial-card">
                        <div className="quote">❝</div>
                        <p>{testimonial.text}</p>
                        <h4>{testimonial.name}</h4>
                        <span>{testimonial.role}</span>
                      </div>
                    ) : (
                      <div className="testimonial-card-placeholder" />
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="carousel-btn next" onClick={nextSlide}>
            ▶
          </button>
        </div>

        <div className="carousel-dots">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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