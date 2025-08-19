# English Learning App - Database Schema Design

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CustomUser    │    │    Category     │    │   SkillLevel    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ username        │    │ name            │    │ name            │
│ email           │    │ description     │    │ order           │
│ full_name       │    │ icon            │    │ description     │
│ role            │    │ created_at      │    │ created_at      │
│ profile_picture │    └─────────────────┘    └─────────────────┘
│ created_at      │             │                       │
│ is_active       │             │                       │
└─────────────────┘             │                       │
         │                      │                       │
         │                      ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │     Lesson      │    │    Exercise     │
         │              ├─────────────────┤    ├─────────────────┤
         │              │ id (PK)         │    │ id (PK)         │
         │              │ title           │◄───┤ lesson_id (FK)  │
         │              │ description     │    │ title           │
         │              │ category_id(FK) │    │ type            │
         │              │ skill_level(FK) │    │ content         │
         │              │ content         │    │ options         │
         │              │ video_url       │    │ correct_answer  │
         │              │ audio_url       │    │ points          │
         │              │ duration        │    │ difficulty      │
         │              │ points          │    │ order           │
         │              │ order           │    │ created_at      │
         │              │ is_published    │    └─────────────────┘
         │              │ created_at      │             │
         │              └─────────────────┘             │
         │                       │                      │
         │                       │                      │
         ▼                       ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  UserProgress   │    │  LessonProgress │    │   Submission    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ user_id (FK)    │    │ user_id (FK)    │    │ user_id (FK)    │
│ lesson_id (FK)  │    │ lesson_id (FK)  │    │ exercise_id(FK) │
│ completed       │    │ progress_pct    │    │ answer          │
│ score           │    │ time_spent      │    │ score           │
│ attempts        │    │ last_accessed   │    │ is_correct      │
│ completed_at    │    │ completed_at    │    │ feedback        │
│ created_at      │    │ created_at      │    │ submitted_at    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         │                                              │
         ▼                                              ▼
┌─────────────────┐                          ┌─────────────────┐
│   UserPoints    │                          │   EssaySubmission│
├─────────────────┤                          ├─────────────────┤
│ id (PK)         │                          │ id (PK)         │
│ user_id (FK)    │                          │ submission_id(FK)│
│ points          │                          │ essay_text      │
│ source          │                          │ grammar_score   │
│ earned_at       │                          │ spelling_score  │
└─────────────────┘                          │ feedback_json   │
         │                                   │ word_count      │
         │                                   │ processed_at    │
         ▼                                   └─────────────────┘
┌─────────────────┐                                   │
│     Badge       │                                   │
├─────────────────┤                                   ▼
│ id (PK)         │                          ┌─────────────────┐
│ name            │                          │ SpeechSubmission│
│ description     │                          ├─────────────────┤
│ icon            │                          │ id (PK)         │
│ criteria        │                          │ submission_id(FK)│
│ points_required │                          │ audio_file      │
│ created_at      │                          │ transcript      │
└─────────────────┘                          │ pronunciation   │
         │                                   │ fluency_score   │
         │                                   │ accuracy_score  │
         ▼                                   │ processed_at    │
