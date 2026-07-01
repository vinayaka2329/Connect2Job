import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await authService.login(email, password);

      if (!res.success) {

        alert(res.message);

        return;

      }

      login(res.token, res.user);

      alert("Login Successful!");

      navigate("/");

    } catch (err) {

      alert("Login Failed");

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <>
          <h1>Welcome Back</h1>

          <p className="auth-subtitle">
            Sign in to continue to Connect2Job
          </p>
        </>

        <form onSubmit={submitHandler}>

          <input

            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) => setEmail(e.target.value)}

            required

          />

          <input

            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            required

          />

          <button type="submit">

            {loading ? "Logging in..." : "Login"}

          </button>

        </form>

      </div>

    </div>

  );

}