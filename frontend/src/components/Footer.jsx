import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import footerLogo from "../../images/image.png";
import boyCharacter from "../../images/c2j boy.png";
import girlCharacter from "../../images/c2j girl.png";
import "./Footer.css";

const socialLinks = [
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "Twitter", icon: FaTwitter, href: "#" },
  { label: "LinkedIn", icon: FaLinkedinIn, href: "https://www.linkedin.com/company/connect2future/" },
  { label: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/_connect2future__?utm_source=qr" },
  { label: "YouTube", icon: FaYoutube, href: "#" },
];

export default function Footer() {
  const { showToast } = useAppContext();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      showToast("Please login to subscribe.", "warning");
      navigate("/login");
      return;
    }

    if (!email.trim()) {
      showToast("Please enter an email address", "error");
      return;
    }

    try {
      await api.subscribe(email);
      showToast("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      showToast(error.message || "Subscription failed", "error");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link to="/" className="footer-logo">
              <img
                src={footerLogo}
                alt="Connect2Job"
                className="footer-brand-logo"
              />
            </Link>
            <p>
              Connecting talent with premium opportunities and helping companies hire with clarity, speed, and confidence.
            </p>
            <div className="social-links">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} aria-label={item.label}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/jobs">Jobs</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>For Employers</h4>
            <ul>
              <li><Link to="/jobs">Post a Job</Link></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Recruitment Solutions</a></li>
              <li><Link to="/admin">Employer Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <ul>
              <li><MapPin size={18} /> Mysuru, India</li>
              <li><Phone size={18} /> +91 70190 45849</li>
              <li>
                <Mail size={18} />
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=hr@connect2future.com&su=Inquiry%20from%20Connect2Job%20Website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-email"
                >
                  hr@connect2future.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================
            NEWSLETTER WITH CHARACTERS
        ======================================== */}
        <div className="newsletter-wrapper">
          {/* Boy Character - Left */}
          <div className="newsletter-boy">
            <div className="character-glow"></div>
            <img
              src={boyCharacter}
              alt="Character"
              className="character-image"
            />
          </div>

          {/* Newsletter Card */}
          <div className="newsletter-section">
            <div className="newsletter-content">
              <h3>Get premium job updates</h3>
              <p>Fresh opportunities, hiring insights, and career tips delivered to your inbox.</p>
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <button type="submit">
                  <Send size={17} />
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Girl Character - Right */}
          <div className="newsletter-girl">
            <div className="character-glow"></div>
            <img
              src={girlCharacter}
              alt="Character"
              className="character-image"
            />
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Connect2Job. All Rights Reserved.</p>
          <p>Made for better careers and better hiring.</p>
        </div>
      </div>
    </footer>
  );
}
