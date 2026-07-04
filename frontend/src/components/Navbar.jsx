import "./Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../../images/image.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Get first name only
  const getFirstName = (fullName) => {
    if (!fullName) return "User";
    return fullName.split(" ")[0];
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>

        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="Connect2Job" className="brand-logo" />
        </Link>

        <nav className="nav-links">

          <NavLink
            to="/"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/jobs"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={closeMenu}
          >
            Jobs
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>
          )}

          <NavLink
            to="/services"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={closeMenu}
          >
            Services
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={closeMenu}
          >
            About
          </NavLink>

          <NavLink
            to="/track-application"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={closeMenu}
          >
            Track
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={closeMenu}
          >
            Contact
          </NavLink>

        </nav>

        <div className="nav-buttons">

          {!isAuthenticated ? (

            <>
              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                <User size={17} />
                Login
              </button>

              <button
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                Get Started
                <ArrowRight size={17} />
              </button>
            </>

          ) : (

            <button
              className="profile-btn"
              onClick={() => navigate("/profile")}
            >
              👤 {getFirstName(user?.name)}
            </button>

          )}

        </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </header>

      {menuOpen && (
        <div className="mobile-menu">

          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/jobs" onClick={closeMenu}>Jobs</NavLink>
          
          {isAuthenticated && (
            <NavLink to="/dashboard" onClick={closeMenu}>
              Dashboard
            </NavLink>
          )}
          
          <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/track-application" onClick={closeMenu}>Track Application</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>

          {!isAuthenticated ? (

            <>
              <button
                className="login-btn"
                onClick={() => {
                  closeMenu();
                  navigate("/login");
                }}
              >
                Login
              </button>

              <button
                className="register-btn"
                onClick={() => {
                  closeMenu();
                  navigate("/register");
                }}
              >
                Get Started
              </button>
            </>

          ) : (

            <>
              <button
                className="profile-btn-mobile"
                onClick={() => {
                  closeMenu();
                  navigate("/profile");
                }}
              >
                👤 {getFirstName(user?.name)}
              </button>
            </>

          )}

        </div>
      )}

    </>
  );
}