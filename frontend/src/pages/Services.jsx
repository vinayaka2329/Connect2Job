import { Link } from "react-router-dom";
import { serviceCards } from "../data/siteData";
import "./Services.css";
import AnimatedCounter from "../components/AnimatedCounter";
import boyMascot from "../../images/c2j boy.png";
import girlMascot from "../../images/c2j girl.png";


export default function Services() {
  return (
    <section className="services-page">

      {/* ================= HERO ================= */}

      <section className="services-hero" data-aos="fade-up">

        {/* Decorative Mascots */}
        {/* <div className="hero-mascot mascot-left">
          <img src={boyMascot} alt="" className="mascot-image" />
        </div>
        <div className="hero-mascot mascot-right">
          <img src={girlMascot} alt="" className="mascot-image" />
        </div> */}

        <span className="hero-badge">
          ✨ Premium Recruitment Solutions
        </span>

        <h1>
          What We
          <span> Offer</span>
        </h1>

        <p className="hero-description">
          Discover powerful hiring solutions designed for every industry,
          helping job seekers and employers connect faster, smarter,
          and with complete confidence.
        </p>

        <div className="hero-stats">

          <div>
            <h2><AnimatedCounter value="10K+" /></h2>
            <span>Jobs</span>
          </div>

          <div>
            <h2><AnimatedCounter value="5K+" /></h2>
            <span>Companies</span>
          </div>

          <div>
            <h2><AnimatedCounter value="25K+" /></h2>
            <span>Candidates</span>
          </div>

        </div>

      </section>

      {/* ================= SERVICES ================= */}

      <section className="services-grid-container">

        {serviceCards.map((service, index) => (

          <div
            key={service.title}
            className="service-card-custom"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >

            <div className="service-badge">
              {service.badge}
            </div>

            <div className="service-icon-wrapper">
              <i className={service.icon}></i>
            </div>

            <div className="service-number">
              {String(index + 1).padStart(2, "0")}
            </div>

            <h3>{service.title}</h3>

            <p>{service.description}</p>

            <div className="service-tags">

              {service.tags.map((tag) => (

                <span key={tag}>
                  {tag}
                </span>

              ))}

            </div>

          </div>

        ))}

      </section>

      {/* ================= CTA ================= */}

      <section
        className="cta-section"
        data-aos="fade-up"
      >

        <div className="cta-container">

          <h2>
            Start Your Journey Today
          </h2>

          <p>
            Explore our services and take the first step
            towards your dream career.
          </p>

          <div className="cta-buttons">

            <Link
              to="/jobs"
              className="cta-btn-primary"
            >
              Find Jobs
            </Link>

            <Link
              to="/contact"
              className="cta-btn-secondary"
            >
              Get Started
            </Link>

          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

<section className="how-it-works" data-aos="fade-up">

  <div className="section-heading">

    <span>How It Works</span>

    <h2>Get Your Dream Job In 4 Simple Steps</h2>

    <p>
      Connect2Job makes your hiring journey simple,
      fast and completely hassle-free.
    </p>

  </div>

  <div className="steps-container">

    <div
      className="step-card"
      data-aos="zoom-in"
      data-aos-delay="100"
    >

      <div className="step-number">
        01
      </div>

      <div className="step-icon">
        <i className="fa-solid fa-user-plus"></i>
      </div>

      <h3>Create Profile</h3>

      <p>
        Register your account and build your professional profile.
      </p>

    </div>

    <div
      className="step-card"
      data-aos="zoom-in"
      data-aos-delay="200"
    >

      <div className="step-number">
        02
      </div>

      <div className="step-icon">
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      <h3>Search Jobs</h3>

      <p>
        Browse thousands of verified opportunities that match your skills.
      </p>

    </div>

    <div
      className="step-card"
      data-aos="zoom-in"
      data-aos-delay="300"
    >

      <div className="step-number">
        03
      </div>

      <div className="step-icon">
        <i className="fa-solid fa-paper-plane"></i>
      </div>

      <h3>Apply Instantly</h3>

      <p>
        Submit applications with just one click using your profile.
      </p>

    </div>

    <div
      className="step-card"
      data-aos="zoom-in"
      data-aos-delay="400"
    >

      <div className="step-number">
        04
      </div>

      <div className="step-icon">
        <i className="fa-solid fa-briefcase"></i>
      </div>

      <h3>Get Hired</h3>

      <p>
        Connect with recruiters and start your dream career.
      </p>

    </div>

  </div>

</section>

    </section>
  );
}