import React from 'react';
import { Button } from 'react-bootstrap';
import './SocialAuth.css';

const SocialAuth = ({ onSocialLogin, disabled = false, showText = true }) => {
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    // This will be implemented when react-google-login or similar package is added
    console.log('Google login clicked');
    if (onSocialLogin) {
      onSocialLogin('google');
    }
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth
    // This will be implemented when react-facebook-login or similar package is added
    console.log('Facebook login clicked');
    if (onSocialLogin) {
      onSocialLogin('facebook');
    }
  };

  const handleGitHubLogin = () => {
    // TODO: Implement GitHub OAuth
    console.log('GitHub login clicked');
    if (onSocialLogin) {
      onSocialLogin('github');
    }
  };

  return (
    <div className="social-auth-container">
      <div className="divider">
        <span>or</span>
      </div>
      
      <div className="social-buttons">
        <Button 
          variant="outline-danger" 
          className="social-btn google-btn"
          onClick={handleGoogleLogin}
          disabled={disabled}
        >
          <i className="fab fa-google"></i>
          {showText && ' Continue with Google'}
        </Button>
        
        <Button 
          variant="outline-primary" 
          className="social-btn facebook-btn"
          onClick={handleFacebookLogin}
          disabled={disabled}
        >
          <i className="fab fa-facebook-f"></i>
          {showText && ' Continue with Facebook'}
        </Button>
        
        <Button 
          variant="outline-dark" 
          className="social-btn github-btn"
          onClick={handleGitHubLogin}
          disabled={disabled}
        >
          <i className="fab fa-github"></i>
          {showText && ' Continue with GitHub'}
        </Button>
      </div>
    </div>
  );
};

export default SocialAuth;