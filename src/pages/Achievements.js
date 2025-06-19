import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Achievements.css';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/achievements/');
        setAchievements(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch achievements');
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) return <div className="loading">Loading achievements...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="achievements">
      <h1>Achievements</h1>
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : ''}`}>
            <div className="achievement-icon">
              {achievement.badge_image ? (
                <img src={achievement.badge_image} alt={achievement.name} />
              ) : (
                <div className="default-icon">🏆</div>
              )}
            </div>
            <div className="achievement-info">
              <h3>{achievement.name}</h3>
              <p>{achievement.description}</p>
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {achievement.progress} / {achievement.requirement}
                </span>
              </div>
              {achievement.earned && (
                <div className="earned-badge">Earned!</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements; 