import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AppContext = createContext(null);

// Helper to load from localStorage
const loadFromStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to save to localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

export function AppProvider({ children }) {
  // Toast state
  const [toast, setToast] = useState(null);

  // Data states
  const [jobs, setJobs] = useState(() => loadFromStorage('jobs', []));
  const [applications, setApplications] = useState(() => loadFromStorage('applications', []));
  const [subscribers, setSubscribers] = useState(() => loadFromStorage('subscribers', []));
  const [favorites, setFavorites] = useState(() => loadFromStorage('favorites', []));
  const [contacts, setContacts] = useState(() => loadFromStorage('contacts', []));
  const [adminJobs, setAdminJobs] = useState(() => loadFromStorage('adminJobs', []));
  const [postedJobs, setPostedJobs] = useState(() => loadFromStorage('postedJobs', []));
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage('jobs', jobs);
  }, [jobs]);

  useEffect(() => {
    saveToStorage('applications', applications);
  }, [applications]);

  useEffect(() => {
    saveToStorage('subscribers', subscribers);
  }, [subscribers]);

  useEffect(() => {
    saveToStorage('favorites', favorites);
  }, [favorites]);

  useEffect(() => {
    saveToStorage('contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    saveToStorage('adminJobs', adminJobs);
  }, [adminJobs]);

  useEffect(() => {
    saveToStorage('postedJobs', postedJobs);
  }, [postedJobs]);

  useEffect(() => {
    localStorage.setItem('adminLoggedIn', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Toast functions
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const hideToast = () => setToast(null);

  // Job functions
  const addJob = (job) => {
    const newJob = { ...job, id: Date.now(), createdAt: new Date().toISOString() };
    setJobs(prev => [...prev, newJob]);
    showToast('✅ Job added successfully!', 'success');
    return newJob;
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(job => job.id !== id));
    showToast('🗑️ Job deleted!', 'info');
  };

  // Application functions
  const addApplication = (application) => {
    const newApp = { ...application, id: Date.now(), status: 'Pending', createdAt: new Date().toISOString() };
    setApplications(prev => [...prev, newApp]);
    showToast(`✅ Application submitted for ${application.jobTitle}!`, 'success');
    return newApp;
  };

  const updateApplicationStatus = (id, status) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));
    showToast(`✅ Application ${status}!`, 'success');
  };

  const deleteApplication = (id) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    showToast('🗑️ Application deleted!', 'info');
  };

  // Subscriber functions
  const addSubscriber = (email) => {
    const exists = subscribers.some(s => s.email === email);
    if (exists) {
      showToast('⚠️ You are already subscribed!', 'error');
      return null;
    }
    const newSub = { email, subscribedAt: new Date().toISOString() };
    setSubscribers(prev => [...prev, newSub]);
    showToast('🎉 Subscribed successfully!', 'success');
    return newSub;
  };

  const deleteSubscriber = (email) => {
    setSubscribers(prev => prev.filter(s => s.email !== email));
    showToast('🗑️ Subscriber removed!', 'info');
  };

  // Contact functions
  const addContact = (contact) => {
    const newContact = { ...contact, id: Date.now(), status: 'New', sentAt: new Date().toISOString() };
    setContacts(prev => [...prev, newContact]);
    showToast('📧 Message sent successfully!', 'success');
    return newContact;
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast('🗑️ Message deleted!', 'info');
  };

  // Favorite functions
  const toggleFavorite = (jobId) => {
    setFavorites(prev => {
      const exists = prev.includes(jobId);
      if (exists) {
        showToast('❤️ Removed from favorites', 'info');
        return prev.filter(id => id !== jobId);
      } else {
        showToast('❤️ Added to favorites', 'success');
        return [...prev, jobId];
      }
    });
  };

  const isFavorite = (jobId) => favorites.includes(jobId);

  // Admin functions
  const adminLogin = (passkey) => {
    if (passkey === 'admin123') {
      setIsAdminLoggedIn(true);
      showToast('🔓 Welcome Admin!', 'success');
      return true;
    }
    showToast('❌ Invalid passkey!', 'error');
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    showToast('🔒 Logged out!', 'info');
  };

  // Admin job functions
  const addAdminJob = (job) => {
    const newJob = { ...job, id: Date.now(), approved: true, postedBy: 'Admin', postedDate: new Date().toISOString() };
    setAdminJobs(prev => [...prev, newJob]);
    showToast('✅ Job added successfully!', 'success');
    return newJob;
  };

  const deleteAdminJob = (id) => {
    setAdminJobs(prev => prev.filter(job => job.id !== id));
    showToast('🗑️ Admin job deleted!', 'info');
  };

  // Community job functions
  const addCommunityJob = (job) => {
    const newJob = { ...job, id: Date.now(), approved: false, postedBy: 'Community Member', postedDate: new Date().toISOString() };
    setPostedJobs(prev => [...prev, newJob]);
    showToast('✅ Job posted! Waiting for admin approval.', 'success');
    return newJob;
  };

  const approveCommunityJob = (id) => {
    setPostedJobs(prev => prev.map(job => 
      job.id === id ? { ...job, approved: true, approvedDate: new Date().toISOString() } : job
    ));
    showToast('✅ Job approved!', 'success');
  };

  const deleteCommunityJob = (id) => {
    setPostedJobs(prev => prev.filter(job => job.id !== id));
    showToast('🗑️ Community job deleted!', 'info');
  };

  // Clear all data
  const clearAllData = () => {
    if (window.confirm('⚠️ Delete ALL data?')) {
      if (window.confirm('Are you ABSOLUTELY sure?')) {
        setJobs([]);
        setApplications([]);
        setSubscribers([]);
        setFavorites([]);
        setContacts([]);
        setAdminJobs([]);
        setPostedJobs([]);
        localStorage.clear();
        showToast('🗑️ All data cleared!', 'warning');
      }
    }
  };

  // Memoized value
  const value = useMemo(() => ({
    // Toast
    toast,
    showToast,
    hideToast,

    // Jobs
    jobs,
    setJobs,
    addJob,
    deleteJob,

    // Applications
    applications,
    setApplications,
    addApplication,
    updateApplicationStatus,
    deleteApplication,

    // Subscribers
    subscribers,
    setSubscribers,
    addSubscriber,
    deleteSubscriber,

    // Favorites
    favorites,
    toggleFavorite,
    isFavorite,

    // Contacts
    contacts,
    setContacts,
    addContact,
    deleteContact,

    // Admin
    isAdminLoggedIn,
    adminLogin,
    adminLogout,

    // Admin Jobs
    adminJobs,
    setAdminJobs,
    addAdminJob,
    deleteAdminJob,

    // Community Jobs
    postedJobs,
    setPostedJobs,
    addCommunityJob,
    approveCommunityJob,
    deleteCommunityJob,

    // Utils
    clearAllData,
  }), [
    toast,
    jobs,
    applications,
    subscribers,
    favorites,
    contacts,
    adminJobs,
    postedJobs,
    isAdminLoggedIn,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
}