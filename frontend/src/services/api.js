// src/services/api.js
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "connect2job_token"; // ← consistent with authService

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  get: async (path) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${path}`, { headers });
    return handleResponse(response);
  },

  put: async (path, data) => {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log("Token being sent:", token);
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  // =========================
  // CONTACTS
  // =========================
  getContacts: async () => {
    const response = await fetch(`${API_URL}/contacts`);
    return handleResponse(response);
  },

  sendContact: async (contactData) => {
    const response = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    return handleResponse(response);
  },

  deleteContact: async (id) => {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: "DELETE",
    });

    return handleResponse(response);
  },

  // =========================
  // SUBSCRIBERS
  // =========================
  subscribe: async (email) => {
    const response = await fetch(`${API_URL}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },

  getSubscribers: async () => {
    const response = await fetch(`${API_URL}/subscribers`);
    return handleResponse(response);
  },

  // =========================
  // JOBS
  // =========================
  getJobs: async () => {
    const response = await fetch(`${API_URL}/jobs`);
    return handleResponse(response);
  },

  createJob: async (jobData) => {
    const response = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      body: jobData,
    });

    return handleResponse(response);
  },

  updateJob: async (id, jobData) => {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: "PUT",
      body: jobData,
    });

    return handleResponse(response);
  },

  deleteJob: async (id) => {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: "DELETE",
    });

    return handleResponse(response);
  },

  approveJob: async (id) => {
    const response = await fetch(`${API_URL}/jobs/${id}/approve`, {
      method: "PUT",
    });

    return handleResponse(response);
  },

  // =========================
  // APPLICATIONS
  // =========================
  getApplications: async () => {
    const response = await fetch(`${API_URL}/applications`);
    return handleResponse(response);
  },

  deleteApplication: async (id) => {
    const response = await fetch(`${API_URL}/applications/${id}`, {
      method: "DELETE",
    });

    return handleResponse(response);
  },

  applyForJob: async (applicationData) => {
    const response = await fetch(`${API_URL}/applications`, {
      method: "POST",
      body: applicationData,
    });

    return handleResponse(response);
  },

  updateApplicationStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/applications/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    return handleResponse(response);
  },

  getApplicationStatus: async (email) => {
    const response = await fetch(
      `${API_URL}/applications/status/${encodeURIComponent(email)}`
    );

    return handleResponse(response);
  },

  // =========================
  // AUTH / USERS
  // =========================
  getUsers: async () => {
    const response = await fetch(`${API_URL}/auth/users`);
    return handleResponse(response);
  },

  deleteUser: async (id, force = false) => {
    const response = await fetch(
      `${API_URL}/auth/users/${id}?force=${force}`,
      {
        method: "DELETE",
      }
    );

    return handleResponse(response);
  },
};