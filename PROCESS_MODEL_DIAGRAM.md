# English Learning App - Process Model Diagram

## Overall System Process Flow

```mermaid
graph TD
    A[User Visits App] --> B{User Type?}
    
    B -->|New User| C[Registration Process]
    B -->|Existing User| D[Login Process]
    B -->|Guest| E[Browse Public Content]
    
    C --> C1[Enter Email & Password]
    C1 --> C2[Choose Role: Student/Teacher/Admin]
    C2 --> C3[Email Verification]
    C3 --> C4[Profile Setup]
    C4 --> F[Authentication Success]
    
    D --> D1[Enter Credentials]
    D1 --> D2[JWT Token Generation]
    D2 --> D3{Authentication Valid?}
    D3 -->|Yes| F[Authentication Success]
    D3 -->|No| D4[Show Error Message]
    D4 --> D
    
    F --> G{Role-Based Dashboard}
    
    G -->|Student| H[Student Dashboard]
    G -->|Teacher| I[Teacher Dashboard]
    G -->|Admin| J[Admin Dashboard]
    
    H --> H1[Browse Lessons]
    H1 --> H2[Select Lesson]
    H2 --> H3[Start Learning]
    H3 --> H4[Complete Exercises]
    H4 --> H5[Track Progress]
    H5 --> H6[Earn Points/Badges]
    H6 --> H7[Update User Progress]
    
    I --> I1[Monitor Student Progress]
    I1 --> I2[Create Assignments]
    I2 --> I3[Grade Submissions]
    I3 --> I4[Provide Feedback]
    I4 --> I5[Analytics Dashboard]
    
    J --> J1[User Management]
    J1 --> J2[Content Management]
    J2 --> J3[System Analytics]
    J3 --> J4[Platform Configuration]
```

## Detailed Learning Process Flow

```mermaid
graph TD
    A[Student Selects Lesson] --> B[Load Lesson Content]
    B --> C{Lesson Type?}
    
    C -->|Grammar| D[Grammar Exercise]
    C -->|Vocabulary| E[Vocabulary Exercise]
    C -->|Listening| F[Listening Exercise]
    C -->|Speaking| G[Speaking Exercise]
    C -->|Writing| H[Writing Exercise]
    C -->|Reading| I[Reading Exercise]
    
    D --> D1[Multiple Choice Questions]
    D1 --> D2[Submit Answers]
    D2 --> D3[Auto-Grade Response]
    D3 --> J[Show Results & Feedback]
    
    E --> E1[Word Matching/Fill-in-blank]
    E1 --> E2[Submit Answers]
    E2 --> E3[Auto-Grade Response]
    E3 --> J
    
    F --> F1[Play Audio/Video]
    F1 --> F2[Answer Comprehension Questions]
    F2 --> F3[Auto-Grade Response]
    F3 --> J
    
    G --> G1[Record Speech]
    G1 --> G2[Speech Recognition Processing]
    G2 --> G3[Pronunciation Scoring]
    G3 --> G4[Generate Feedback]
    G4 --> J
    
    H --> H1[Write Essay/Text]
    H1 --> H2[Submit Writing]
    H2 --> H3[Grammar/Spelling Check]
    H3 --> H4[Generate Writing Feedback]
    H4 --> J
    
    I --> I1[Read Text/Article]
    I1 --> I2[Answer Questions]
    I2 --> I3[Auto-Grade Response]
    I3 --> J
    
    J --> K[Update Progress]
    K --> L[Calculate Points]
    L --> M[Check for Badges]
    M --> N[Update Leaderboard]
    N --> O{More Exercises?}
    
    O -->|Yes| C
    O -->|No| P[Lesson Complete]
    P --> Q[Update User Stats]
    Q --> R[Show Achievement Summary]
```

## User Authentication & Authorization Process

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant D as Database
    participant J as JWT Service
    
    U->>F: Enter Login Credentials
    F->>B: POST /api/users/login/
    B->>D: Validate User Credentials
    D-->>B: Return User Data
    B->>J: Generate JWT Token
    J-->>B: Return Token
    B-->>F: Return Token + User Info
    F->>F: Store Token in Local Storage
    F->>U: Redirect to Dashboard
    
    Note over F,B: Subsequent Requests
    F->>B: API Request with JWT Header
    B->>J: Validate JWT Token
    J-->>B: Token Valid/Invalid
    B->>D: Query User Data
    D-->>B: Return User Info
    B-->>F: Return Requested Data
