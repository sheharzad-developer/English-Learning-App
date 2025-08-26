// Browser detection utility for Brave-specific fixes
export const detectBraveBrowser = () => {
  // Multiple methods to detect Brave browser
  const isBrave = 
    // Method 1: Check for Brave's specific API
    (navigator.brave && navigator.brave.isBrave && navigator.brave.isBrave()) ||
    // Method 2: Check user agent for Brave
    navigator.userAgent.includes('Brave') ||
    // Method 3: Check for Brave's specific properties
    (navigator.userAgent.includes('Chrome') && 
     !navigator.userAgent.includes('Edg') && 
     !navigator.userAgent.includes('Safari') &&
     window.chrome && 
     window.chrome.webstore === undefined);
  
  return isBrave;
};

export const applyBraveFixes = () => {
  if (detectBraveBrowser()) {
    console.log('Brave browser detected - applying fixes');
    
    // Add Brave-specific CSS class to body
    document.body.classList.add('brave-browser');
    
    // Create and inject comprehensive Brave-specific styles
    const style = document.createElement('style');
    style.id = 'brave-browser-fixes';
    style.textContent = `
      /* Brave Browser Specific Fixes - Theme Aware */
      .brave-browser {
        color: var(--text-primary) !important;
        background-color: var(--bg-primary) !important;
      }
      
      .brave-browser * {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
        text-shadow: none !important;
        background-color: transparent !important;
      }
      
      /* Text elements */
      .brave-browser h1, .brave-browser h2, .brave-browser h3, 
      .brave-browser h4, .brave-browser h5, .brave-browser h6 {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
        font-weight: 600 !important;
      }
      
      .brave-browser p, .brave-browser span, .brave-browser div {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
        font-weight: 500 !important;
      }
      
      /* Specific text classes */
      .brave-browser .text-muted {
        color: var(--text-muted) !important;
        -webkit-text-fill-color: var(--text-muted) !important;
        font-weight: 500 !important;
      }
      
      .brave-browser .text-secondary {
        color: var(--text-secondary) !important;
        -webkit-text-fill-color: var(--text-secondary) !important;
        font-weight: 500 !important;
      }
      
      .brave-browser .lead {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
        font-weight: 600 !important;
      }
      
      /* Card elements */
      .brave-browser .card,
      .brave-browser .card-body,
      .brave-browser .card-title,
      .brave-browser .card-text {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
        background-color: var(--bg-card) !important;
        font-weight: 500 !important;
      }
      
      /* Hero section */
      .brave-browser .hero-section h1 {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
        background: none !important;
        font-weight: 700 !important;
      }
      
      .brave-browser .hero-section p {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
        font-weight: 600 !important;
      }
      
      /* Navigation */
      .brave-browser .navbar-brand,
      .brave-browser .nav-link,
      .brave-browser .dropdown-item {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
        font-weight: 500 !important;
      }
      
      /* Buttons */
      .brave-browser .btn {
        color: inherit !important;
        -webkit-text-fill-color: inherit !important;
        font-weight: 600 !important;
      }
      
      /* Override any gradient backgrounds */
      .brave-browser .hero-section h1,
      .brave-browser .navbar-brand {
        background: none !important;
        background-image: none !important;
        -webkit-background-clip: initial !important;
        background-clip: initial !important;
      }
      
      /* Force proper backgrounds for cards */
      .brave-browser .card,
      .brave-browser .card-body {
        background-color: var(--bg-card) !important;
        border: 1px solid var(--border-color) !important;
      }
      
      /* Ensure proper contrast for all interactive elements */
      .brave-browser a,
      .brave-browser button,
      .brave-browser input,
      .brave-browser textarea,
      .brave-browser select {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
      }
      
      /* Theme switcher specific fixes */
      .brave-browser .theme-toggle-btn {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
        background-color: var(--bg-card) !important;
        border-color: var(--border-color) !important;
      }
      
      .brave-browser .theme-dropdown {
        background-color: var(--bg-card) !important;
        border-color: var(--border-color) !important;
      }
      
      .brave-browser .theme-dropdown .dropdown-item {
        color: var(--text-primary) !important;
        -webkit-text-fill-color: var(--text-primary) !important;
      }
    `;
    
    // Remove any existing Brave fixes to avoid duplication
    const existingStyle = document.getElementById('brave-browser-fixes');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    
    // Force a re-render
    document.body.style.display = 'none';
    setTimeout(() => {
      document.body.style.display = '';
    }, 10);
  }
};
