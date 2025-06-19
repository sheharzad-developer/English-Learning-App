import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const lessonService = {
    // Lesson endpoints
    getLessons: async () => {
        const response = await axios.get(`${API_URL}/lessons/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getLesson: async (id) => {
        const response = await axios.get(`${API_URL}/lessons/${id}/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    submitAnswer: async (lessonId, exerciseId, answer, timeTaken, hintsUsed) => {
        const response = await axios.post(`${API_URL}/lessons/${lessonId}/submit_answer/`, {
            exercise_id: exerciseId,
            answer,
            time_taken: timeTaken,
            hints_used: hintsUsed
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    addNote: async (lessonId, content, isPublic) => {
        const response = await axios.post(`${API_URL}/lessons/${lessonId}/add_note/`, {
            content,
            is_public: isPublic
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    addFeedback: async (lessonId, rating, comment) => {
        const response = await axios.post(`${API_URL}/lessons/${lessonId}/add_feedback/`, {
            rating,
            comment
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    toggleFavorite: async (lessonId) => {
        const response = await axios.post(`${API_URL}/lessons/${lessonId}/toggle_favorite/`, {}, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Progress endpoints
    getUserProgress: async () => {
        const response = await axios.get(`${API_URL}/progress/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getLessonProgress: async (lessonId) => {
        const response = await axios.get(`${API_URL}/progress/?lesson=${lessonId}`, {
            headers: getAuthHeaders()
        });
        return response.data[0];
    },

    // Achievement endpoints
    getAchievements: async () => {
        const response = await axios.get(`${API_URL}/achievements/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Challenge endpoints
    getDailyChallenges: async () => {
        const response = await axios.get(`${API_URL}/challenges/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getUserChallenges: async () => {
        const response = await axios.get(`${API_URL}/user-challenges/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Category and Tag endpoints
    getCategories: async () => {
        const response = await axios.get(`${API_URL}/categories/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getTags: async () => {
        const response = await axios.get(`${API_URL}/tags/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Note endpoints
    getNotes: async () => {
        const response = await axios.get(`${API_URL}/notes/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getLessonNotes: async (lessonId) => {
        const response = await axios.get(`${API_URL}/notes/?lesson=${lessonId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateNote: async (noteId, content, isPublic) => {
        const response = await axios.patch(`${API_URL}/notes/${noteId}/`, {
            content,
            is_public: isPublic
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    deleteNote: async (noteId) => {
        await axios.delete(`${API_URL}/notes/${noteId}/`, {
            headers: getAuthHeaders()
        });
    },

    // Feedback endpoints
    getFeedback: async () => {
        const response = await axios.get(`${API_URL}/feedback/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getLessonFeedback: async (lessonId) => {
        const response = await axios.get(`${API_URL}/feedback/?lesson=${lessonId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Leaderboard endpoints
    getLeaderboard: async () => {
        const response = await axios.get(`${API_URL}/leaderboard/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Badge endpoints
    getBadges: async () => {
        const response = await axios.get(`${API_URL}/badges/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getUserBadges: async () => {
        const response = await axios.get(`${API_URL}/user-badges/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Speech recognition
    recognizeSpeech: async (audioBlob) => {
        // This is a placeholder - implement actual speech recognition
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('This is a placeholder for speech recognition');
            }, 1000);
        });
    },

    // Helper functions
    calculatePoints: (basePoints, timeTaken, timeLimit, hintsUsed, difficultyMultiplier) => {
        let points = basePoints;
        if (timeTaken && timeLimit) {
            const timeBonus = Math.max(0, 1 - (timeTaken / timeLimit));
            points *= (1 + timeBonus);
        }
        const hintPenalty = hintsUsed * 0.1;
        return Math.floor(points * (1 - hintPenalty) * difficultyMultiplier);
    },

    getMasteryLevel: (accuracy) => {
        if (accuracy >= 0.95) return 'master';
        if (accuracy >= 0.85) return 'advanced';
        if (accuracy >= 0.75) return 'intermediate';
        return 'beginner';
    },

    formatTime: (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};

export default lessonService; 