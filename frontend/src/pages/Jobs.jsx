import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from "../context/AuthContext";
// import { getCompanyLogo } from '../data/jobsData';
import { api, API_URL } from '../services/api';
const IMAGE_BASE_URL = API_URL.replace("/api", "");
import { createApplication } from '../services/applicationService';
import './Jobs.css';
// ============================================
// CONSTANTS & KEYS
// ============================================
const FAVORITES_KEY = 'favoriteJobs';
const APPLICATIONS_KEY = 'jobApplications';
const JOBS_PER_PAGE = 6;

// ============================================
// CATEGORY MAPPING FOR FILTERS
// ============================================


const categoryMap = {
  frontend: ['react', 'css', 'javascript', 'html', 'vue', 'angular'],
  backend: ['python', 'django', 'java', 'spring', 'node', 'sql'],
  fullstack: ['react', 'node', 'java', 'spring', 'full stack'],
  data: ['python', 'sql', 'tableau', 'power bi', 'data'],
  devops: ['aws', 'docker', 'kubernetes', 'devops', 'terraform'],
  design: ['figma', 'adobe', 'ui', 'ux', 'design']
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Load data from localStorage
function loadJson(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

// Parse salary value for sorting
function parseSalaryValue(salary) {
  const match = (salary || '').match(/(\d+)(?:\s*[-to]+\s*(\d+))?/i);
  if (!match) return 0;
  return parseInt(match[2] || match[1], 10) || 0;
}

// Get unique job key for favorites
function getJobKey(job) {
  return `${job.title}||${job.company}`;
}

// Check if job matches category
function matchesCategory(job, category) {
  if (!category || category === 'all') return true;
  const tags = (job.tags || []).map((tag) => tag.toLowerCase());
  const keywords = categoryMap[category] || [];
  return tags.some((tag) => keywords.some((keyword) => tag.includes(keyword)));
}

// Apply filters to jobs
function applyJobFilters(jobs, { searchTerm, locationTerm, category, typeFilter }) {
  return jobs.filter((job) => {
    const title = job.title?.toLowerCase() || '';
    const company = job.company?.toLowerCase() || '';
    const location = job.location?.toLowerCase() || '';
    const tags = (job.tags || []).map((tag) => tag.toLowerCase());
    const normalizedType = (job.type || '').toLowerCase();
    const term = searchTerm.trim().toLowerCase();
    const locationQuery = locationTerm.trim().toLowerCase();

    const matchesSearch =
      !term ||
      title.includes(term) ||
      company.includes(term) ||
      tags.some((tag) => tag.includes(term));
    const matchesLocation = !locationQuery || location.includes(locationQuery);
    const matchesType = !typeFilter || typeFilter === 'all' || normalizedType.includes(typeFilter.toLowerCase());
    const matchesCat = matchesCategory(job, category);

    return matchesSearch && matchesLocation && matchesType && matchesCat;
  });
}

// Sort jobs by selected order
function sortJobs(jobs, sortOrder) {
  return [...jobs].sort((a, b) => {
    if (sortOrder === 'salary-high') {
      return parseSalaryValue(b.salary) - parseSalaryValue(a.salary);
    }
    if (sortOrder === 'salary-low') {
      return parseSalaryValue(a.salary) - parseSalaryValue(b.salary);
    }
    const aDate = new Date(a.createdAt || a.postedDate || 0).getTime();
    const bDate = new Date(b.createdAt || b.postedDate || 0).getTime();
    return sortOrder === 'oldest' ? aDate - bDate : bDate - aDate;
  });
}

// ============================================
// MAIN JOBS COMPONENT
// ============================================
console.log("Jobs.jsx file loaded");
export default function Jobs() {

  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // ===== STATE =====
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => loadJson(FAVORITES_KEY));
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [myApplications, setMyApplications] = useState([]);
  const [showAllApplications, setShowAllApplications] = useState(false);

  // ✅ NEW: Add submitting state
  const [submitting, setSubmitting] = useState(false);
  const [postJobSubmitting, setPostJobSubmitting] = useState(false);

  // Modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Form states
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('');
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    alternativeEmail: '',
    phone: '',
    resume: null,
    cover: ''
  });
  const [postJobForm, setPostJobForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full Time",
    description: "",
    requirements: "",
    benefits: "",
    tags: "",
    contactEmail: "",

    // NEW
    logo: null,
    logoUrl: "",
  });

  // ===== EFFECTS =====
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Fetch jobs from API

  useEffect(() => {


    const fetchJobs = async () => {


      try {
        const response = await api.getJobs();


        const activeJobs = (response.data || []).filter(
          (job) => job.status === "Active"
        );



        setJobs(activeJobs);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Listen for storage changes (multi-tab support)
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === FAVORITES_KEY) {
        setFavorites(loadJson(FAVORITES_KEY));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Escape key to close modals
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeAllModals();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationTerm, category, typeFilter, sortOrder]);

  // Fetch user applications
  const loadApplications = async () => {
    if (!user) return;
    try {
      // ✅ NEW: Use userId if available, otherwise fall back to email
      let response;
      if (user?._id) {
        response = await api.get(`/applications/user/${user._id}`);
      } else if (user?.email) {
        response = await api.getApplicationStatus(user.email);
      } else {
        return;
      }
      // ✅ ENHANCED: Enrich applications with current job data (logo/logoUrl)
      const applicationsWithCurrentJobData = (response.data || []).map((app) => {
        const currentJob = jobs.find(
          (job) => job.title === app.jobTitle && job.company === app.company
        );
        return {
          ...app,
          // Override with current job logo/logoUrl if available
          logo: currentJob?.logo || app.logo,
          logoUrl: currentJob?.logoUrl || app.logoUrl,
        };
      });
      setMyApplications(applicationsWithCurrentJobData);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [user]);

  // ===== MEMOIZED DATA =====
  const allJobList = useMemo(() => jobs, [jobs]);

  // Filtered and sorted visible jobs
  const filteredJobs = useMemo(
    () => sortJobs(applyJobFilters(allJobList, { searchTerm, locationTerm, category, typeFilter }), sortOrder),
    [allJobList, searchTerm, locationTerm, category, typeFilter, sortOrder]
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // ✅ FIX 1: Favorites Map - Use jobTitle instead of title
  const favoritesMap = useMemo(() => {
    return new Set(
      (favorites || []).map(
        (item) => `${item.jobTitle}||${item.company}`
      )
    );
  }, [favorites]);

  const visibleCount = filteredJobs.length;

  // ===== FAVORITE FUNCTIONS =====
  const toggleFavorite = (job) => {
    const key = `${job.title}||${job.company}`;
    const exists = favoritesMap.has(key);
    if (exists) {
      setFavorites((current) => current.filter((fav) => `${fav.jobTitle}||${fav.company}` !== key));
      showToast(`Removed ${job.title} from favorites`, 'info');
      return;
    }

    const added = { jobTitle: job.title, company: job.company, addedDate: new Date().toISOString() };
    setFavorites((current) => [...current, added]);
    showToast(`Added ${job.title} to favorites ❤️`, 'success');
  };

  const removeFavorite = (job) => {
    const key = `${job.title}||${job.company}`;
    setFavorites((current) =>
      current.filter((fav) => `${fav.jobTitle}||${fav.company}` !== key)
    );
    showToast(`Removed ${job.title} from favorites`, 'info');
  };

  // ===== MODAL FUNCTIONS =====
  const selectJobForApply = (job) => {
    setSelectedJob(job);
    setApplicationForm({
      name: user?.name || '',
      email: user?.email || '',
      alternativeEmail: '',
      phone: '',
      resume: null,
      cover: ''
    });
    setApplicationStatus('');
    setApplicationMessage('');
    setShowApplyModal(true);
  };

  const selectJobForDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const closeAllModals = () => {
    setShowApplyModal(false);
    setShowDetailsModal(false);
    setShowFavoritesModal(false);
    setShowPostJobModal(false);
    setShowApplicationModal(false);
  };

  // ===== SUBMIT APPLICATION =====
  const submitApplication = async (event) => {
    event.preventDefault();

    // ✅ NEW: Prevent duplicate submissions
    if (submitting) return;

    // ✅ NEW: Set submitting to true
    setSubmitting(true);

    const { name, email, alternativeEmail, phone, resume, cover } = applicationForm;

    // Validation
    if (!name.trim() || !phone.trim() || !resume) {
      setApplicationStatus('error');
      setApplicationMessage('Please fill in all required fields and upload your resume.');
      setSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    // Validate alternative email if provided, otherwise use logged-in email
    let finalEmail = alternativeEmail.trim() || email;

    if (alternativeEmail.trim() && !emailRegex.test(alternativeEmail)) {
      setApplicationStatus('error');
      setApplicationMessage('Please enter a valid alternative email address.');
      setSubmitting(false);
      return;
    }

    if (!emailRegex.test(finalEmail)) {
      setApplicationStatus('error');
      setApplicationMessage('Please enter a valid email address.');
      setSubmitting(false);
      return;
    }

    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
      setApplicationStatus('error');
      setApplicationMessage('Please enter a valid 10-digit phone number.');
      setSubmitting(false);
      return;
    }

    const formData = new FormData();

    formData.append(
      'jobTitle',
      selectedJob?.title || 'Unknown Role'
    );

    formData.append(
      'company',
      selectedJob?.company || 'Unknown Company'
    );

    // ✅ NEW: Add logo and logoUrl to application
    if (selectedJob?.logo) {
  formData.append("logo", selectedJob.logo);
}

if (selectedJob?.logoUrl) {
  formData.append("logoUrl", selectedJob.logoUrl);
}

    formData.append(
      'applicantName',
      name.trim()
    );

    formData.append(
      'applicantEmail',
      finalEmail
    );

    formData.append(
      'applicantPhone',
      phone.trim()
    );

    formData.append(
      'coverLetter',
      cover.trim() || 'No cover letter provided'
    );

    formData.append(
      'resume',
      resume
    );

    // ✅ NEW: Include userId if user is logged in
    if (user?._id) {
      formData.append('userId', user._id);
    }

    try {
      await api.applyForJob(formData);

      setShowApplyModal(false);
      await loadApplications();

      showToast(
        `✅ Application submitted for ${selectedJob.title} at ${selectedJob.company}!`,
        'success'
      );
    } catch (err) {
      console.error(err);

      // ✅ FIXED: Handle duplicate application error with status code 409
      if (err.response?.status === 409) {
        showToast(
          err.response?.data?.message || 'You have already applied for this job with this email.',
          'warning'
        );
      } else {
        showToast(
          err.response?.data?.message || ' Application already submitted',
          'error'
        );
      }
    } finally {
      // ✅ NEW: Reset submitting state
      setSubmitting(false);
    }
  };


  // ===== SUBMIT POST JOB =====
  const submitPostJob = async (event) => {
    event.preventDefault();
    
    // ✅ NEW: Prevent duplicate submissions
    if (postJobSubmitting) return;
    setPostJobSubmitting(true);

    const {
      title,
      company,
      location,
      salary,
      type,
      description,
      requirements,
      benefits,
      tags,
      contactEmail,
      logo,
      logoUrl,
    } = postJobForm;

    if (
      !title.trim() ||
      !company.trim() ||
      !location.trim() ||
      !salary.trim() ||
      !description.trim() ||
      !contactEmail.trim()
    ) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("company", company.trim());
    formData.append("location", location.trim());
    formData.append("salary", salary.trim());
    formData.append("type", type);
    formData.append("description", description.trim());

    formData.append(
      "requirements",
      JSON.stringify(
        requirements
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean)
      )
    );

    formData.append(
      "benefits",
      JSON.stringify(
        benefits
          .split("\n")
          .map((b) => b.trim())
          .filter(Boolean)
      )
    );

    formData.append(
      "tags",
      JSON.stringify(
        tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );

    formData.append("contactEmail", contactEmail.trim());

    formData.append("status", "Pending");
    formData.append("approved", false);
    formData.append("postedBy", "Community Member");

    if (logo) {
      formData.append("logo", logo);
    }

    if (logoUrl.trim()) {
      formData.append("logoUrl", logoUrl.trim());
    }

    try {
      const response = await api.createJob(formData);



      setPostJobForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        type: "Full Time",
        description: "",
        requirements: "",
        benefits: "",
        tags: "",
        contactEmail: "",
        logo: null,
        logoUrl: "",
      });

      setShowPostJobModal(false);

      showToast(
        "✅ Job posted successfully! Pending admin approval.",
        "success"
      );
    } catch (err) {
      console.error(err);

      showToast(
        "Failed to post job",
        "error"
      );
    } finally {
      // ✅ NEW: Reset submitting state
      setPostJobSubmitting(false);
    }
  };

  const favoriteJobs = favorites || [];

  // ============================================
  // RENDER - JOB CARD WITH LOGO
  // ============================================

  // Helper function to render a single job card
  const renderJobCard = (job, index) => {
    const isFavorite = favoritesMap.has(`${job.title}||${job.company}`);

    // ✅ FIX 2: Use _id from MongoDB, fallback to id
    const jobKey = job._id || job.id || `${job.company}-${job.title}`;

    return (
      <div
        key={jobKey}
        className="job-card"
        data-aos="fade-up"
        data-aos-delay={100 + (index % 6) * 50}
      >
        {/* Header */}
        <div className="job-card-header">

          <div className="job-card-image">
            {job.logo ? (
              <img
                src={job.logo}
                alt={job.company}
                className="company-logo"
              />
            ) : job.logoUrl ? (
              <img
                src={job.logoUrl}
                alt={job.company}
                className="company-logo"
              />
            ) : (
              <span className="fallback-icon">💼</span>
            )}
          </div>

          <div className="job-card-info">

            <h3 onClick={() => selectJobForDetails(job)}>
              {job.title}
            </h3>

            <p className="company-name">
              {job.company}
            </p>

          </div>

          <button
            type="button"
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={() => toggleFavorite(job)}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            <i className={isFavorite ? "fas fa-heart" : "far fa-heart"} />
          </button>

        </div>

        {/* Meta */}

        <div className="job-meta">

          <span>
            <i className="fas fa-location-dot"></i>
            {job.location}
          </span>

          <span>
            <i className="fas fa-indian-rupee-sign"></i>
            {job.salary}
          </span>

          <span>
            <i className="fas fa-clock"></i>
            {job.type}
          </span>

        </div>

        {/* Tags */}

        <div className="job-tags">

          {(job.tags || []).map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}

        </div>

        {/* Footer */}

        <div className="job-card-footer">

          <span className="job-date">
            <i className="far fa-calendar-alt" />
            {new Date(job.createdAt || job.postedDate).toLocaleDateString()}
          </span>

          <div className="job-actions">

            <button
              className="details-btn"
              onClick={() => selectJobForDetails(job)}
            >
              View Details
            </button>

            <button
              className="apply-btn"
              // ✅ PROTECTED: Check authentication before applying
              onClick={() => {
                if (!isAuthenticated) {
                  showToast("Please login to apply for jobs.", "warning");
                  navigate("/login");
                  return;
                }
                selectJobForApply(job);
              }}
            >
              Apply Now →
            </button>

          </div>

        </div>

      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="jobs page-wrapper">
      {/* ===== ANIMATED BACKGROUND ===== */}
      <div className="animated-bg" aria-hidden="true">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
        <div className="gradient-orb orb-4" />
        <div className="gradient-orb orb-5" />
        <div className="network-container">
          <span className="network-dot dot-1" />
          <span className="network-dot dot-2" />
          <span className="network-dot dot-3" />
          <span className="network-dot dot-4" />
          <span className="network-dot dot-5" />
          <span className="network-dot dot-6" />
        </div>
      </div>

      {/* ===== JOBS HERO ===== */}
      <div className="jobs-hero" data-aos="fade-up">

        <span className="hero-badge">
          🚀 Premium Career Portal
        </span>

        <h1>
          Find Your <span className="highlight text-glow">Dream Job</span>
        </h1>

        <p>
          Explore thousands of verified opportunities from India's leading
          companies and discover the perfect career that matches your skills,
          passion, and future goals.
        </p>

        <div className="hero-stats">

          <div>
            <h2>{visibleCount}+</h2>
            <span>Available Jobs</span>
          </div>

          <div>
            <h2>500+</h2>
            <span>Companies</span>
          </div>

          <div>
            <h2>{favoriteJobs.length}</h2>
            <span>Favorites</span>
          </div>

        </div>

        <div className="jobs-hero-actions">

          <button
            className="apply-btn"
            type="button"
            // ✅ PROTECTED: Check authentication before posting a job
            onClick={() => {
              if (!isAuthenticated) {
                showToast("Please login to post a job.", "warning");
                navigate("/login");
                return;
              }
              setShowPostJobModal(true);
            }}
          >
            <i className="fas fa-plus-circle"></i>
            Post a Job
          </button>

          <button
            className="button"
            type="button"
            onClick={() => setShowFavoritesModal(true)}
          >
            <i className="fas fa-heart"></i>
            Favorites {favoriteJobs.length ? `(${favoriteJobs.length})` : ""}
          </button>

        </div>

      </div>

      {/* ===== FILTERS ===== */}
      <section className="job-filters" data-aos="fade-up" data-aos-delay="100">

        <div className="filters-row">

          <div className="filter-group">

            <select value={category} onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}>
              <option value="all">📂 All Categories</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Full Stack</option>
              <option value="data">Data Science</option>
              <option value="devops">DevOps</option>
              <option value="design">UI/UX Design</option>
            </select>

            <select value={typeFilter} onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}>
              <option value="all">💼 All Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            <select value={sortOrder} onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}>
              <option value="newest">⇅ Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
            </select>

          </div>

          <div className="results-count">
            Showing <span>{visibleCount}</span> jobs
          </div>

        </div>

      </section>

      {/* ===== SEARCH ===== */}
      <section className="search-section" data-aos="fade-up" data-aos-delay="200">

        <div className="search-box">

          <div className="search-field">

            <div className="search-icon">
              <i className="fas fa-briefcase"></i>
            </div>

            <div className="search-input">

              <label>Job Title</label>

              <input
                type="text"
                placeholder="Frontend Developer, React..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />

            </div>

          </div>

          <div className="search-divider"></div>

          <div className="search-field">

            <div className="search-icon">
              <i className="fas fa-location-dot"></i>
            </div>

            <div className="search-input">

              <label>Location</label>

              <input
                type="text"
                placeholder="Bangalore, Mysuru..."
                value={locationTerm}
                onChange={(e) => {
                  setLocationTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />

            </div>

          </div>

          <button
            className="search-btn"
            type="button"
            onClick={() => showToast("Search updated", "info")}
          >
            <i className="fas fa-search"></i>

            Search Jobs

          </button>

        </div>

      </section>
      {/* ===== JOB LISTINGS ===== */}
      {loading ? (
        <div className="loading">
          <h3>Loading jobs...</h3>
        </div>
      ) : (
        <>
          <section className="job-listings" id="jobListings">
            {currentJobs.length === 0 ? (
              <div className="no-jobs-message">
                <h3>No jobs match your current filters.</h3>
                <p>Try adjusting category, location, or keywords to discover more roles.</p>
              </div>
            ) : (
              currentJobs.map((job, index) =>
                renderJobCard(job, indexOfFirstJob + index)
              )
            )}
          </section>

          {/* ===== PAGINATION INFO ===== */}
          {filteredJobs.length > 0 && (
            <div className="pagination-info">
              Showing
              <strong> {indexOfFirstJob + 1}</strong>
              -
              <strong> {Math.min(indexOfLastJob, filteredJobs.length)}</strong>
              of
              <strong> {filteredJobs.length}</strong>
              Jobs
            </div>
          )}

          {/* ===== PAGINATION ===== */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                ← Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <button
                    key={index}
                    className={
                      currentPage === index + 1
                        ? "active-page"
                        : ""
                    }
                    onClick={() => {
                      setCurrentPage(index + 1);
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* ===== MY APPLICATIONS ===== */}
      {/* {user && myApplications.length > 0 && (
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
                        style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
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
      )} */}

      {/* ============================================
          MODALS
          ============================================ */}

      {/* ===== APPLY MODAL ===== */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {selectedJob?.title || 'Job'}</h2>
              <button type="button" className="modal-close" onClick={closeAllModals}>
                &times;
              </button>
            </div>
            <p className="modal-subtitle">Applying at {selectedJob?.company}</p>
            {applicationMessage && (
              <div className={`message ${applicationStatus === 'error' ? 'error' : 'success'}`}>
                {applicationMessage}
              </div>
            )}
            <form id="applicationForm" onSubmit={submitApplication}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={applicationForm.name}
                    onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={applicationForm.email}
                    readOnly
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Alternative Email (Optional)</label>
                  <input
                    type="email"
                    value={applicationForm.alternativeEmail}
                    onChange={(e) => setApplicationForm({ ...applicationForm, alternativeEmail: e.target.value })}
                    placeholder="Use a different email if you prefer"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={applicationForm.phone}
                    onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Resume *</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setApplicationForm({ ...applicationForm, resume: e.target.files?.[0] || null })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea
                  rows="4"
                  value={applicationForm.cover}
                  onChange={(e) => setApplicationForm({ ...applicationForm, cover: e.target.value })}
                />
              </div>
              {/* ✅ UPDATED: Submit button with disabled state */}
              <button
                type="submit"
                className="submit-application-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== JOB DETAILS MODAL ===== */}
      {showDetailsModal && (
        <div className="modal-overlay job-details-modal" onClick={closeAllModals}>
          <div className="job-details-content" onClick={(event) => event.stopPropagation()}>
            <div className="job-details-body">
              <div className="modal-close-area">

                <button
                  className="modal-close"
                  onClick={closeAllModals}
                >

                  &times;

                </button>

              </div>
              {selectedJob ? (
                <>
                  {/* Header */}
                  <div className="premium-details-header">
                    <div className="premium-logo">
                      {selectedJob.logo || selectedJob.logoUrl ? (
                        <img
                          src={selectedJob.logo || selectedJob.logoUrl}
                          alt={selectedJob.company}
                        />
                      ) : (
                        <span>💼</span>
                      )}

                    </div>
                    <div className="premium-info">
                      <h2>{selectedJob.title}</h2>
                      <h4>{selectedJob.company}</h4>
                      <div className="premium-meta">
                        <span>
                          <i className="fas fa-location-dot"></i>
                          {selectedJob.location}
                        </span>
                        <span>
                          <i className="fas fa-indian-rupee-sign"></i>
                          {selectedJob.salary}
                        </span>
                        <span>
                          <i className="fas fa-clock"></i>
                          {selectedJob.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="premium-section">
                    <h3>Job Description</h3>
                    <p>{selectedJob.description}</p>
                  </div>

                  {/* Requirements */}
                  <div className="premium-section">
                    <h3>Requirements</h3>
                    <div className="premium-list">
                      {(selectedJob.requirements || []).map((item, index) => (
                        <div key={index} className="premium-item">
                          ✔ {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="premium-section">
                    <h3>Benefits</h3>
                    <div className="premium-list">
                      {(selectedJob.benefits || []).map((item, index) => (
                        <div key={index} className="premium-item">
                          🎁 {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="premium-section">
                    <h3>Skills</h3>
                    <div className="premium-tags">
                      {(selectedJob.tags || []).map((tag, index) => (
                        <span key={index}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="premium-footer">
                    <button
                      className="favorite-btn"
                      onClick={() => toggleFavorite(selectedJob)}
                    >
                      ❤️
                      {favoritesMap.has(
                        `${selectedJob.title}||${selectedJob.company}`
                      )
                        ? " Remove"
                        : " Save"}
                    </button>
                    <button
                      className="apply-btn"
                      onClick={() => {
                        closeAllModals();
                        setTimeout(() => selectJobForApply(selectedJob), 150);
                      }}
                    >
                      Apply Now →
                    </button>
                  </div>
                </>
              ) : (
                <p>No job selected.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ===== FAVORITES MODAL ===== */}
      {showFavoritesModal && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Saved Favorites</h2>
              <button type="button" className="modal-close" onClick={closeAllModals}>
                &times;
              </button>
            </div>
            {favoriteJobs.length === 0 ? (
              <div className="empty-favorites">
                <i className="far fa-heart" />
                <p>No favorite jobs yet. Tap the heart icon to save jobs.</p>
              </div>
            ) : (
              <div className="favorites-list">
                {favoriteJobs.map((fav, index) => {
                  const job = { title: fav.jobTitle, company: fav.company };
                  return (
                    <div
                      key={`${fav.jobTitle}-${fav.company}-${index}`}
                      className="favorite-item"
                    >
                      <div className="fav-info">
                        <h4>{fav.jobTitle}</h4>
                        <div className="fav-company">{fav.company}</div>
                        <div className="fav-details">
                          Added: {new Date(fav.addedDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="fav-actions">
                        <button
                          type="button"
                          className="fav-apply-btn"
                          onClick={() => {
                            closeAllModals();
                            selectJobForApply(job);
                          }}
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          className="fav-remove-btn"
                          onClick={() => removeFavorite(job)}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== POST JOB MODAL ===== */}
      {showPostJobModal && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content post-job-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Post a Job</h2>
              <button type="button" className="modal-close" onClick={closeAllModals}>
                &times;
              </button>
            </div>
            <p className="modal-subtitle">Share a role with the Connect2Job community.</p>
            <form id="postJobForm" onSubmit={submitPostJob}>
              <div className="form-row">
                <div className="form-group half">
                  <label>Job Title *</label>
                  <input
                    value={postJobForm.title}
                    onChange={(e) => setPostJobForm({ ...postJobForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label>Company Name *</label>
                  <input
                    value={postJobForm.company}
                    onChange={(e) => setPostJobForm({ ...postJobForm, company: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>Location *</label>
                  <input
                    value={postJobForm.location}
                    onChange={(e) => setPostJobForm({ ...postJobForm, location: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label>Salary *</label>
                  <input
                    value={postJobForm.salary}
                    onChange={(e) => setPostJobForm({ ...postJobForm, salary: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Job Type *</label>
                <select
                  value={postJobForm.type}
                  onChange={(e) => setPostJobForm({ ...postJobForm, type: e.target.value })}
                >
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                  <option>Remote</option>
                </select>
              </div>
              <div className="form-group">
                <label>Job Description *</label>
                <textarea
                  rows="4"
                  value={postJobForm.description}
                  onChange={(e) => setPostJobForm({ ...postJobForm, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Requirements (one per line)</label>
                <textarea
                  rows="3"
                  value={postJobForm.requirements}
                  onChange={(e) => setPostJobForm({ ...postJobForm, requirements: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Benefits (one per line)</label>
                <textarea
                  rows="3"
                  value={postJobForm.benefits}
                  onChange={(e) => setPostJobForm({ ...postJobForm, benefits: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tags/Skills (comma separated)</label>
                <input
                  value={postJobForm.tags}
                  onChange={(e) => setPostJobForm({ ...postJobForm, tags: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Company Logo (Upload .png only)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPostJobForm({
                      ...postJobForm,
                      logo: e.target.files[0],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>OR Company Logo URL</label>
                <input
                  type="text"
                  placeholder="https://company.com/logo.png"
                  value={postJobForm.logoUrl}
                  onChange={(e) =>
                    setPostJobForm({
                      ...postJobForm,
                      logoUrl: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Contact Email *</label>
                <input
                  type="email"
                  value={postJobForm.contactEmail}
                  onChange={(e) => setPostJobForm({ ...postJobForm, contactEmail: e.target.value })}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="submit-application-btn"
                disabled={postJobSubmitting}
              >
                <i className="fas fa-plus-circle" /> {postJobSubmitting ? "Posting..." : "Post Job"}
              </button>
            </form>
          </div>
        </div>
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

              <div className="info-item">
                <span>Status</span>
                <strong>{selectedApplication.status}</strong>
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