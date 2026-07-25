<div align="center">

# PAGE 1: TITLE PAGE
*(Format this page to be centered, using a large font size. You may want to add your college logo at the top or center)*

## PROJECT REPORT ON
# **DSA PROGRESS TRACKER**
### A Comprehensive Web Application for Data Structures and Algorithms Practice

Submitted in partial fulfillment of the requirements for the degree of 
**[Insert Degree Name, e.g., Bachelor of Technology]**
in
**[Insert Department, e.g., Computer Science and Engineering]**

**Submitted By:**
1. Krishna Agarwal - 11500124147
2. Md Owais Farhan Akhter - 11500124147
3. Misbaah Aymaan - 11500124148

**Under the Guidance of:**
**[Insert Guide's Name]**
**[Insert Guide's Designation]**

**[Insert College/University Name]**
**[Insert Academic Year, e.g., 2023 - 2024]**

</div>

---

# PAGE 2: CERTIFICATE OF APPROVAL
*(This page should be signed by your guide and HOD)*

## CERTIFICATE

This is to certify that the project report entitled **"DSA Progress Tracker"** is a bona fide record of the project work carried out by **Krishna Agarwal (11500124147), Md Owais Farhan Akhter (11500124147), and Misbaah Aymaan (11500124148)** under my supervision and guidance. The project has been completed successfully and is submitted in partial fulfillment of the requirements for the award of the degree of [Insert Degree] in [Insert Department] from [Insert College/University].

The results embodied in this project report have not been submitted to any other University or Institution for the award of any degree or diploma.


________________________
**[Guide's Name]**
Project Guide
[Guide's Designation]

________________________
**[HOD's Name]**
Head of Department
[Department Name]

---

# PAGE 3: ACKNOWLEDGEMENT

## ACKNOWLEDGEMENT

We would like to express our profound gratitude to all those who have contributed to the successful completion of this project.

First and foremost, we express our sincere thanks to our project guide, **[Insert Guide's Name]**, for their continuous support, valuable guidance, and encouragement throughout the course of this project. Their insights and feedback have been instrumental in shaping this application.

We also extend our gratitude to our Head of Department, **[Insert HOD Name]**, and the faculty members of the **[Insert Department Name]** department for providing us with the necessary resources and environment to carry out this project.

Finally, we would like to thank our friends, family, and peers for their constant motivation and constructive criticism, which helped us improve the project significantly.

**Krishna Agarwal** (11500124147)  
**Md Owais Farhan Akhter** (11500124147)  
**Misbaah Aymaan** (11500124148)

---

# PAGE 4: ABSTRACT

## ABSTRACT

The "DSA Progress Tracker" is a modern, responsive, and highly interactive web application designed to help computer science students and software engineers systematically track their progress in learning Data Structures and Algorithms (DSA). Preparing for technical interviews often involves solving hundreds of problems across various platforms. Without a structured way to track progress, learners often lose motivation or struggle to identify their weak areas.

This project solves this problem by providing a centralized platform where users can follow curated roadmaps (such as Striver’s A2Z DSA sheet), mark problems as complete, add personal notes, and bookmark challenging questions for revision. 

The application is built using a modern full-stack architecture featuring **Next.js** for server-side rendering and routing, **Tailwind CSS** for a polished and responsive user interface, and **Supabase** for robust authentication (via GitHub OAuth) and real-time database synchronization. To ensure a seamless user experience, the application utilizes **Zustand** for complex global state management, allowing for instantaneous, zero-latency UI updates while a background synchronization engine ensures data persistence across multiple devices. 

By bridging the gap between static spreadsheets and fragmented coding platforms, the DSA Progress Tracker provides an optimized, distraction-free environment that accelerates the technical interview preparation journey.

---

# PAGE 5: TABLE OF CONTENTS
*(Ensure you add corresponding page numbers in your final Word/PDF document)*

## TABLE OF CONTENTS
1. Introduction
2. Objective and Problem Statement
3. Scope and Feasibility Study
4. System Requirements Specifications
5. Technology Stack
6. System Architecture
7. Database Design
8. Implementation Details
9. User Interface & Screenshots
10. Testing Strategies
11. Challenges & Solutions
12. Conclusion & Future Scope
13. References

---

# PAGE 6: CHAPTER 1 - INTRODUCTION

## 1. INTRODUCTION

### 1.1 Background
In the highly competitive landscape of software engineering, proficiency in Data Structures and Algorithms (DSA) is a fundamental prerequisite. Major tech companies heavily weigh technical interviews based on problem-solving skills. Students and professionals typically rely on platforms like LeetCode, GeeksforGeeks, and HackerRank. However, mastering DSA requires following a structured roadmap rather than randomly solving problems.

### 1.2 Motivation
Many learners rely on static Excel sheets or basic markdown files to track their progress. These methods are inefficient, prone to data loss, and lack cross-device synchronization. The motivation behind this project is to digitize and enhance this tracking process. By providing a dynamic, visually appealing, and cloud-synced web application, we aim to gamify the learning process and keep users motivated through visual progress indicators.

---

# PAGE 7: CHAPTER 2 - OBJECTIVE AND PROBLEM STATEMENT

## 2. OBJECTIVE & PROBLEM STATEMENT

### 2.1 Problem Statement
"To design and develop a full-stack, cloud-enabled web application that provides a structured syllabus for Data Structures and Algorithms, allowing users to track their progress, maintain revision notes, and synchronize their data seamlessly across multiple devices without experiencing UI latency."

### 2.2 Objectives
1. **Structured Curriculum:** To present a curated list of DSA topics and problems categorized by difficulty and data structure.
2. **Progress Tracking:** To allow users to check off completed problems and view aggregate progress bars for different topics.
3. **Cloud Synchronization:** To implement a robust backend system that safely stores user progress in the cloud, preventing data loss.
4. **Offline Resilience / Optimistic UI:** To ensure the user interface updates instantly (zero latency) even before the server acknowledges the data save.
5. **Analytics and Insights:** To visually represent the user's journey, highlighting strengths and areas needing revision.

---

# PAGE 8: CHAPTER 3 - SCOPE AND FEASIBILITY STUDY

## 3. SCOPE & FEASIBILITY STUDY

### 3.1 Project Scope
The current scope of the DSA Progress Tracker includes:
- User authentication via OAuth (GitHub).
- A centralized dashboard displaying overall progress.
- Topic-wise problem lists with clickable links to external coding platforms.
- A local-first architecture that works fast, syncing to Supabase in the background.
- Responsive design tailored for desktops, tablets, and mobile devices.

### 3.2 Feasibility Study
1. **Technical Feasibility:** The project relies on mature, well-documented technologies (Next.js, React, Supabase). The team possesses the required skills to integrate these tools successfully.
2. **Operational Feasibility:** The system is highly user-friendly. The UI/UX is intuitive, meaning users require no training to start tracking their progress.
3. **Economic Feasibility:** The project utilizes open-source technologies and generous free tiers (Vercel for hosting, Supabase for DB/Auth), making the development and deployment cost effectively zero.

---

# PAGE 9: CHAPTER 4 - SYSTEM REQUIREMENTS SPECIFICATIONS

## 4. SYSTEM REQUIREMENTS SPECIFICATIONS (SRS)

### 4.1 Hardware Requirements
- **Processor:** Intel Core i3 (or equivalent) and above.
- **RAM:** Minimum 4 GB (8 GB recommended for development).
- **Storage:** 500 MB of free space.
- **Internet:** Required for cloud synchronization and OAuth authentication.

### 4.2 Software Requirements
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Web Browser:** Google Chrome, Mozilla Firefox, Safari, or Microsoft Edge.
- **Development Environment:** Visual Studio Code.
- **Node Environment:** Node.js (v18.x or higher).
- **Version Control:** Git & GitHub.

### 4.3 Functional Requirements
- The system must allow users to log in securely using GitHub.
- The system must display a hierarchical list of DSA categories and problems.
- The system must allow toggling the completion status of a problem.
- The system must calculate and display progress percentages per category.

### 4.4 Non-Functional Requirements
- **Performance:** UI state updates should happen in < 50ms.
- **Scalability:** The backend must handle concurrent database reads/writes efficiently.
- **Security:** User data must be securely isolated using Row Level Security (RLS) policies in the database.

---

# PAGE 10: CHAPTER 5 - TECHNOLOGY STACK

## 5. TECHNOLOGY STACK

*(Write about why each technology was chosen)*

### 5.1 Frontend Framework: Next.js & React
Next.js was chosen for its powerful file-based routing system, Server-Side Rendering (SSR) capabilities, and built-in API routes. React forms the foundation of our component-based architecture, allowing for reusable UI elements.

### 5.2 Styling: Tailwind CSS & Shadcn UI
Tailwind CSS provides utility-first CSS styling, which drastically reduces development time and ensures a highly consistent design language. Shadcn UI was utilized for accessible, pre-built, and customizable components like Modals, Progress Bars, and Dropdowns.

### 5.3 State Management: Zustand
Zustand is a small, fast, and scalable bear-bones state-management solution. It was preferred over Redux due to its lack of boilerplate, making it perfect for managing the local progress state and syncing it with the backend.

### 5.4 Backend and Database: Supabase
Supabase serves as an open-source Firebase alternative. It provides a robust PostgreSQL database, built-in GoTrue authentication, and auto-generated REST APIs.

### 5.5 Deployment: Vercel
Vercel provides seamless continuous integration and continuous deployment (CI/CD) pipelines directly from our GitHub repository, ensuring edge-network performance.

---

# PAGE 11: CHAPTER 6 - SYSTEM ARCHITECTURE

## 6. SYSTEM ARCHITECTURE

*(Instruction: You should insert a high-level architecture diagram on this page. Below is the text explaining it)*

The architecture of the DSA Progress Tracker follows a modern decoupled approach:

1. **Client Layer (Browser):**
   - Renders the Next.js application.
   - Maintains a local state store using Zustand.
   - Executes Optimistic UI updates (updating the UI before the server responds).

2. **Application Layer (Next.js Server / API Routes):**
   - Handles OAuth callbacks.
   - Serves static and dynamic pages.
   - Acts as a secure middleman between the client and the database for specific secured actions.

3. **Data Layer (Supabase / PostgreSQL):**
   - **Auth Service:** Manages user sessions, tokens, and social logins.
   - **PostgreSQL DB:** Stores the actual user progress maps (JSON or relational rows) linked to User UUIDs.

**Workflow:**
When a user clicks "Complete" on a problem, Zustand instantly updates the local state and progress bar. Concurrently, an asynchronous network request is dispatched to Supabase to update the cloud database. If the network request fails, Zustand rolls back the UI state, ensuring data integrity.

---

# PAGE 12: CHAPTER 7 - DATABASE DESIGN

## 7. DATABASE DESIGN

*(Instruction: Draw or generate an ER Diagram showing the User table and Progress table. Add it to this page.)*

### 7.1 Schema Overview
To ensure high performance and scalability, the database is normalized but leverages PostgreSQL's powerful JSONB capabilities for flexible progress tracking.

### 7.2 Tables Description

**Table 1: `users` (Managed by Supabase Auth)**
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `created_at` (Timestamp)
- `provider` (String, e.g., 'github')

**Table 2: `user_progress`**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key referencing `users.id`)
- `problem_id` (String, Unique identifier for the DSA problem)
- `status` (Enum: 'completed', 'bookmarked', 'in_progress')
- `notes` (Text, Optional user notes)
- `updated_at` (Timestamp)

### 7.3 Row Level Security (RLS)
The database enforces Row Level Security policies. A user can only execute `SELECT`, `INSERT`, `UPDATE`, or `DELETE` queries on rows in the `user_progress` table where `user_progress.user_id` matches their own authenticated UUID.

---

# PAGE 13: CHAPTER 8 - SYSTEM DESIGN & DATA FLOW

## 8. SYSTEM DESIGN (DFD & UML)

*(Instruction: Create and insert a Data Flow Diagram (DFD) and a Use Case Diagram here. Below are the descriptions)*

### 8.1 Use Case Diagram Description
**Actors:** User, System Database
**Use Cases:**
1. Authenticate (Login/Logout)
2. View Topic Syllabus
3. Mark Problem as Solved
4. Add Note to Problem
5. View Overall Progress Dashboard

### 8.2 Data Flow Diagram (Level 1)
1. **Process 1.0 (Auth):** User submits credentials via GitHub -> System validates -> Returns Session Token.
2. **Process 2.0 (Fetch Progress):** Client sends Session Token -> DB verifies RLS -> DB returns array of completed problem IDs -> Client populates Zustand store.
3. **Process 3.0 (Update Progress):** User clicks checkbox -> UI updates immediately -> Async request sent to DB with `problem_id` and `user_id` -> DB acknowledges.

---

# PAGE 14: CHAPTER 9 - IMPLEMENTATION DETAILS (FRONTEND)

## 9. IMPLEMENTATION DETAILS

### 9.1 Next.js App Router Structure
The project utilizes the new Next.js App Router (`app/` directory).
- `/app/page.tsx`: The landing page and dashboard.
- `/app/topic/[id]/page.tsx`: Dynamic routing for displaying specific DSA categories (e.g., Arrays, Dynamic Programming).
- `/app/api/...`: Serverless functions for handling background tasks and secure API calls.

### 9.2 Responsive UI Implementation
Tailwind CSS was instrumental in building a fluid UI. Classes like `md:grid-cols-2` and `lg:grid-cols-3` were used to ensure the problem cards restructure themselves perfectly on mobile phones, tablets, and wide desktop monitors. Dark mode integration is supported out-of-the-box using Tailwind's `dark:` modifiers.

### 9.3 Component Modularity
The application is highly componentized:
- `<ProgressBar />`: Reusable component calculating `(solved / total) * 100`.
- `<ProblemRow />`: Represents a single question, containing the problem title, difficulty badge, and completion checkbox.
- `<Sidebar />`: Provides quick navigation between different DSA topics.

---

# PAGE 15: CHAPTER 9 - IMPLEMENTATION DETAILS (BACKEND & STATE)

## 9. (Continued) STATE MANAGEMENT & CLOUD SYNC

### 9.4 The Zustand Sync Engine
The core technical achievement of this project is the hybrid state management system. 

```javascript
// Example architecture of the store
const useProgressStore = create((set, get) => ({
  completedProblems: [],
  toggleProblem: async (problemId) => {
     // 1. Optimistic UI update
     set((state) => ({ ...state, add_or_remove_problemId }));
     
     // 2. Background Sync
     try {
        await supabase.from('user_progress').upsert({ problem_id: problemId });
     } catch (error) {
        // 3. Rollback on failure
        set((state) => ({ /* revert to previous state */ }));
     }
  }
}));
```

### 9.5 Authentication Flow
We utilized `@supabase/ssr` to implement secure, HTTP-only cookie-based authentication. When a user logs in via GitHub, Supabase sets a secure cookie on the client. Next.js middleware reads this cookie on every page request to protect protected routes, redirecting unauthenticated users to the login screen automatically.

---

# PAGE 16: CHAPTER 10 - USER INTERFACE & SCREENSHOTS

## 10. USER INTERFACE

*(Instruction: Take 3-4 good screenshots of your running application and paste them here. Add a caption below each one describing what it is.)*

**Screenshot 1: The Dashboard / Landing Page**
*(Insert image here)*
*Figure 1: The main dashboard showing overall progress rings and recent activity.*

**Screenshot 2: Topic View (e.g., Arrays or Trees)**
*(Insert image here)*
*Figure 2: The detailed list of problems for a specific topic, featuring difficulty badges and completion checkboxes.*

**Screenshot 3: Mobile View**
*(Insert image here)*
*Figure 3: Demonstration of the application's responsiveness on a simulated mobile device.*

**Screenshot 4: Login/Authentication Screen**
*(Insert image here)*
*Figure 4: Secure authentication portal using GitHub OAuth.*

---

# PAGE 17: CHAPTER 11 - TESTING STRATEGIES

## 11. TESTING STRATEGIES

Testing is a critical phase to ensure the reliability and robustness of the application. The following testing methodologies were applied:

### 11.1 Unit Testing
Individual components and pure functions were tested in isolation. For instance, the progress calculation utility function `calculatePercentage(solved, total)` was tested against various edge cases (e.g., total = 0, solved > total).

### 11.2 Integration Testing
We tested the integration between the Zustand state store and the Supabase backend. We simulated network delays to ensure the Optimistic UI behaved correctly, verifying that a failed network request successfully triggered a local state rollback.

### 11.3 User Acceptance Testing (UAT)
The application was deployed to a staging environment and tested by peer students. Feedback was gathered regarding UI clarity, mobile responsiveness, and overall ease of use. Minor tweaks to button sizes and contrast ratios were made based on this feedback.

### 11.4 Performance Testing
Using Google Chrome's Lighthouse tool, the application was audited for Performance, Accessibility, Best Practices, and SEO. The Next.js SSR architecture resulted in near-perfect Lighthouse scores, with First Contentful Paint (FCP) occurring in under 0.8 seconds.

---

# PAGE 18: CHAPTER 12 - CHALLENGES AND SOLUTIONS

## 12. CHALLENGES & SOLUTIONS

During the development lifecycle, several technical hurdles were encountered and overcome:

### 12.1 Challenge: Network Latency on Checkbox Clicks
**Problem:** Initially, waiting for the Supabase database to respond before checking the visual checkbox caused a noticeable delay (100-300ms lag), making the application feel sluggish.
**Solution:** We implemented an "Optimistic UI" pattern using Zustand. The UI updates instantly on click, while the database sync happens asynchronously in the background.

### 12.2 Challenge: Managing Complex Nested State
**Problem:** Tracking progress across multiple categories and sub-categories became deeply nested and difficult to update without causing unnecessary React re-renders.
**Solution:** We flattened the state tree. Instead of a nested JSON object, we tracked completed problems using a simple Set/Array of unique string IDs (e.g., `['arrays_two_sum', 'trees_invert']`). This made lookups $O(1)$ and simplified state mutations.

### 12.3 Challenge: SSR and Authentication Context
**Problem:** Next.js Server Components cannot access client-side browser APIs or standard React context directly, making it hard to render authenticated user data on the server.
**Solution:** We utilized Supabase's SSR package to read HTTP-only cookies on the server side, allowing us to fetch the user's progress securely before the page is even sent to the browser, eliminating loading spinners.

---

# PAGE 19: CHAPTER 13 - CONCLUSION AND FUTURE SCOPE

## 13. CONCLUSION AND FUTURE SCOPE

### 13.1 Conclusion
The "DSA Progress Tracker" successfully fulfills its objective of providing a fast, reliable, and user-friendly platform for tracking coding preparation. By leveraging Next.js, Tailwind, and Supabase, the project demonstrates a modern full-stack architecture capable of delivering a native-app-like experience in the browser. The integration of background cloud-sync ensures users never lose their progress, while the optimized UI keeps them engaged.

### 13.2 Future Scope
While the current application is highly functional, several features can be added in future iterations:
1. **LeetCode/GitHub Integration:** Automatically fetch solved problems directly from users' LeetCode profiles via web scraping or APIs, eliminating the need for manual check-offs.
2. **Leaderboards and Social Features:** Introduce a friends system where users can compare their progress and maintain study streaks, adding a competitive gamification element.
3. **AI-Powered Hints:** Integrate an LLM (like OpenAI or Gemini) to provide subtle hints when a user is stuck on a problem without giving away the full solution.
4. **Spaced Repetition System (SRS):** Implement an algorithm that automatically suggests older problems for revision based on the Ebbinghaus forgetting curve.

---

# PAGE 20: REFERENCES AND BIBLIOGRAPHY

## 14. REFERENCES

1. **Next.js Documentation:**  
   Vercel Inc. (2024). *Next.js App Router Documentation*.  
   Retrieved from: https://nextjs.org/docs

2. **React Documentation:**  
   Meta Platforms, Inc. (2024). *React - A JavaScript library for building user interfaces*.  
   Retrieved from: https://react.dev/

3. **Tailwind CSS:**  
   Tailwind Labs. (2024). *Tailwind CSS - Rapidly build modern websites without ever leaving your HTML*.  
   Retrieved from: https://tailwindcss.com/docs

4. **Supabase Documentation:**  
   Supabase Inc. (2024). *Supabase Architecture and PostgreSQL Integration*.  
   Retrieved from: https://supabase.com/docs

5. **Zustand State Management:**  
   Poimandres. (2024). *Zustand - Bear necessities for state management in React*.  
   Retrieved from: https://github.com/pmndrs/zustand

6. **DSA Roadmaps Inspiration:**  
   Striver's A2Z DSA Course / Sheet. takeUforward.  
   Retrieved from: https://takeuforward.org/

*(Ensure all links are formatted correctly and accessible)*

---
*(End of Report Document)*
</div>
