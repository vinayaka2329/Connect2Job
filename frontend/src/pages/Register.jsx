import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import boyCharacter from "../../images/c2j boy.png";
import girlCharacter from "../../images/c2j girl.png";
import "./Login.css";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For phone field, only allow digits and limit to 10
    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 10) {
        setFormData({
          ...formData,
          [name]: digits,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear email error when user starts typing
    if (name === "email") {
      setEmailError("");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required.");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address (e.g., name@domain.com).");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handleEmailBlur = () => {
    validateEmail(formData.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email before submission
    if (!validateEmail(formData.email)) {
      return;
    }

    // Validate phone: if not empty, must be exactly 10 digits
    if (formData.phone && formData.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register(formData);

      if (!res.success) {
        alert(res.message);
        return;
      }

      login(res.token, res.user);
      alert("Registration Successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <img className="auth-mascot auth-mascot-left" src={boyCharacter} alt="" aria-hidden="true" />

      <div className="auth-card">
        <>
          <h1>Create Account</h1>
          <p className="auth-subtitle">
            Join Connect2Job and start your career journey today.
          </p>
        </>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="form-group-with-error">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              className={emailError ? "input-error" : ""}
              required
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Phone (optional) – only digits, max 10 */}
          <input
            name="phone"
            type="tel"
            placeholder="Enter 10-digit phone number (optional)"
            value={formData.phone}
            onChange={handleChange}
            maxLength="10"
          />

          {/* Location (optional) */}
          <input
            name="location"
            placeholder="Location (e.g. Bangalore, India)"
            value={formData.location}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>

          <p className="auth-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </form>
      </div>

      <img className="auth-mascot auth-mascot-right" src={girlCharacter} alt="" aria-hidden="true" />
    </div>
  );
}