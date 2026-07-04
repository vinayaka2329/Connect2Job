import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import Admin from "./Admin";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // ===== Applications State =====
  const [myApplications, setMyApplications] = useState([]);
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // ===== Load Applications =====
  const loadApplications = async () => {
    if (!user) return;

    try {
      let response;

      if (user?._id) {
        response = await api.get(`/applications/user/${user._id}`);
      } else if (user?.email) {
        response = await api.getApplicationStatus(user.email);
      } else {
        return;
      }

      setMyApplications(response.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [user]);

  if (loading) {
    return (
      <div style={{ marginTop: "120px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ marginTop: "120px", textAlign: "center" }}>
        Please login first.
      </div>
    );
  }

  // ===== Admin =====
  if (user.role === "admin") {
    return <Admin />;
  }

  // ===== User =====
  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1>Welcome, {user.name} 👋</h1>
        <p>Manage your job applications and track your progress.</p>
      </div>

      {/* ===== MY APPLICATIONS ===== */}
      <section className="my-applications-section">
        <h2>📄 My Applications</h2>

        {myApplications.length === 0 ? (
          <div className="no-applications">
            <p>You haven't applied to any jobs yet.</p>
            <button 
              className="browse-jobs-btn"
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <>
            <div className="applications-table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Applied Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllApplications
                    ? myApplications
                    : myApplications.slice(0, 3)
                  ).map((app) => (
                    <tr key={app._id}>
                      <td>
                        <img
                          src={app.logo || app.logoUrl || "/images/default-company.png"}
                          alt={app.company}
                          className="company-logo-small"
                        />
                      </td>
                      <td>{app.jobTitle}</td>
                      <td>{app.company}</td>
                      <td>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="view-application-btn"
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowApplicationModal(true);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {myApplications.length > 3 && (
              <div className="view-more-container">
                <button
                  className="view-more-btn"
                  onClick={() =>
                    setShowAllApplications(!showAllApplications)
                  }
                >
                  {showAllApplications
                    ? "Show Less"
                    : "Show More"}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ===== APPLICATION DETAILS MODAL ===== */}
      {showApplicationModal && selectedApplication && (
        <div
          className="modal-overlay"
          onClick={() => setShowApplicationModal(false)}
        >
          <div
            className="application-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowApplicationModal(false)}
            >
              &times;
            </button>

            <h2>Application Details</h2>

            <div className="application-info">
              <div className="info-item">
                <span>Job Title</span>
                <strong>{selectedApplication.jobTitle}</strong>
              </div>

              <div className="info-item">
                <span>Company</span>
                <strong>{selectedApplication.company}</strong>
              </div>

              <div className="info-item">
                <span>Applicant Name</span>
                <strong>{selectedApplication.applicantName}</strong>
              </div>

              <div className="info-item">
                <span>Email</span>
                <strong>{selectedApplication.applicantEmail}</strong>
              </div>

              <div className="info-item">
                <span>Applied Date</span>
                <strong>
                  {new Date(selectedApplication.createdAt).toLocaleDateString()}
                </strong>
              </div>
            </div>

            <div className="application-modal-actions">
              <button
                className="track-status-btn"
                onClick={() => {
                  setShowApplicationModal(false);
                  navigate("/track-application");
                }}
              >
                Know Your Application Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}