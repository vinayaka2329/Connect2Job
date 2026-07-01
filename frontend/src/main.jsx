// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './styles/index.css'
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

// ✅ Import all styles
import './App.css';
import './styles/animations.css';
import './styles/page-styles.css';

// ✅ Import AOS
import 'aos/dist/aos.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);