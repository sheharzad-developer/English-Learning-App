import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const lessonService = {
    // Categories
    getCategories: async () => {
        const response = await axios.get(`${API_URL}/learning/categories/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Skill Levels
    getSkillLevels: async () => {
        const response = await axios.get(`${API_URL}/learning/skill-levels/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Lesson endpoints
    getLessons: async (params = {}) => {
        const response = await axios.get(`${API_URL}/learning/lessons/`, {
            headers: getAuthHeaders(),
            params
        });
        return response.data;
    },

    getLesson: async (id) => {
        const response = await axios.get(`${API_URL}/learning/lessons/${id}/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    startLesson: async (lessonId) => {
        const response = await axios.post(`${API_URL}/learning/lessons/${lessonId}/start_lesson/`, {}, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    completeLesson: async (lessonId, score = null) => {
        const response = await axios.post(`${API_URL}/learning/lessons/${lessonId}/complete_lesson/`, {
            score
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Exercise endpoints
    getExercises: async (params = {}) => {
        const response = await axios.get(`${API_URL}/learning/exercises/`, {
            headers: getAuthHeaders(),
            params
        });
        return response.data;
    },

    getExercise: async (id) => {
        const response = await axios.get(`${API_URL}/learning/exercises/${id}/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Submission endpoints
    getSubmissions: async (params = {}) => {
        const response = await axios.get(`${API_URL}/learning/submissions/`, {
            headers: getAuthHeaders(),
            params
        });
        return response.data;
    },

    submitAnswer: async (exerciseId, answer, timeTaken = null, hintsUsed = 0) => {
        const response = await axios.post(`${API_URL}/learning/submissions/`, {
            exercise: exerciseId,
            answer,
            time_taken: timeTaken,
            hints_used: hintsUsed
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getSubmission: async (id) => {
        const response = await axios.get(`${API_URL}/learning/submissions/${id}/`, {
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

    // User Progress endpoints
    getUserProgress: async (params = {}) => {
        const response = await axios.get(`${API_URL}/learning/user-progress/`, {
            headers: getAuthHeaders(),
            params
        });
        return response.data;
    },

    getUserProgressById: async (id) => {
        const response = await axios.get(`${API_URL}/learning/user-progress/${id}/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateProgress: async (lessonId, data) => {
        const response = await axios.post(`${API_URL}/learning/user-progress/`, {
            lesson: lessonId,
            ...data
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Gamification endpoints (badge methods moved to avoid duplication)

    getUserStats: async () => {
        const response = await axios.get(`${API_URL}/learning/stats/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getDashboard: async () => {
        const response = await axios.get(`${API_URL}/learning/dashboard/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Speech Recognition
    recognizeSpeech: async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'speech.wav');
        
        const response = await axios.post(`${API_URL}/learning/speech-recognition/`, formData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Gamification - Points
    getUserPoints: async (userId) => {
        const response = await axios.get(`${API_URL}/learning/user-points/${userId}/`, {
            headers: getAuthHeaders()
        });
        return response;
    },

    getPointsHistory: async (userId, params = {}) => {
        const response = await axios.get(`${API_URL}/learning/user-points/${userId}/history/`, {
            headers: getAuthHeaders(),
            params
        });
        return response;
    },

    // Gamification - Badges
    getBadges: async (params = {}) => {
        const response = await axios.get(`${API_URL}/learning/badges/`, {
            headers: getAuthHeaders(),
            params
        });
        return response;
    },

    getUserBadges: async (userId, params = {}) => {
        const response = await axios.get(`${API_URL}/learning/user-badges/`, {
            headers: getAuthHeaders(),
            params: { user: userId, ...params }
        });
        return response;
    },

    // Gamification - Leaderboard
    getLeaderboard: async (params = {}) => {
        const response = await axios.get(`${API_URL}/learning/leaderboard/`, {
            headers: getAuthHeaders(),
            params
        });
        return response;
    },

    getUserRank: async (userId, timeframe = 'all_time') => {
        const response = await axios.get(`${API_URL}/learning/leaderboard/user-rank/`, {
            headers: getAuthHeaders(),
            params: { user_id: userId, timeframe }
        });
        return response;
    },

    // Gamification - Streaks
    getUserStreak: async (userId) => {
        const response = await axios.get(`${API_URL}/learning/user-streaks/${userId}/`, {
            headers: getAuthHeaders()
        });
        return response;
    },

    getStreakHistory: async (userId, params = {}) => {
        const response = await axios.get(`${API_URL}/learning/user-streaks/${userId}/history/`, {
            headers: getAuthHeaders(),
            params
        });
        return response;
    },

    updateStreak: async (userId) => {
        const response = await axios.post(`${API_URL}/learning/user-streaks/${userId}/update/`, {}, {
            headers: getAuthHeaders()
        });
        return response;
    },

    // Gamification - Achievements
    getAchievements: async (params = {}) => {
        const response = await axios.get(`${API_URL}/achievements/`, {
            headers: getAuthHeaders(),
            params
        });
        return response;
    },

    getUserAchievements: async (userId, params = {}) => {
        const response = await axios.get(`${API_URL}/achievements/user/`, {
            headers: getAuthHeaders(),
            params: { user: userId, ...params }
        });
        return response;
    },

    // Analytics and Progress
    getStudentProgress: async (params = {}) => {
        const response = await axios.get(`${API_URL}/student/progress/`, {
            headers: getAuthHeaders(),
            params
        });
        return response;
    },

    getStudentStats: async (userId) => {
        const response = await axios.get(`${API_URL}/student/stats/${userId}/`, {
            headers: getAuthHeaders()
        });
        return response;
    }

};

export { lessonService };
export default lessonService;