```

## Content Management Process Flow

```mermaid
graph TD
    A[Content Creator/Admin] --> B[Access Content Management]
    B --> C{Content Type?}
    
    C -->|Lesson| D[Create Lesson]
    C -->|Exercise| E[Create Exercise]
    C -->|Media| F[Upload Media Files]
    
    D --> D1[Enter Lesson Details]
    D1 --> D2[Select Category & Skill Level]
    D2 --> D3[Add Multimedia Content]
    D3 --> D4[Set Prerequisites]
    D4 --> D5[Save Lesson]
    D5 --> G[Content Review]
    
    E --> E1[Select Exercise Type]
    E1 --> E2[Enter Question Content]
    E2 --> E3[Set Correct Answers]
    E3 --> E4[Configure Scoring]
    E4 --> E5[Save Exercise]
    E5 --> G
    
    F --> F1[Upload Audio/Video/Images]
    F1 --> F2[Process Media Files]
    F2 --> F3[Generate Thumbnails]
    F3 --> F4[Store in Media Library]
    F4 --> G
    
    G --> H{Content Approved?}
    H -->|Yes| I[Publish Content]
    H -->|No| J[Return for Revision]
    J --> D1
    
    I --> K[Make Available to Users]
    K --> L[Update Content Index]
```

## Assessment & Feedback Process

```mermaid
graph TD
    A[Student Submits Answer] --> B[Process Submission]
    B --> C{Submission Type?}
    
    C -->|MCQ/Fill-blank| D[Auto-Grade Standard Exercise]
    C -->|Essay| E[Process Essay Submission]
    C -->|Speech| F[Process Speech Submission]
    
    D --> D1[Compare with Correct Answer]
    D1 --> D2[Calculate Score]
    D2 --> G[Generate Basic Feedback]
    
    E --> E1[Grammar Check API]
    E1 --> E2[Spelling Check]
    E2 --> E3[Vocabulary Analysis]
    E3 --> E4[Structure Analysis]
    E4 --> E5[Generate Writing Feedback]
    E5 --> G
    
    F --> F1[Speech-to-Text Conversion]
    F1 --> F2[Pronunciation Analysis]
    F2 --> F3[Fluency Assessment]
    F3 --> F4[Accuracy Scoring]
    F4 --> F5[Generate Speech Feedback]
    F5 --> G
    
    G --> H[Store Submission Results]
    H --> I[Update User Progress]
    I --> J[Calculate Points Earned]
    J --> K[Check Achievement Badges]
    K --> L[Update Leaderboard]
    L --> M[Send Results to Student]
```

## System Architecture Process

```mermaid
graph LR
    A[Client Browser] --> B[React Frontend]
    B --> C[API Gateway/Router]
    C --> D[Django Backend]
    
    D --> E[Authentication Service]
    D --> F[Learning Content Service]
    D --> G[Exercise Service]
    D --> H[Assessment Service]
    D --> I[User Management Service]
    
    E --> J[User Database]
    F --> J
    G --> J
    H --> J
    I --> J
    
    H --> K[External APIs]
    K --> K1[Grammar Check API]
    K --> K2[Speech Recognition API]
    K --> K3[Text-to-Speech API]
    
    D --> L[File Storage]
    L --> L1[Media Files]
    L --> L2[User Submissions]
    L --> L3[Static Assets]
    
    M[Admin Panel] --> D
    N[Teacher Dashboard] --> D
    O[Student Dashboard] --> D
```

## Key Process Components:

### 1. **User Onboarding Process**
- Registration → Email Verification → Role Selection → Profile Setup → Dashboard Access

### 2. **Learning Process**
- Lesson Selection → Content Consumption → Exercise Completion → Assessment → Progress Tracking

### 3. **Assessment Process**
- Answer Submission → Automated Grading → Feedback Generation → Score Calculation → Progress Update

### 4. **Content Management Process**
- Content Creation → Review → Approval → Publishing → Distribution

### 5. **System Integration Process**
- Frontend-Backend Communication → Database Operations → External API Integration → Real-time Updates

This process model demonstrates the comprehensive workflow of your English Learning App, showing how users interact with the system, how content flows through the platform, and how assessments are processed automatically.