// import { useAuth } from "../context/AuthContext";
// import Admin from "./Admin";

// export default function Dashboard() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div style={{ marginTop: "120px", textAlign: "center" }}>
//         Loading...
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div style={{ marginTop: "120px", textAlign: "center" }}>
//         Please login first.
//       </div>
//     );
//   }

//   // Admin Dashboard
//   if (user.role === "admin") {
//     return <Admin />;
//   }

//   // User Dashboard (temporary)
//   return (
//     <div
//       style={{
//         maxWidth: "1200px",
//         margin: "120px auto",
//         padding: "20px",
//       }}
//     >
//       <h1>Welcome, {user.name} 👋</h1>

//       <h3>User Dashboard</h3>

//       <p>This is where your applications will be displayed.</p>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import Admin from "./Admin";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // ===== Applications State =====
  const [myApplications, setMyApplications] = useState([]);
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // ===== Load Applications (Copied from Jobs.jsx) =====
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
    <div
      style={{
        maxWidth: "1200px",
        margin: "120px auto",
        padding: "20px",
      }}
    >
      <h1>Welcome, {user.name} 👋</h1>

      <h3>User Dashboard</h3>

      {/* Applications section will be pasted here in the next step */}
      <h3>User Dashboard</h3>

      {/* ===== MY APPLICATIONS ===== */}
      {user && myApplications.length > 0 && (
        <section className="my-applications-section">
          <h2>📄 My Applications</h2>

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
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "4px",
                          objectFit: "cover",
                        }}
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
                  : "View More"}
              </button>
            </div>
          )}
        </section>
      )}

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

            <h2>My Application</h2>

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

              {/* <div className="info-item">
                <span>Status</span>
                <strong>{selectedApplication.status}</strong>
              </div> */}
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