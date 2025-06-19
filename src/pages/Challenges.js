import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Challenges.css';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/challenges/');
        setChallenges(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch challenges');
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) return <div className="loading">Loading challenges...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="challenges">
      <h1>Daily Challenges</h1>
      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div key={challenge.id} className={`challenge-card ${challenge.completed ? 'completed' : ''}`}>
            <div className="challenge-header">
              <h3>{challenge.title}</h3>
              <span className="challenge-type">{challenge.type}</span>
            </div>
            <p className="challenge-description">{challenge.description}</p>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(challenge.progress / challenge.requirement) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {challenge.progress} / {challenge.requirement}
              </span>
            </div>
            <div className="challenge-reward">
              <span className="points">+{challenge.points_reward} points</span>
              {challenge.completed && (
                <span className="completed-badge">Completed!</span>
              )}
            </div>
            <div className="challenge-dates">
              <span>Start: {new Date(challenge.start_date).toLocaleDateString()}</span>
              <span>End: {new Date(challenge.end_date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenges; 