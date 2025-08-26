import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/leaderboard/');
        setLeaderboard(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch leaderboard data');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  // Always show a sample leaderboard entry if error or empty
  let displayLeaderboard = leaderboard;
  if (error || !leaderboard || leaderboard.length === 0) {
    displayLeaderboard = [{
      id: 1,
      user: 'DemoUser',
      total_score: 1200,
      total_lessons: 15,
      average_accuracy: 92
    }];
  }

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      {error && (
        <div className="error" style={{ color: 'orange', marginBottom: 16 }}>
          (Demo Mode) Failed to fetch leaderboard data, showing a sample entry.
        </div>
      )}
      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Total Score</th>
              <th>Lessons Completed</th>
              <th>Average Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {displayLeaderboard.map((entry, index) => (
              <tr key={entry.id} className={entry.user === user?.id ? 'current-user' : ''}>
                <td>{index + 1}</td>
                <td>{entry.user}</td>
                <td>{entry.total_score}</td>
                <td>{entry.total_lessons}</td>
                <td>{entry.average_accuracy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard; 