┌─────────────────┐                          └─────────────────┘
│   UserBadge     │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ badge_id (FK)   │
│ earned_at       │
└─────────────────┘
```

## Table Definitions

### 1. CustomUser (Already exists)
```sql
CREATE TABLE accounts_customuser (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role VARCHAR(20) DEFAULT 'student',
    profile_picture VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

### 2. Category
```sql
CREATE TABLE learning_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO learning_category (name, description, icon, order_index) VALUES
('Grammar', 'English grammar rules and exercises', 'grammar-icon.svg', 1),
('Vocabulary', 'Word learning and expansion', 'vocabulary-icon.svg', 2),
('Listening', 'Audio comprehension exercises', 'listening-icon.svg', 3),
('Speaking', 'Pronunciation and conversation practice', 'speaking-icon.svg', 4),
('Writing', 'Essay and creative writing practice', 'writing-icon.svg', 5),
('Reading', 'Text comprehension and analysis', 'reading-icon.svg', 6);
```

### 3. SkillLevel
```sql
CREATE TABLE learning_skilllevel (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    order_index INTEGER UNIQUE NOT NULL,
    description TEXT,
    min_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO learning_skilllevel (name, order_index, description, min_points) VALUES
('Beginner', 1, 'Basic English fundamentals', 0),
('Elementary', 2, 'Simple conversations and basic grammar', 100),
('Intermediate', 3, 'Complex sentences and expanded vocabulary', 500),
('Upper-Intermediate', 4, 'Advanced grammar and fluent communication', 1000),
('Advanced', 5, 'Native-like proficiency and complex topics', 2000);
```

### 4. Lesson
```sql
CREATE TABLE learning_lesson (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES learning_category(id) ON DELETE CASCADE,
    skill_level_id INTEGER REFERENCES learning_skilllevel(id) ON DELETE CASCADE,
    content JSONB, -- Rich content with text, images, videos
    video_url VARCHAR(500),
    audio_url VARCHAR(500),
    thumbnail VARCHAR(500),
    duration INTEGER, -- in minutes
    points INTEGER DEFAULT 10,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    prerequisites JSONB, -- Array of lesson IDs
    created_by INTEGER REFERENCES accounts_customuser(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lesson_category ON learning_lesson(category_id);
CREATE INDEX idx_lesson_skill_level ON learning_lesson(skill_level_id);
CREATE INDEX idx_lesson_published ON learning_lesson(is_published);
```

### 5. Exercise
```sql
CREATE TABLE learning_exercise (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES learning_lesson(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'mcq', 'fill_blank', 'matching', 'essay', 'speaking', 'listening'
    content JSONB NOT NULL, -- Question content, media URLs
    options JSONB, -- For MCQ, matching options
    correct_answer JSONB, -- Correct answers/patterns
    points INTEGER DEFAULT 5,
    difficulty INTEGER DEFAULT 1, -- 1-5 scale
    order_index INTEGER DEFAULT 0,
    time_limit INTEGER, -- in seconds
    hints JSONB, -- Array of hints
    explanation TEXT, -- Explanation for correct answer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercise_lesson ON learning_exercise(lesson_id);
CREATE INDEX idx_exercise_type ON learning_exercise(type);
```

### 6. UserProgress
```sql
CREATE TABLE learning_userprogress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES accounts_customuser(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES learning_lesson(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    score DECIMAL(5,2) DEFAULT 0.00, -- Percentage score
    attempts INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_userprogress_user ON learning_userprogress(user_id);
CREATE INDEX idx_userprogress_lesson ON learning_userprogress(lesson_id);
```

### 7. Submission
```sql
CREATE TABLE learning_submission (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES accounts_customuser(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES learning_exercise(id) ON DELETE CASCADE,
    answer JSONB NOT NULL, -- User's answer
    score DECIMAL(5,2) DEFAULT 0.00,
    is_correct BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    time_taken INTEGER, -- in seconds
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submission_user ON learning_submission(user_id);
CREATE INDEX idx_submission_exercise ON learning_submission(exercise_id);
```

### 8. EssaySubmission
```sql
CREATE TABLE learning_essaysubmission (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES learning_submission(id) ON DELETE CASCADE,
    essay_text TEXT NOT NULL,
    grammar_score DECIMAL(5,2),
    spelling_score DECIMAL(5,2),
    vocabulary_score DECIMAL(5,2),
    structure_score DECIMAL(5,2),
    feedback_json JSONB, -- Detailed feedback from grammar API
    word_count INTEGER,
    processed_at TIMESTAMP,
    processing_status VARCHAR(20) DEFAULT 'pending' -- 'pending', 'processing', 'completed', 'failed'
);
```

### 9. SpeechSubmission
```sql
CREATE TABLE learning_speechsubmission (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES learning_submission(id) ON DELETE CASCADE,
    audio_file VARCHAR(500), -- Path to audio file
    transcript TEXT,
    pronunciation_score DECIMAL(5,2),
    fluency_score DECIMAL(5,2),
    accuracy_score DECIMAL(5,2),
    feedback_json JSONB, -- Detailed speech analysis
    processed_at TIMESTAMP,
    processing_status VARCHAR(20) DEFAULT 'pending'
);
```

### 10. UserPoints
```sql
CREATE TABLE learning_userpoints (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES accounts_customuser(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    source VARCHAR(100) NOT NULL, -- 'lesson_completion', 'exercise_correct', 'daily_streak', 'badge_earned'
    source_id INTEGER, -- ID of the source (lesson_id, exercise_id, etc.)
    description TEXT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_userpoints_user ON learning_userpoints(user_id);
CREATE INDEX idx_userpoints_source ON learning_userpoints(source);
```

### 11. Badge
```sql
CREATE TABLE learning_badge (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(500),
    criteria JSONB NOT NULL, -- Conditions to earn badge
    points_reward INTEGER DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample badges
INSERT INTO learning_badge (name, description, icon, criteria, points_reward, rarity) VALUES
('First Steps', 'Complete your first lesson', 'first-steps.svg', '{"type": "lesson_count", "value": 1}', 10, 'common'),
('Grammar Master', 'Complete 10 grammar lessons', 'grammar-master.svg', '{"type": "category_lessons", "category": "Grammar", "value": 10}', 50, 'rare'),
('Streak Warrior', 'Maintain a 7-day learning streak', 'streak-warrior.svg', '{"type": "daily_streak", "value": 7}', 100, 'epic'),
('Perfect Score', 'Get 100% on 5 exercises', 'perfect-score.svg', '{"type": "perfect_exercises", "value": 5}', 75, 'rare');
```

### 12. UserBadge
```sql
CREATE TABLE learning_userbadge (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES accounts_customuser(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES learning_badge(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_userbadge_user ON learning_userbadge(user_id);
```

### 13. UserStreak
```sql
CREATE TABLE learning_userstreak (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES accounts_customuser(id) ON DELETE CASCADE UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 14. Leaderboard (Materialized View)
```sql
CREATE MATERIALIZED VIEW learning_leaderboard AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.profile_picture,
    COALESCE(SUM(up.points), 0) as total_points,
    COUNT(DISTINCT prog.lesson_id) as lessons_completed,
    COUNT(DISTINCT ub.badge_id) as badges_earned,
    COALESCE(streak.current_streak, 0) as current_streak,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(up.points), 0) DESC) as rank
