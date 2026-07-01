import "./Profile.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Briefcase,
  Heart,
  Edit,
  LogOut,
} from "lucide-react";
import { api } from "../services/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  const favorites =
    JSON.parse(localStorage.getItem("favoriteJobs")) || [];
 
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fetch real applications from MongoDB
  useEffect(() => {
    if (!user?.email) return;

    const fetchApplications = async () => {
      try {
        const response = await api.getApplicationStatus(user.email);
        setApplications(response.data || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      }
    };

    fetchApplications();
  }, [user]);

  return (
    <section className="profile-page">

      <div className="profile-card">

        {/* Header */}

        <div className="profile-header">

          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>

            <h2>{user?.name}</h2>

            <p>
              <Mail size={16} />
              {user?.email}
            </p>

            <span className="role-badge">
              {user?.role}
            </span>

          </div>

        </div>

        {/* Stats */}

        <div className="profile-stats">

          <div
            className="stat-box"
            onClick={() => navigate("/track-application")}
            style={{ cursor: "pointer" }}
          >
            <Briefcase />
            <h3>{applications.length}</h3>
            <span>Applications</span>
          </div>

          <div
            className="stat-box"
            onClick={() => navigate("/jobs")}
            style={{ cursor: "pointer" }}
          >
            <Heart />
            <h3>{favorites.length}</h3>
            <span>Saved Jobs</span>
          </div>

          <div className="stat-box">
            <User />
            <h3>Active</h3>
            <span>Status</span>
          </div>

        </div>

        {/* Account */}

        <div className="profile-section">

          <h3>Account Information</h3>

          <div className="info-row">
            <span>Name</span>
            <strong>{user?.name}</strong>
          </div>

          <div className="info-row">
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>

          <div className="info-row">
            <span>Role</span>
            <strong>{user?.role}</strong>
          </div>

        </div>

        {/* Quick Actions */}

        <div className="profile-actions">

          {/* <button
            className="primary-btn"
            onClick={() => alert("Edit Profile Coming Soon")}
          >
            <Edit size={18} />
            Edit Profile
          </button> */}

        </div>

        {/* Logout */}

        <button
          className="logout-profile"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </section>
  );
}