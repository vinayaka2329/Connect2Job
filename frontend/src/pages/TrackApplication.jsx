import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { API_URL, api } from "../services/api";
import './TrackApplication.css';

export default function TrackApplication() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useAppContext();

  const [email, setEmail] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    // ✅ PROTECTED: Check authentication before searching
    if (!isAuthenticated) {
      showToast("Please login to track your applications.", "warning");
      navigate("/login");
      return;
    }

    if (!email.trim()) {
      alert('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.getApplicationStatus(email);

      setApplications(response.data || []);
      setSearched(true);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch application status.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (id) => {
    // ✅ PROTECTED: Check authentication before deleting
    if (!isAuthenticated) {
      showToast("Please login first.", "warning");
      navigate("/login");
      return;
    }

    if (!window.confirm('Delete this application?')) return;

    try {
      await api.deleteApplication(id);

      setApplications((prev) =>
        prev.filter((app) => app._id !== id)
      );

      alert('Application deleted successfully.');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Unable to delete application.');
    }
  };

  return (
    <div className="track-page">
      <div className="track-container">
        {/* Hero Section */}
        <div className="track-hero">
          <span className="track-badge">📋 Track Status</span>
          <h1>
            Track Your <span className="gradient-text">Application</span>
          </h1>
          <p>Enter the email address you used while applying to check your application status.</p>
        </div>

        {/* Search Form */}
        <div className="track-search-card">
          <form onSubmit={handleSearch} className="track-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-group">
                <span className="input-icon"></span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="track-btn" disabled={loading}>
              {loading ? (
                <>⏳ Checking...</>
              ) : (
                <>🔍 Check Status</>
              )}
            </button>
          </form>
        </div>

        {/* No Results */}
        {searched && applications.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">📭</div>
            <h3>No Applications Found</h3>
            <p>No applications found for this email address. Please check and try again.</p>
          </div>
        )}

        {/* Applications List */}
        {applications.length > 0 && (
          <div className="applications-section">
            <h2 className="applications-heading">
              Your Applications <span>({applications.length})</span>
            </h2>

            <div className="applications-grid">
              {applications.map((item) => (
                <div key={item._id} className="app-card">
                  <div className="app-card-header">
                    <div className="app-icon">
                      <img
                        src={
                          item.logo ||
                          item.logoUrl ||
                          "/images/default-company.png"
                        }
                        alt={item.company}
                        onError={(e) => {
                          e.currentTarget.src = "/images/default-company.png";
                        }}
                      />
                    </div>
                    <div className="app-info">
                      <h3>{item.jobTitle}</h3>
                      <p className="app-company">{item.company}</p>
                    </div>
                    <span className={`status-tag ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="app-details">
                    <div className="detail-item">
                      <span className="detail-label">Applicant</span>
                      <span className="detail-value">{item.applicantName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{item.applicantEmail}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Applied On</span>
                      <span className="detail-value">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {item.status === 'Pending' && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteApplication(item._id)}
                    >
                      🗑️ Delete Application
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}