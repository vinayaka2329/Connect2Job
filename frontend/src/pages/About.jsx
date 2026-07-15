// src/pages/About.jsx
import { Link } from 'react-router-dom';
import { aboutItems, aboutStats, aboutWhy } from '../data/siteData';
import './About.css';
import AnimatedCounter from '../components/AnimatedCounter';
import guwahatiLogo from "../../images/guwahati logo.png";
import masaiLogo from "../../images/masai.png";
import nsdcLogo from "../../images/NSDC logo.png";


export default function About() {
  return (
    <section className="about-page page-section">
      <div className="container">
        <section className="page-hero" data-aos="fade-up">
          <span className="section-badge">About Us</span>
          <h1>
            About <span className="highlight text-glow">Connect2Job</span>
          </h1>
          <p>Learn more about our mission, vision, and values.</p>
        </section>

        <section className="page-content" data-aos="fade-up">
          <div className="content-wrapper">
            <h2>
              Our <span className="highlight">Mission</span>
            </h2>
            <p className="mission-text">
              Connect2Job is dedicated to bridging the gap between talented professionals and amazing companies.
              We believe that everyone deserves to find their dream career, and we're here to make that journey easier.
            </p>
            <p className="mission-text">
              With thousands of jobs posted and hundreds of companies trusting us, we've become a leading platform for
              job seekers and employers alike.
            </p>

            {/* ================= IIT GUWAHATI RECOGNITION ================= */}

            {/* ================= RECOGNITION SECTION ================= */}

            <section className="recognition-section">

              <div className="recognition-card">

                {/* LOGOS */}

                <div className="recognition-logos">

                  <img
                    src={guwahatiLogo}
                    alt="IIT Guwahati"
                    className="recognition-logo guwahati-recognition-logo"
                  />

                  <img
                    src={nsdcLogo}
                    alt="NSDC"
                    className="recognition-logo nsdc-recognition-logo"
                  />

                  <img
                    src={masaiLogo}
                    alt="Masai"
                    className="recognition-logo masai-recognition-logo"
                  />

                </div>


                {/* DIVIDER */}

                <div className="recognition-divider"></div>


                {/* DETAILS */}

                <div className="recognition-details">

                  <div className="recognition-heading">

                    <span>
                      Certified / Associated with
                    </span>

                    <strong>
                      IIT Guwahati
                    </strong>

                    <span className="recognition-verified">
                      ✓
                    </span>

                  </div>


                  <div className="recognition-meta">

                    <span className="recognition-code">

                      Code:

                      <strong>
                        IITGCS/24091634
                      </strong>

                    </span>


                    <span className="recognition-official">

                      🏅 Official Recognition

                    </span>

                  </div>

                </div>

              </div>

            </section>

            <div className="about-grid">
              {aboutItems.map((item, index) => (
                <div key={index} className="about-item" data-aos="fade-up" data-aos-delay={100 + index * 100}>
                  <div className="icon">
                    <i className={item.icon}></i>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <div className="about-stats">
              {aboutStats.map((stat, index) => (
                <div key={index} className="about-stat" data-aos="zoom-in" data-aos-delay={100 + index * 100}>
                  <h2 className="counter"><AnimatedCounter value={stat.value} /></h2>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* ================= IIT GUWAHATI RECOGNITION ================= */}

            {/* <section className="iit-recognition-section">
              <div className="iit-recognition-card">

                <div className="iit-recognition-left">

                  <div className="iit-recognition-icon">
                    <span>✹</span>
                  </div>

                  <div className="iit-recognition-content">

                    <div className="iit-recognition-title">
                      <span>Certified / Associated with</span>

                      <strong>IIT Guwahati</strong>

                      <span className="iit-verified-icon">
                        ✓
                      </span>
                    </div>

                    <p>
                      Code:
                      <strong>IITGCS/24091634</strong>
                    </p>

                  </div>

                </div>

                <div className="iit-recognition-badge">
                  <span>🏅</span>
                  Official Recognition
                </div>

              </div>
            </section> */}

            <div className="about-why-grid">
              {aboutWhy.map((item, index) => (
                <div key={index} className="about-why-item" data-aos="flip-up" data-aos-delay={100 + index * 100}>
                  <div className="why-icon">
                    <i className={item.icon}></i>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section" data-aos="fade-up" data-aos-duration="800">
          <div className="cta-container">
            <h2>Ready to take the next step in your career?</h2>
            <p>Join thousands of professionals who found their dream roles with Connect2Job.</p>
            <div className="cta-buttons">
              <Link to="/jobs" className="cta-btn-primary">
                <i className="fas fa-search"></i> Explore Jobs
              </Link>
              <Link to="/contact" className="cta-btn-secondary">
                <i className="fas fa-envelope"></i> Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}