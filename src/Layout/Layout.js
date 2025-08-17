import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2025 English Learning App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout; 