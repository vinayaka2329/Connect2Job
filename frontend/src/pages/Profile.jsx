import "./profile.css";
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
  Calendar,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  UserCheck,
  Activity,
  Award,
  ChevronRight,
  Save,
  X,
} from "lucide-react";
import { api } from "../services/api";

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const favorites = JSON.parse(localStorage.getItem("favoriteJobs")) || [];

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editLocation, setEditLocation] = useState(user?.location || "");
  const [updating, setUpdating] = useState(false);

  // Fetch applications
  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      try {
        let response;
        if (user?._id) {
          response = await api.get(`/applications/user/${user._id}`);
        } else if (user?.email) {
          response = await api.getApplicationStatus(user.email);
        } else {
          setApplications([]);
          return;
        }
        setApplications(response.data || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      }
    };

    fetchApplications();
  }, [user]);

  // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const joinedDate = user?.createdAt ? formatDate(user.createdAt) : "Not Available";
  const phone = user?.phone || "Not Added";
  const location = user?.location || "Not Added";
  const lastLogin = "Today";

  // Activity timeline
  const buildActivities = () => {
    const activities = [];

    applications.forEach((app) => {
      activities.push({
        id: `app-${app._id}`,
        type: "application",
        title: `Applied for ${app.jobTitle || "a position"}`,
        date: app.createdAt ? formatDate(app.createdAt) : "Recently",
        icon: Briefcase,
      });
    });

    if (favorites.length > 0) {
      activities.push({
        id: "saved-job",
        type: "saved",
        title: `Saved ${favorites.length} job${favorites.length > 1 ? "s" : ""}`,
        date: "Today",
        icon: Heart,
      });
    }

    activities.push({
      id: "login-today",
      type: "login",
      title: "Logged In Today",
      date: "Today",
      icon: Clock,
    });

    return activities.sort((a, b) => (a.date > b.date ? -1 : 1));
  };

  const activities = buildActivities();

  // Profile completion
  const completionSteps = [
    { label: "Email", completed: !!user?.email },
    { label: "Name", completed: !!user?.name },
    { label: "Phone", completed: !!user?.phone },
    { label: "Location", completed: !!user?.location },
  ];
  const completedCount = completionSteps.filter((s) => s.completed).length;
  const completionPercentage = Math.round(
    (completedCount / completionSteps.length) * 100
  );

  // === INLINE EDIT HANDLERS ===
  const handleEditClick = () => {
    setEditPhone(user?.phone || "");
    setEditLocation(user?.location || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditPhone(user?.phone || "");
    setEditLocation(user?.location || "");
  };

  const handleSaveEdit = async () => {
    // Validate phone: if not empty, must be exactly 10 digits
    if (editPhone && editPhone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    setUpdating(true);
    try {
      const response = await api.put("/auth/update", {
        phone: editPhone,
        location: editLocation,
      });
      if (response.success) {
        setUser(response.user);
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert(response.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="profile-page">
      <div className="profile-container">

        {/* HERO PROFILE CARD */}
        <div className="hero-card">
          <div className="hero-gradient" />
          <div className="hero-content">
            <div className="hero-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hero-details">
              <h1 className="hero-name">{user?.name}</h1>
              <p className="hero-email">
                <Mail size={16} />
                {user?.email}
              </p>
              <div className="hero-meta">
                <span className="role-badge">{user?.role || "Member"}</span>
                <span className="status-badge">
                  <span className="status-dot active" />
                  Active
                </span>
                <span className="joined-date">
                  <Calendar size={14} />
                  Joined {joinedDate}
                </span>
              </div>
            </div>
            <button
              className="edit-profile-btn"
              onClick={handleEditClick}
              disabled={isEditing}
            >
              <Edit size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* STATISTICS SECTION */}
        <div className="stats-grid">
          <div
            className="stat-card clickable"
            onClick={() => navigate("/track-application")}
          >
            <div className="stat-icon applications">
              <Briefcase />
            </div>
            <div className="stat-info">
              <h3>{applications.length}</h3>
              <span>Applications</span>
            </div>
          </div>

          <div
            className="stat-card clickable"
            onClick={() => navigate("/jobs")}
          >
            <div className="stat-icon saved">
              <Heart />
            </div>
            <div className="stat-info">
              <h3>{favorites.length}</h3>
              <span>Saved Jobs</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon status">
              <UserCheck />
            </div>
            <div className="stat-info">
              <h3>Active</h3>
              <span>Account Status</span>
            </div>
          </div>
        </div>

        {/* TWO INFORMATION CARDS */}
        <div className="info-cards-grid">
          {/* Personal Information – with inline editing and buttons inside */}
          <div className="info-card">
            <h3>
              <User size={18} />
              Personal Information
            </h3>
            <div className="info-row">
              <span>Name</span>
              <strong>{user?.name || "Not Available"}</strong>
            </div>
            <div className="info-row">
              <span>Email</span>
              <strong>{user?.email || "Not Available"}</strong>
            </div>
            <div className="info-row">
              <span>
                <Phone size={14} /> Phone
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    if (digits.length <= 10) setEditPhone(digits);
                  }}
                  placeholder="Enter 10-digit phone"
                  maxLength="10"
                  className="edit-input"
                  autoFocus
                />
              ) : (
                <strong>{phone}</strong>
              )}
            </div>
            <div className="info-row">
              <span>
                <MapPin size={14} /> Location
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="Enter location"
                  className="edit-input"
                />
              ) : (
                <strong>{location}</strong>
              )}
            </div>

            {/* Inline Save/Cancel buttons when editing */}
            {isEditing && (
              <div className="info-row edit-actions">
                <div className="edit-buttons">
                  <button
                    className="edit-btn cancel"
                    onClick={handleCancelEdit}
                    type="button"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    className="edit-btn save"
                    onClick={handleSaveEdit}
                    disabled={updating}
                    type="button"
                  >
                    <Save size={16} />
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account Information */}
          <div className="info-card">
            <h3>
              <Award size={18} />
              Account Information
            </h3>
            <div className="info-row">
              <span>Role</span>
              <strong>{user?.role || "Member"}</strong>
            </div>
            <div className="info-row">
              <span>Status</span>
              <strong>
                <span className="status-dot active" />
                Active
              </strong>
            </div>
            <div className="info-row">
              <span>Joined</span>
              <strong>{joinedDate}</strong>
            </div>
            <div className="info-row">
              <span>Last Login</span>
              <strong>{lastLogin}</strong>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY & PROFILE COMPLETION */}
        <div className="bottom-grid">
          <div className="activity-card">
            <h3>
              <Activity size={18} />
              Recent Activity
            </h3>
            <div className="activity-timeline">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <activity.icon size={16} />
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">{activity.title}</p>
                      <span className="activity-date">{activity.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-activity">No recent activity</p>
              )}
            </div>
          </div>

          <div className="completion-card">
            <h3>
              <CheckCircle size={18} />
              Complete Your Profile
            </h3>
            <div className="completion-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="progress-percent">{completionPercentage}%</span>
            </div>
            <ul className="completion-checklist">
              {completionSteps.map((step, index) => (
                <li key={index} className={step.completed ? "done" : ""}>
                  {step.completed ? (
                    <CheckCircle size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  {step.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ACTION BUTTONS – only Logout when not editing; no buttons when editing */}
        <div className="action-buttons">
          {!isEditing && (
            <button className="action-btn logout" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

      </div>
    </section>
  );
}