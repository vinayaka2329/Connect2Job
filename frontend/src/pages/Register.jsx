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
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

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

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >

            <option value="student">Student</option>

            <option value="employer">Employer</option>

          </select> */}

          <button type="submit">

            {loading ? "Creating..." : "Register"}

          </button>
          <p className="auth-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Login
            </span>
          </p>

        </form>

      </div>

      <img className="auth-mascot auth-mascot-right" src={girlCharacter} alt="" aria-hidden="true" />

    </div>

  );

}
