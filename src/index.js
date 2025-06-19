// index.js
import React from 'react'; 
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // ✅ REQUIRED
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router future={{ v7_relativeSplatPath: true }}>  {/* ✅ Added future flag */}
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
