// index.js
import React from 'react'; 
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // ✅ REQUIRED
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>  {/* ✅ MUST wrap App */}
      <App />
    </Router>
  </React.StrictMode>
);
