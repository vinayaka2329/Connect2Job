// src/pages/About.jsx
import { Link } from 'react-router-dom';
import { aboutItems, aboutStats, aboutWhy } from '../data/siteData';
import './About.css';
import AnimatedCounter from '../components/AnimatedCounter';


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