FROM accounts_customuser u
LEFT JOIN learning_userpoints up ON u.id = up.user_id
LEFT JOIN learning_userprogress prog ON u.id = prog.user_id AND prog.completed = TRUE
LEFT JOIN learning_userbadge ub ON u.id = ub.user_id
LEFT JOIN learning_userstreak streak ON u.id = streak.user_id
WHERE u.is_active = TRUE AND u.role = 'student'
GROUP BY u.id, u.username, u.full_name, u.profile_picture, streak.current_streak;

CREATE UNIQUE INDEX idx_leaderboard_id ON learning_leaderboard(id);
```

## Key Design Decisions

1. **JSONB Fields**: Used for flexible content storage (lesson content, exercise options, feedback)
2. **Separate Submission Tables**: EssaySubmission and SpeechSubmission extend base Submission for specialized data
3. **Materialized View**: Leaderboard for performance optimization
4. **Indexing Strategy**: Optimized for common query patterns
5. **Soft Dependencies**: Prerequisites stored as JSONB array for flexibility
6. **Gamification**: Separate tables for points, badges, and streaks for detailed tracking
7. **Scalability**: Designed to handle multimedia content and external API integrations

## Performance Considerations

- Indexes on foreign keys and frequently queried fields
- Materialized view for leaderboard (refresh periodically)
- JSONB for flexible schema while maintaining query performance
- Separate tables for different submission types to avoid sparse columns
- Partitioning considerations for large submission tables (future optimization)