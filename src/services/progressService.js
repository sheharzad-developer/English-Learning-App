// Local Progress Service for storing quiz and lesson progress
class ProgressService {
  constructor() {
    this.storageKey = 'english_learning_progress';
    this.submissionsKey = 'english_learning_submissions';
  }

  // Get user progress from localStorage
  getProgress() {
    try {
      const progress = localStorage.getItem(this.storageKey);
      return progress ? JSON.parse(progress) : this.getDefaultProgress();
    } catch (error) {
      console.error('Error reading progress:', error);
      return this.getDefaultProgress();
    }
  }

  // Get default progress structure
  getDefaultProgress() {
    return {
      lessonsCompleted: 0,
      totalLessons: 20,
      quizzesTaken: 0,
      totalQuizzes: 10,
      averageScore: 0,
      totalPoints: 0,
      currentStreak: 0,
      studyTime: 0, // in minutes
      achievements: [],
      skillProgress: {
        grammar: 0,
        vocabulary: 0,
        listening: 0,
        speaking: 0,
        reading: 0
      },
      lastActivity: null
    };
  }

  // Save progress to localStorage
  saveProgress(progress) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  // Get quiz submissions
  getSubmissions() {
    try {
      const submissions = localStorage.getItem(this.submissionsKey);
      return submissions ? JSON.parse(submissions) : [];
    } catch (error) {
      console.error('Error reading submissions:', error);
      return [];
    }
  }

  // Save quiz submission
  saveSubmission(submission) {
    try {
      const submissions = this.getSubmissions();
      const newSubmission = {
        id: Date.now(),
        quizId: submission.quizId,
        quizTitle: submission.quizTitle,
        score: submission.score,
        correctAnswers: submission.correctAnswers,
        totalQuestions: submission.totalQuestions,
        timeSpent: submission.timeSpent,
        answers: submission.answers,
        timestamp: new Date().toISOString(),
        isCorrect: submission.score >= 70 // Consider 70% as passing
      };

      submissions.unshift(newSubmission); // Add to beginning
      
      // Keep only last 50 submissions
      if (submissions.length > 50) {
        submissions.splice(50);
      }

      localStorage.setItem(this.submissionsKey, JSON.stringify(submissions));
      
      // Update overall progress
      this.updateProgressFromSubmission(newSubmission);
      
      return newSubmission;
    } catch (error) {
      console.error('Error saving submission:', error);
      return null;
    }
  }

  // Update overall progress based on quiz submission
  updateProgressFromSubmission(submission) {
    const progress = this.getProgress();
    
    // Increment quizzes taken
    progress.quizzesTaken += 1;
    
    // Update average score
    const allSubmissions = this.getSubmissions();
    const totalScore = allSubmissions.reduce((sum, sub) => sum + sub.score, 0);
    progress.averageScore = Math.round(totalScore / allSubmissions.length);
    
    // Add points (10 points per correct answer)
    progress.totalPoints += submission.correctAnswers * 10;
    
    // Update streak (simplified logic)
    const today = new Date().toDateString();
    const lastActivity = progress.lastActivity ? new Date(progress.lastActivity).toDateString() : null;
    
    if (lastActivity === today) {
      // Same day, don't change streak
    } else if (lastActivity === new Date(Date.now() - 86400000).toDateString()) {
      // Previous day, increment streak
      progress.currentStreak += 1;
    } else {
      // Gap in activity, reset streak
      progress.currentStreak = 1;
    }
    
    progress.lastActivity = new Date().toISOString();
    
    // Estimate study time (2 minutes per question)
    progress.studyTime += submission.totalQuestions * 2;
    
    // Update skill progress based on quiz performance
    this.updateSkillProgress(progress, submission);
    
    // Check for achievements
    this.checkAchievements(progress);
    
    this.saveProgress(progress);
  }

  // Update skill progress (simplified logic)
  updateSkillProgress(progress, submission) {
    // Determine skill based on quiz title (simplified)
    let skill = 'grammar'; // default
    
    if (submission.quizTitle.toLowerCase().includes('vocabulary')) {
      skill = 'vocabulary';
    } else if (submission.quizTitle.toLowerCase().includes('listening')) {
      skill = 'listening';
    } else if (submission.quizTitle.toLowerCase().includes('speaking')) {
      skill = 'speaking';
    } else if (submission.quizTitle.toLowerCase().includes('reading')) {
      skill = 'reading';
    }
    
    // Increase skill progress based on score
    const increase = Math.round(submission.score / 20); // 0-5 points increase
    progress.skillProgress[skill] = Math.min(progress.skillProgress[skill] + increase, 100);
  }

  // Check and award achievements
  checkAchievements(progress) {
    const achievements = progress.achievements || [];
    
    // First quiz achievement
    if (progress.quizzesTaken >= 1 && !achievements.includes('first_quiz')) {
      achievements.push('first_quiz');
    }
    
    // Quiz master achievement
    if (progress.quizzesTaken >= 5 && progress.averageScore >= 80 && !achievements.includes('quiz_master')) {
      achievements.push('quiz_master');
    }
    
    // Streak champion achievement
    if (progress.currentStreak >= 7 && !achievements.includes('streak_champion')) {
      achievements.push('streak_champion');
    }
    
    // High scorer achievement
    if (progress.averageScore >= 90 && !achievements.includes('high_scorer')) {
      achievements.push('high_scorer');
    }
    
    progress.achievements = achievements;
  }

  // Get recent submissions (last 10)
  getRecentSubmissions(limit = 10) {
    return this.getSubmissions().slice(0, limit);
  }

  // Get statistics
  getStatistics() {
    const progress = this.getProgress();
    const submissions = this.getSubmissions();
    
    return {
      ...progress,
      recentSubmissions: this.getRecentSubmissions(5),
      totalSubmissions: submissions.length,
      passedQuizzes: submissions.filter(s => s.isCorrect).length,
      overallProgress: Math.min(Math.round((progress.quizzesTaken / progress.totalQuizzes) * 100), 100)
    };
  }

  // Reset all progress (for testing)
  resetProgress() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.submissionsKey);
    return this.getDefaultProgress();
  }

  // Import progress from backend (when available)
  importProgress(backendData) {
    const currentProgress = this.getProgress();
    
    // Merge backend data with local data
    const mergedProgress = {
      ...currentProgress,
      lessonsCompleted: backendData.lessons_completed || currentProgress.lessonsCompleted,
      quizzesTaken: backendData.quizzes_taken || currentProgress.quizzesTaken,
      averageScore: backendData.average_score || currentProgress.averageScore,
      totalPoints: backendData.total_points || currentProgress.totalPoints,
      currentStreak: backendData.current_streak || currentProgress.currentStreak,
      studyTime: backendData.study_time || currentProgress.studyTime
    };
    
    this.saveProgress(mergedProgress);
    return mergedProgress;
  }
}

// Create and export singleton instance
const progressService = new ProgressService();
export default progressService;
