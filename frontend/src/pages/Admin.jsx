import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import './Admin.css';

const ADMIN_PASSKEY = 'admin123';

const initialJobTemplate = {
  title: '',
  company: '',
  location: '',
  salary: '',
  type: 'Full Time',
  description: '',
  requirements: '',
  benefits: '',
  tags: '',
  contactEmail: '',
  logo: null,
  logoUrl: '',
};

function createExportFilename() {
  const date = new Date();
  return `connect2job-data-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`;
}

export default function Admin() {
  const { showToast } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [authError, setAuthError] = useState('');
  const [showAddJob, setShowAddJob] = useState(false);
  const [activeTable, setActiveTable] = useState('applications');
  const [tableItems, setTableItems] = useState([]);
  const [newJob, setNewJob] = useState(initialJobTemplate);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobSubmitting, setJobSubmitting] = useState(false);

  // ===== STATE FROM API =====
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Separate state for dashboard data (derived from API data)
  const [dashboardData, setDashboardData] = useState({
    applications: [],
    postedJobs: [],
    pendingJobs: [],
    contacts: [],
    companies: 0,
    candidates: 0,
  });

  // ===== FETCH ALL DATA FROM API =====
  const loadDashboard = async (keepCurrentTab = false) => {
    setLoading(true);
    try {
      const [jobsRes, applicationsRes, contactsRes, subscribersRes] = await Promise.all([
        api.getJobs(),
        api.getApplications(),
        api.getContacts(),
        api.getSubscribers(),
      ]);

      setJobs(jobsRes.data || []);
      setApplications(applicationsRes.data || []);
      setContacts(contactsRes.data || []);
      setSubscribers(subscribersRes.data || []);

      const companies = new Set((applicationsRes.data || []).map((item) => item.company)).size;
      const candidates = new Set((applicationsRes.data || []).map((item) => item.applicantEmail)).size;

      const allJobs = jobsRes.data || [];
      const pendingJobs = allJobs.filter((job) => job.status === 'Pending' || job.approved === false);

      setDashboardData({
        applications: applicationsRes.data || [],
        postedJobs: allJobs,
        pendingJobs: pendingJobs,
        contacts: contactsRes.data || [],
        companies,
        candidates,
      });

      if (!keepCurrentTab) {
        setTableItems(applicationsRes.data || []);
        setActiveTable('applications');
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH ON AUTHENTICATION =====
  useEffect(() => {
    if (window.sessionStorage.getItem('adminLoggedIn') === 'true') {
      setIsAuthenticated(true);
      loadDashboard();
    }
  }, []);

  useEffect(() => {
    return () => {
      window.sessionStorage.removeItem('adminLoggedIn');
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    switchTable(activeTable);
  }, [
    activeTable,
    applications,
    jobs,
    contacts,
    dashboardData,
    isAuthenticated,
  ]);

  // ===== APPROVE JOB =====
  const handleApprovePending = async (id) => {
    if (!window.confirm('Approve this job?')) return;
    try {
      await api.approveJob(id);
      showToast('✅ Job approved', 'success');
      await loadDashboard(true);
    } catch (err) {
      console.error(err);
      showToast('Failed to approve job', 'error');
    }
  };

  // ===== REJECT JOB =====
  const handleRejectPending = async (id) => {
    if (!window.confirm('Reject and delete this pending job?')) return;
    try {
      await api.deleteJob(id);
      showToast('🗑️ Job rejected and removed', 'warning');
      await loadDashboard(true);
    } catch (err) {
      console.error(err);
      showToast('Failed to reject job', 'error');
    }
  };

  // ===== DELETE JOB =====
  const handleDeletePostedJob = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    try {
      await api.deleteJob(id);
      showToast('🗑️ Job deleted', 'info');
      await loadDashboard(true);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete job', 'error');
    }
  };

  // ===== DELETE APPLICATION =====
  const handleDeleteApplication = async (id) => {
    if (!window.confirm('Delete this application?')) return;

    try {
      await api.deleteApplication(id);

      showToast(
        '🗑️ Application deleted',
        'success'
      );

      await loadDashboard(true);
    } catch (err) {
      console.error(err);

      showToast(
        'Failed to delete application',
        'error'
      );
    }
  };

  // ===== ACCEPT APPLICATION =====
  const handleAcceptApplication = async (id) => {
    if (!window.confirm('Accept this application?')) return;

    try {
      await api.updateApplicationStatus(id, 'Accepted');

      showToast(
        '✅ Application Accepted',
        'success'
      );

      await loadDashboard(true);
    } catch (err) {
      console.error(err);

      showToast(
        'Failed to accept application',
        'error'
      );
    }
  };

  // ===== REJECT APPLICATION =====
  const handleRejectApplication = async (id) => {
    if (!window.confirm('Reject this application?')) return;

    try {
      await api.updateApplicationStatus(id, 'Rejected');

      showToast(
        '❌ Application Rejected',
        'warning'
      );

      await loadDashboard(true);
    } catch (err) {
      console.error(err);

      showToast(
        'Failed to reject application',
        'error'
      );
    }
  };

  // ===== SWITCH TABLE =====
  const switchTable = (table) => {
    setActiveTable(table);
    let items = [];
    switch (table) {
      case 'applications':
        items = applications;
        break;
      case 'pendingjobs':
        items = dashboardData.pendingJobs || [];
        break;
      case 'postedjobs':
        items = jobs;
        break;
      case 'contacts':
        items = dashboardData.contacts || [];
        break;
      case 'subscribers':
        items = subscribers;
        break;
      default:
        items = [];
    }
    setTableItems(items);
  };

  // ===== HANDLE LOGIN =====
  const handleLogin = async (event) => {
    event.preventDefault();
    if (passkey.trim() === ADMIN_PASSKEY) {
      setIsAuthenticated(true);
      setAuthError('');
      window.sessionStorage.setItem('adminLoggedIn', 'true');
      await loadDashboard();
      showToast('🔓 Welcome to the Admin Dashboard!', 'success');
    } else {
      setAuthError('❌ Invalid passkey. Please try again.');
      showToast('Invalid admin passkey', 'error');
    }
  };

  // ===== HANDLE LOGOUT =====
  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    window.sessionStorage.removeItem('adminLoggedIn');
    setIsAuthenticated(false);
    setPasskey('');
    setShowAddJob(false);
    setTableItems([]);
    setJobs([]);
    setApplications([]);
    setContacts([]);
    setSubscribers([]);
    setDashboardData({
      applications: [],
      postedJobs: [],
      pendingJobs: [],
      contacts: [],
      companies: 0,
      candidates: 0,
    });
    showToast('🔒 Logged out successfully', 'info');
  };

  // ===== EXPORT JSON =====
  const handleExportJson = () => {
    const payload = {
      applications: applications,
      jobs: jobs,
      contacts: contacts,
      subscribers: subscribers,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = createExportFilename();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✅ Exported data as JSON', 'success');
  };

  // ===== EXPORT TXT =====
  const handleExportTxt = () => {
    let data = tableItems;

    if (!data.length) {
      showToast('No data to export', 'warning');
      return;
    }

    let text = `Connect2Job - ${activeTable}\n`;
    text += `Exported on: ${new Date().toLocaleString()}\n\n`;

    data.forEach((item, index) => {
      text += `----- Record ${index + 1} -----\n`;

      Object.entries(item).forEach(([key, value]) => {
        text += `${key}: ${value}\n`;
      });

      text += '\n';
    });

    const blob = new Blob([text], {
      type: 'text/plain;charset=utf-8;',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `connect2job-${activeTable}-${new Date().toISOString().slice(0, 10)}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('✅ TXT exported successfully', 'success');
  };

  // ===== EXPORT EXCEL =====
  const handleExportExcel = () => {
    console.log('Active Table:', activeTable);

    let data = [];

    // Get data based on active table
    switch (activeTable) {
      case 'applications':
        data = applications;
        break;
      case 'postedjobs':
        data = jobs;
        break;
      case 'contacts':
        data = dashboardData.contacts || [];
        break;
      case 'pendingjobs':
        data = dashboardData.pendingJobs || [];
        break;
      case 'subscribers':
        data = subscribers;
        break;
      default:
        data = [];
    }

    if (!data.length) {
      showToast('No data to export', 'warning');
      return;
    }

    let headers = [];
    let rows = [];

    // Build headers and rows based on active table
    switch (activeTable) {
      case 'applications':
        headers = ['Applicant Name', 'Company', 'Job Title', 'Email', 'Phone', 'Resume Name', 'Resume Link', 'Date', 'Status'];
        rows = data.map((item) => [
          item.applicantName || item.name || '',
          item.company || '',
          item.jobTitle || '',
          item.applicantEmail || item.email || '',
          item.applicantPhone || item.phone || '',
          item.resumeName || '',
          item.resumeUrl || '',
          item.appliedDate || item.createdAt || '',
          item.status || 'Pending',
        ]);
        break;

      case 'contacts':
        headers = ['Name', 'Email', 'Subject', 'Message', 'Date'];
        rows = data.map((item) => [
          item.name || '',
          item.email || '',
          item.subject || '',
          item.message || '',
          item.createdAt || '',
        ]);
        break;

      case 'subscribers':
        headers = ['Email', 'Subscribed On'];
        rows = data.map((item) => [
          item.email || '',
          item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
        ]);
        break;

      case 'postedjobs':
        headers = ['Title', 'Company', 'Location', 'Salary', 'Type', 'Status', 'Date'];
        rows = data.map((item) => [
          item.title || '',
          item.company || '',
          item.location || '',
          item.salary || '',
          item.type || '',
          item.approved ? 'Approved' : 'Pending',
          item.createdAt || '',
        ]);
        break;

      case 'pendingjobs':
        headers = ['Title', 'Company', 'Location', 'Salary', 'Description', 'Posted By'];
        rows = data.map((item) => [
          item.title || '',
          item.company || '',
          item.location || '',
          item.salary || '',
          item.description || '',
          item.postedBy || 'Community Member',
        ]);
        break;

      default:
        headers = Object.keys(data[0] || {});
        rows = data.map((item) => Object.values(item));
    }

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `connect2job-${activeTable}-${new Date().toISOString().slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`✅ ${activeTable} exported successfully!`, 'success');
  };

  // ===== CLEAR ALL DATA =====
  const handleClearAll = () => {
    if (!window.confirm('⚠️ Are you sure you want to clear ALL admin data from the database?')) {
      return;
    }
    showToast('⚠️ Clear all data is disabled in production. Use API endpoints to clear data.', 'warning');
  };

  // ===== START EDIT JOB =====
  const startEditJob = (item) => {
    setNewJob({
      title: item.title || '',
      company: item.company || '',
      location: item.location || '',
      salary: item.salary || '',
      type: item.type || 'Full Time',
      description: item.description || '',
      requirements: Array.isArray(item.requirements) ? item.requirements.join(', ') : (item.requirements || ''),
      benefits: Array.isArray(item.benefits) ? item.benefits.join(', ') : (item.benefits || ''),
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      contactEmail: item.contactEmail || '',
      logo: null,
      logoUrl: item.logoUrl || '',
    });
    setEditingJobId(item._id || item.id);
    setShowAddJob(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===== ADD JOB =====
  const handleAddJob = async (event) => {
    event.preventDefault();
    
    // ✅ NEW: Prevent duplicate submissions
    if (jobSubmitting) return;
    setJobSubmitting(true);
    
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.salary || !newJob.contactEmail) {
      showToast('Please fill required job fields', 'warning');
      setJobSubmitting(false);
      return;
    }

    const tags = (newJob.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean);

    // Create FormData for file upload support
    const jobData = new FormData();

    jobData.append("title", newJob.title);
    jobData.append("company", newJob.company);
    jobData.append("location", newJob.location);
    jobData.append("salary", newJob.salary);
    jobData.append("type", newJob.type);
    jobData.append("description", newJob.description);

    jobData.append(
      "requirements",
      JSON.stringify(
        newJob.requirements
          ? newJob.requirements
            .split(",")
            .map(r => r.trim())
            .filter(Boolean)
          : []
      )
    );

    jobData.append(
      "benefits",
      JSON.stringify(
        newJob.benefits
          ? newJob.benefits
            .split(",")
            .map(b => b.trim())
            .filter(Boolean)
          : []
      )
    );

    jobData.append("tags", JSON.stringify(tags));
    jobData.append("contactEmail", newJob.contactEmail);
    jobData.append("logoUrl", newJob.logoUrl);

    // Append uploaded logo file if exists
    if (newJob.logo) {
      jobData.append("logo", newJob.logo);
    }

    jobData.append("approved", "true");
    jobData.append("status", "Active");

    try {
      if (editingJobId) {
        await api.updateJob(editingJobId, jobData);
        showToast('✅ Job updated successfully', 'success');
      } else {
        await api.createJob(jobData);
        showToast('✅ New job added successfully', 'success');
      }
      setNewJob(initialJobTemplate);
      setShowAddJob(false);
      setEditingJobId(null);
      await loadDashboard(true);
    } catch (err) {
      console.error(err);
      showToast('Failed to save job', 'error');
    } finally {
      // ✅ NEW: Reset submitting state
      setJobSubmitting(false);
    }
  };

  const handleNewJobChange = (field, value) => {
    setNewJob((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this contact?')) return;

    try {
      await api.deleteContact(id);

      showToast(
        '🗑 Contact deleted',
        'success'
      );

      await loadDashboard(true);
    } catch (err) {
      console.error(err);

      showToast(
        'Failed to delete contact',
        'error'
      );
    }
  };

  // ===== DELETE SUBSCRIBER =====
  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm("Delete this subscriber?")) return;

    try {
      await api.deleteSubscriber(id);

      setSubscribers((prev) =>
        prev.filter((subscriber) => subscriber._id !== id)
      );

      showToast("Subscriber deleted successfully", "success");

      await loadDashboard(true);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  // ===== VIEW RESUME =====
  const handleViewResume = (application) => {
    if (!application.resumeUrl) {
      showToast("Resume URL not available", "error");
      return;
    }
    window.open(application.resumeUrl, "_blank", "noopener,noreferrer");
  };

  // ===== DOWNLOAD RESUME =====
  const handleDownloadResume = async (application) => {
    try {
      if (!application.resumeUrl) {
        showToast("Resume URL not available", "error");
        return;
      }

      const response = await fetch(application.resumeUrl);

      if (!response.ok) {
        throw new Error("Unable to download resume");
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = application.resumeName || "resume.pdf";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      showToast("✅ Resume downloaded successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to download resume", "error");
    }
  };

  const sectionTitle = useMemo(() => {
    switch (activeTable) {
      case 'applications':
        return '📋 All Applications';
      case 'pendingjobs':
        return '⏳ Pending Jobs';
      case 'postedjobs':
        return '📝 Posted Jobs';
      case 'contacts':
        return '📩 Contacts';
      case 'subscribers':
        return '📧 Newsletter Subscribers';
      default:
        return '📋 All Applications';
    }
  }, [activeTable]);

  // ===== COUNTS =====
  const contactsCount = contacts.length;
  const applicationsCount = applications.length;
  const subscribersCount = subscribers.length;

  return (
    <section className="admin page-section">
      <div className="container" data-aos="fade-up">
        {!isAuthenticated ? (
          <div className="admin-login-container" data-aos="fade-up">
            <div className="admin-login-box">
              <div className="lock-icon">🔐</div>
              <h2>Admin Access</h2>
              <p>Enter the passkey to access the admin dashboard.</p>
              <form onSubmit={handleLogin}>
                <label>
                  <span>Passkey</span>
                  <input
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter Passkey"
                    maxLength={10}
                    required
                  />
                </label>
                <div className="login-error">{authError || 'Use passkey: admin123'}</div>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-unlock"></i> Unlock Dashboard
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="admin-dashboard" data-aos="fade-up">
            <div className="admin-header">
              <div>
                <h1>📊 <span className="highlight">Admin</span> Dashboard</h1>
                <p style={{ color: '#6A7A9A', fontSize: '0.95rem' }}>
                  Manage applications, jobs, and contacts.
                </p>
              </div>
              <div className="admin-actions">
                <button type="button" className="btn btn-secondary" onClick={() => window.location.assign('/jobs')}>
                  <i className="fas fa-sync"></i> View Jobs
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleExportJson}>
                  <i className="fas fa-file-code"></i> Export JSON
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleExportTxt}>
                  <i className="fas fa-file-alt"></i> Export TXT
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleExportExcel}>
                  <i className="fas fa-file-excel"></i> Export Excel
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleClearAll}>
                  <i className="fas fa-trash"></i> Clear All
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </div>

            {/* ===== ADD JOB SECTION ===== */}
            <div className="admin-section" id="addJobSection">
              <div className="admin-section-header" onClick={() => setShowAddJob((value) => !value)}>
                <h3><i className="fas fa-plus-circle"></i> Add New Job</h3>
                <button type="button" className="toggle-btn">
                  <i className={`fas ${showAddJob ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                </button>
              </div>
              {showAddJob && (
                <div className="admin-section-body">
                  <form className="admin-add-job-form" onSubmit={handleAddJob}>
                    <div className="form-row">
                      <div className="form-group half">
                        <label>Job Title *</label>
                        <input type="text" value={newJob.title} onChange={(e) => handleNewJobChange('title', e.target.value)} placeholder="Frontend Developer" required />
                      </div>
                      <div className="form-group half">
                        <label>Company Name *</label>
                        <input type="text" value={newJob.company} onChange={(e) => handleNewJobChange('company', e.target.value)} placeholder="Google" required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group half">
                        <label>Location *</label>
                        <input type="text" value={newJob.location} onChange={(e) => handleNewJobChange('location', e.target.value)} placeholder="Bangalore" required />
                      </div>
                      <div className="form-group half">
                        <label>Salary *</label>
                        <input type="text" value={newJob.salary} onChange={(e) => handleNewJobChange('salary', e.target.value)} placeholder="₹5-8 LPA" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Job Type *</label>
                      <select value={newJob.type} onChange={(e) => handleNewJobChange('type', e.target.value)} required>
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                        <option>Remote</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Job Description *</label>
                      <textarea value={newJob.description} rows={4} onChange={(e) => handleNewJobChange('description', e.target.value)} placeholder="Describe the role and responsibilities..." required />
                    </div>
                    <div className="form-group">
                      <label>Requirements (comma separated)</label>
                      <textarea value={newJob.requirements} rows={3} onChange={(e) => handleNewJobChange('requirements', e.target.value)} placeholder="React, CSS, JavaScript" />
                    </div>
                    <div className="form-group">
                      <label>Benefits (comma separated)</label>
                      <textarea value={newJob.benefits} rows={3} onChange={(e) => handleNewJobChange('benefits', e.target.value)} placeholder="Health insurance, Flexible hours" />
                    </div>
                    <div className="form-group">
                      <label>Tags/Skills</label>
                      <input type="text" value={newJob.tags} onChange={(e) => handleNewJobChange('tags', e.target.value)} placeholder="React, CSS, JavaScript" />
                    </div>
                    <div className="form-group">
                      <label>Contact Email *</label>
                      <input type="email" value={newJob.contactEmail} onChange={(e) => handleNewJobChange('contactEmail', e.target.value)} placeholder="Enter contact email" required />
                    </div>

                    {/* Company Logo URL Input with Preview */}
                    <div className="form-group">
                      <label>Company Logo URL</label>
                      <input
                        type="url"
                        placeholder="https://logo.clearbit.com/google.com"
                        value={newJob.logoUrl}
                        onChange={(e) =>
                          handleNewJobChange("logoUrl", e.target.value)
                        }
                      />
                      {newJob.logoUrl && (
                        <img
                          src={newJob.logoUrl}
                          alt="Logo Preview"
                          style={{
                            width: 70,
                            height: 70,
                            objectFit: "contain",
                            marginTop: 10,
                            borderRadius: 10,
                            border: "1px solid #e0e0e0",
                            padding: "4px",
                          }}
                        />
                      )}
                    </div>

                    {/* File Upload for Company Logo */}
                    <div className="form-group">
                      <label>Upload Company Logo (PNG, JPG, WEBP)</label>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={(e) =>
                          handleNewJobChange("logo", e.target.files[0])
                        }
                      />
                      {newJob.logo && (
                        <img
                          src={URL.createObjectURL(newJob.logo)}
                          alt="Logo Preview"
                          style={{
                            width: 70,
                            height: 70,
                            objectFit: "contain",
                            marginTop: 10,
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            padding: 5,
                          }}
                        />
                      )}
                    </div>

                    <button type="submit" className="admin-add-job-btn" disabled={jobSubmitting}>
                      <i className={`fas ${editingJobId ? 'fa-save' : 'fa-plus-circle'}`}></i> {jobSubmitting ? (editingJobId ? 'Saving...' : 'Adding...') : (editingJobId ? 'Save Job' : 'Add Job')}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* ===== STATS ===== */}
            <div className="admin-stats" data-aos="fade-up" data-aos-delay="100">
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="fas fa-briefcase"></i></div>
                <div className="stat-number">{applicationsCount}</div>
                <div className="stat-label">Applications</div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="fas fa-building"></i></div>
                <div className="stat-number">{dashboardData.companies}</div>
                <div className="stat-label">Companies</div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="fas fa-users"></i></div>
                <div className="stat-number">{dashboardData.candidates}</div>
                <div className="stat-label">Candidates</div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="fas fa-briefcase"></i></div>
                <div className="stat-number">{jobs.length}</div>
                <div className="stat-label">Posted Jobs</div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="fas fa-envelope"></i></div>
                <div className="stat-number">{contactsCount}</div>
                <div className="stat-label">Messages</div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="fas fa-newspaper"></i></div>
                <div className="stat-number">{subscribersCount}</div>
                <div className="stat-label">Subscribers</div>
              </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="admin-table-container" data-aos="fade-up" data-aos-delay="200">
              <div className="admin-table-header">
                <h3 id="tableTitle">{sectionTitle}</h3>
                <div className="table-tabs">
                  <button type="button" className={activeTable === 'applications' ? 'active' : ''} onClick={() => switchTable('applications')}>
                    Applications
                  </button>
                  <button type="button" className={activeTable === 'pendingjobs' ? 'active' : ''} onClick={() => switchTable('pendingjobs')}>
                    Pending Jobs
                  </button>
                  <button type="button" className={activeTable === 'postedjobs' ? 'active' : ''} onClick={() => switchTable('postedjobs')}>
                    Posted Jobs
                  </button>
                  <button type="button" className={activeTable === 'contacts' ? 'active' : ''} onClick={() => switchTable('contacts')}>
                    Contacts
                  </button>
                  <button type="button" className={activeTable === 'subscribers' ? 'active' : ''} onClick={() => switchTable('subscribers')}>
                    Subscribers
                  </button>
                </div>
              </div>
              <div className="admin-table-wrap">
                <div className="admin-table">
                  {loading ? (
                    <div className="loading-state">
                      <p>Loading data...</p>
                    </div>
                  ) : tableItems.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <h3>No records found</h3>
                      <p>There is no data for the selected table yet.</p>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          {activeTable === 'applications' && (
                            <>
                              <th>Logo</th>
                              <th>Applicant</th>
                              <th>Company</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Resume</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </>
                          )}
                          {activeTable === 'postedjobs' && (
                            <>
                              <th>Logo</th>
                              <th>Title</th>
                              <th>Company</th>
                              <th>Location</th>
                              <th>Salary</th>
                              <th>Actions</th>
                            </>
                          )}
                          {activeTable === 'pendingjobs' && (
                            <>
                              <th>Logo</th>
                              <th>Title</th>
                              <th>Company</th>
                              <th>Location</th>
                              <th>Salary</th>
                              <th>Description</th>
                              <th>Actions</th>
                            </>
                          )}
                          {activeTable === 'contacts' && (
                            <>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Message</th>
                              <th>Date</th>
                              <th>Actions</th>
                            </>
                          )}
                          {activeTable === 'subscribers' && (
                            <>
                              <th>Email</th>
                              <th>Subscribed On</th>
                              <th>Action</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {tableItems.map((item, index) => (
                          <tr key={item._id || item.id || index}>
                            {activeTable === 'applications' && (
                              <>
                                <td>
                                  <img
                                    src={
                                      item.logo || item.logoUrl || "/images/default-company.png"
                                    }
                                    alt={item.company}
                                    className="company-logo-admin"
                                  />
                                </td>
                                <td>{item.applicantName || item.name || 'Unknown'}</td>
                                <td>{item.company || '—'}</td>
                                <td>{item.applicantEmail || item.email || '—'}</td>
                                <td>{item.applicantPhone || '—'}</td>
                                <td>
                                  {item.resumeUrl ? (
                                    <div
                                      style={{
                                        display: 'flex',
                                        gap: '8px',
                                        flexWrap: 'wrap',
                                      }}
                                    >
                                      <button
                                        type="button"
                                        className="resume-action-btn view-btn"
                                        onClick={() => handleViewResume(item)}
                                      >
                                        👁 View
                                      </button>
                                      <button
                                        type="button"
                                        className="resume-action-btn download-btn"
                                        onClick={() => handleDownloadResume(item)}
                                      >
                                        ⬇ Download
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <div>{item.resumeName || 'No Resume'}</div>
                                      <small>{item.resumeSize || ''}</small>
                                    </>
                                  )}
                                </td>
                                <td>
                                  {(item.appliedDate || item.createdAt)
                                    ? new Date(item.appliedDate || item.createdAt).toLocaleDateString()
                                    : '—'}
                                </td>
                                <td>
                                  <span className={`status-badge status-${(item.status || 'pending').toLowerCase()}`}>
                                    {item.status || 'Pending'}
                                  </span>
                                </td>
                                <td>
                                  {(item.status || 'Pending').toLowerCase() === 'pending' && (
                                    <>
                                      <button
                                        className="btn btn-success"
                                        onClick={() =>
                                          handleAcceptApplication(item._id)
                                        }
                                      >
                                        Accept
                                      </button>

                                      <button
                                        className="btn btn-warning"
                                        onClick={() =>
                                          handleRejectApplication(item._id)
                                        }
                                        style={{ marginLeft: '8px' }}
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}

                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleDeleteApplication(item._id)
                                    }
                                    style={{ marginLeft: '8px' }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {activeTable === 'postedjobs' && (
                              <>
                                <td>
                                  <img
                                    src={item.logo || item.logoUrl || "/images/default-company.png"}
                                    alt={item.company}
                                    style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                                  />
                                </td>
                                <td>{item.title}</td>
                                <td>{item.company}</td>
                                <td>{item.location}</td>
                                <td>{item.salary}</td>
                                <td>
                                  <button type="button" className="btn btn-secondary" onClick={() => startEditJob(item)}>Edit</button>
                                  <button type="button" className="btn btn-danger" style={{ marginLeft: 8 }} onClick={() => handleDeletePostedJob(item._id || item.id)}>Delete</button>
                                </td>
                              </>
                            )}
                            {activeTable === 'pendingjobs' && (
                              <>
                                <td>
                                  <img
                                    src={item.logo || item.logoUrl || "/images/default-company.png"}
                                    alt={item.company}
                                    style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                                  />
                                </td>
                                <td>{item.title}</td>
                                <td>{item.company}</td>
                                <td>{item.location}</td>
                                <td>{item.salary}</td>
                                <td style={{ maxWidth: 360, whiteSpace: 'normal' }}>{item.description || '—'}</td>
                                <td>
                                  <button type="button" className="btn btn-primary" onClick={() => handleApprovePending(item._id || item.id)}>Approve</button>
                                  <button type="button" className="btn btn-danger" style={{ marginLeft: 8 }} onClick={() => handleRejectPending(item._id || item.id)}>Reject</button>
                                  <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => startEditJob(item)}>Edit</button>
                                </td>
                              </>
                            )}
                            {activeTable === 'contacts' && (
                              <>
                                <td>{item.name || 'Unknown'}</td>
                                <td>{item.email || '—'}</td>
                                <td style={{ maxWidth: 200, whiteSpace: 'normal' }}>{item.message || '—'}</td>
                                <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                                <td>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleDeleteContact(
                                        item._id || item.id
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {activeTable === 'subscribers' && (
                              <>
                                <td>{item.email}</td>
                                <td>
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleDeleteSubscriber(item._id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}