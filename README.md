# CHAKRAVYUH-The Purpose Drivens

COGNIVOLT ⚡
AI-Assisted ENTC Learning & Innovation Platform
By students, for students.
Cognivolt is a student-powered learning platform for Electronics and Telecommunication Engineering (ENTC). It is designed to make engineering concepts more practical, engaging, and collaborative through peer-created learning resources, AI-assisted explanations, interactive circuit challenges, virtual experiments, real-world missions, and student project sharing.
> **Event:** CHAKRAVYUH — AI Vibe Coding Challenge  
> **Problem focus:** Smart ENTC Learning & Innovation Platform  
> **Project status:** Proposed architecture and feature roadmap; update feature claims to match the working implementation.
---
📑 Table of Contents
Vision
Problem Statement
Core Modules
Key Differentiators
Actors and Login Roles
Authentication and Security
Technology Stack
System Architecture
Database Design
Student Journey
Hackathon MVP
Getting Started
Environment Variables
Quality and Testing
Responsible Engineering
Roadmap
Contributing
License
---
💡 Vision
Help ENTC students move beyond memorizing theory by giving them a place to learn, experiment, debug, build, collaborate, and demonstrate what they know.
🎯 Problem Statement
Electronics and Telecommunication Engineering combines electronics, communication systems, embedded technology, signal processing, and AI. Students can find these concepts difficult when learning is limited to theory.
Cognivolt aims to connect structured learning with interactive practice, guided experimentation, peer collaboration, and engineering problem-solving in one platform.
✨ Core Modules
1. Student Learning Hub
Browse student-created tutorials, notes, revision materials, and practical guides.
Organize resources by subject, semester, unit, topic, and difficulty.
Search and filter learning resources.
Connect tutorials with quizzes, puzzles, reflection questions, and discussions.
Use exam revision collections, flashcards, and timed quizzes where implemented.
2. AI Learning Assistant
Get beginner-friendly explanations of technical concepts.
Ask questions about a selected tutorial or topic.
Receive progressive hints, from concept hints to more detailed explanations.
Generate practice questions and revision prompts from approved learning material.
Get debugging guidance and structured feedback on design choices.
Practice viva questions and explain submitted designs.
Clearly distinguish AI-generated suggestions from verified simulator results.
3. Circuit Games & Puzzle Arena
Practice with logic-gate puzzles and component-matching activities.
Assemble circuits, connect nodes, and predict outputs.
Identify predefined faults and repair circuit configurations.
Use progressive clues rather than seeing the answer immediately.
Earn points for correct, validated solutions.
4. AI Design Studio & Virtual Lab
Translate a natural-language engineering requirement into a structured design proposal.
Inspect and edit proposed components, connections, parameters, and logic.
Build supported circuits in a visual workspace.
Change inputs and parameters and observe simulated outputs.
Check digital circuits against truth tables.
Compare configurations and test defined edge cases.
Save, reset, and revisit supported designs.
5. Engineering Missions & Innovation Lab
Apply concepts to scenario-based engineering tasks.
Work within component, resource, or design constraints.
Test solutions against clear acceptance criteria.
Explore mission examples such as automatic streetlights, water-level alerts, smart agriculture, and communication scenarios where supported.
Record what was built, what failed, what changed, and what tests demonstrated.
Earn rewards only after required validation criteria are met.
6. Student Community & Project Exchange
Ask questions with text, images, code, or circuit descriptions.
Share peer answers, explanations, diagrams, and learning links.
Find learning partners, create study groups, and support peer mentoring.
Publish projects with problem statements, component lists, diagrams, code, and demonstrations.
Share troubleshooting notes and lessons learned.
Report incorrect, copied, inappropriate, or unsafe content for review.
7. Progress, Rewards & Portfolio
Track completed activities, challenge attempts, recent activity, and XP.
Earn badges and ranks for verified achievements.
Maintain a portfolio of projects, saved designs, and completed missions.
Track submission history and improvements.
Recognize helpful contributions, not just upload volume or clicks.
Recommend the next activity based on demonstrated performance.
8. Engineering Challenge Arena
Solve structured ENTC problems by topic and difficulty.
Submit supported circuit configurations, logic expressions, predictions, or parameter choices.
Evaluate solutions against defined test cases.
Inspect passed and failed cases, then retry with progressive hints.
Review explanations for verified solutions.
Support student-created challenges after quality and validity checks.
Unlock further challenges through demonstrated mastery.
---
🌟 Key Differentiators
Tutorial Remix: Pair a lesson with a puzzle, quiz, reflection, and discussion.
ECHO — AI Mistake Challenge: Diagnose and repair a controlled circuit fault.
Fault Hunter: Investigate a predefined circuit failure using evidence and clues.
AI Design Copilot: Convert a written requirement into an editable design proposal.
What-If Lab: Change supported parameters and compare outcomes.
Engineering Missions: Apply concepts to practical scenarios with constraints and test criteria.
Verified Rewards: Award XP for validated results rather than clicks or unverified AI output.
Project Reflection: Capture the engineering process, including failures, revisions, and test evidence.
These are planned differentiators; describe a feature as implemented only when it works in the current build.
---
👥 Actors and Login Roles
Role / Actor	Purpose	Main Permissions
Student / Learner	Learn and practice ENTC concepts	Browse resources, use AI help, play circuit games, simulate supported circuits, complete challenges, track progress
Student Creator / Contributor	Share knowledge with peers	Publish tutorials and projects, create supported puzzles, answer doubts; a capability within a student account
Faculty / Mentor (optional)	Guide learners and review work	Provide feedback and review educational resources and projects
Administrator	Maintain a safe, organized platform	Manage accounts and permissions, review reports, moderate content, manage challenge settings
AI Learning Assistant (system actor)	Support learning	Explain concepts, generate hints and practice questions, assist with design review and viva preparation
Circuit Simulator / Validator (system actor)	Check supported engineering solutions	Run simulations and test cases, evaluate expected outputs, provide validation results
Recommended first version: Student and Administrator login roles, with creator permissions available to students. Add Faculty/Mentor login when its workflows are ready. AI and simulation services do not need separate user accounts.
Use Cases by Actor
Actor	Main Use Cases
Student	Register, log in, learn, ask AI, play circuit games, simulate supported circuits, solve challenges, complete missions, earn rewards
Student Creator	Upload tutorials, create puzzles, publish projects, answer doubts
Faculty / Mentor	Review projects, guide learners, provide feedback
Administrator	Manage accounts, moderate content, review reports, manage reward rules
AI Assistant	Explain concepts, generate hints, review designs, conduct viva practice
Simulator / Validator	Run supported simulations, evaluate test cases, verify challenge results
---
🔐 Authentication and Security
Recommended authentication flow
New users register with their name, email, and password.
Public registrations receive the Student role by default.
Existing users log in with their credentials.
The application validates credentials and routes users to the appropriate dashboard.
Failed authentication displays a clear error and offers retry or password reset.
Administrators receive access only through a secure, controlled provisioning process.
Security expectations
Protect dashboards and user-specific data.
Enforce permissions with backend authorization and database policies—not only hidden frontend buttons.
Use Supabase Row Level Security (RLS) for data access where applicable.
Never allow public registration to grant Administrator privileges.
Keep API keys and secrets on the server; never expose private keys in client-side code.
Do not commit `.env` files, passwords, tokens, or service-role keys.
Validate uploaded content and user submissions.
Clearly label demo accounts and remove or rotate demo credentials before production.
---
🧰 Technology Stack
The following stack is recommended for a fast, interactive prototype that can grow into a larger application. It is the target architecture; update this section to reflect the technologies actually installed in the repository.
Layer	Recommended Technology	Purpose
Framework	Next.js + React	Full-stack web application, routing, server rendering, and server-side routes
Language	TypeScript	Type-safe application and circuit logic
Styling	Tailwind CSS	Responsive layouts and consistent design
UI components	shadcn/ui	Reusable accessible components, dialogs, forms, and navigation
Backend / database	Supabase + PostgreSQL	Persistent data, hosted database, authentication, and storage
AI integration	OpenAI API	Explanations, hints, quiz generation, design feedback, and viva practice
Circuit editor	React Flow (`@xyflow/react`)	Node-based visual workspace for components and connections
Circuit evaluation	Custom deterministic TypeScript logic engine	Evaluate supported digital logic and test truth tables reliably
Client state	Zustand	Manage circuit state, input changes, and editor interactions
Forms / validation	React Hook Form + Zod	Validate registration, submissions, and user input
Server-state handling	TanStack Query (optional)	Cache and synchronize server data
Charts	Recharts	Progress, quiz performance, and learning analytics
Animations	Motion for React (optional)	Subtle transitions, puzzle feedback, and achievement animations
Icons	Lucide React	Consistent interface icons
Unit / component tests	Vitest + React Testing Library	Test logic, components, and important states
End-to-end tests	Playwright (optional)	Test login and complete student journeys in a browser
Deployment	Vercel	Deploy the Next.js application
Version control	Git + GitHub	Collaboration, code history, and project submission
Why this stack?
Fast development: Next.js, shadcn/ui, and Supabase reduce the amount of infrastructure you need to build yourself.
Interactive learning: React Flow and a dedicated logic engine support a visual circuit experience.
AI with guardrails: Server-side API routes keep credentials private and let the application control prompts and validation.
Persistent progress: PostgreSQL can store attempts, verified results, rewards, and portfolio items.
Growth path: The modular design allows richer simulation, community features, and more ENTC topics to be added later.
Circuit Simulation Strategy
A visual editor is not, by itself, a circuit simulator. Choose the simulation approach according to the required behavior.
Phase 1 — Digital logic (recommended for the MVP)
Use React Flow to draw and connect supported nodes.
Implement AND, OR, NOT, NAND, NOR, and XOR evaluation in TypeScript.
Test all relevant input combinations against deterministic expected outputs.
Display input states, gate outputs, and truth-table results.
Phase 2 — Broader electronics
Evaluate integrating an existing simulator such as CircuitJS/Falstad for supported electronic circuit experiments.
Check licensing, embedding options, accessibility, and browser compatibility before integration.
Phase 3 — Advanced analog simulation
Consider a SPICE-based engine for analog circuit behavior and waveform analysis.
Treat this as an extension because integration, execution, and validation require additional engineering.
Do not claim real analog measurements, oscilloscope output, or physical hardware validation unless the implementation genuinely supports them.
---
🏗️ System Architecture
```text
┌───────────────────────────────────────────────────────────┐
│                    COGNIVOLT FRONTEND                     │
│          Next.js + React + TypeScript + Tailwind           │
│                                                           │
│  Learning Hub | AI Assistant | Circuit Lab | Challenges   │
│  Missions     | Community    | Dashboard   | Portfolio    │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                       │
│     Server routes | Validation | Authorization | AI calls  │
└───────────────────┬──────────────────────┬────────────────┘
                    │                      │
                    ▼                      ▼
┌────────────────────────────┐  ┌───────────────────────────┐
│       SUPABASE              │  │     AI + CIRCUIT ENGINE   │
│ PostgreSQL | Auth | Storage │  │ OpenAI API (server-side)  │
│ Row Level Security          │  │ TypeScript logic evaluator│
└────────────────────────────┘  └───────────────────────────┘
```
Core design principles
Use trusted backend validation for scored challenges.
Keep AI-generated designs and mission content as proposals until validated.
Store challenge attempts and reward transactions for auditability.
Separate frontend presentation from business rules and scoring logic.
Apply access control to every private resource and privileged action.
---
🗄️ Database Design
Suggested PostgreSQL tables for the platform:
Table	Stores
`profiles`	Student profile, role, avatar, and preferences
`learning_resources`	Tutorials, notes, topics, creator, and publication status
`challenges`	Problem statements, difficulty, rules, and expected results
`challenge_attempts`	Submissions, test results, timestamps, and attempt history
`circuits`	Saved circuit layouts, connections, and configurations
`missions`	Engineering tasks, constraints, and acceptance criteria
`projects`	Student projects, descriptions, and demonstrations
`community_posts`	Questions, answers, and discussions
`reports`	Reported content and moderation status
`achievements`	Badge definitions and reward criteria
`user_achievements`	Earned badges and timestamps
`xp_transactions`	Auditable records of points awarded
Data integrity recommendations
Use unique IDs and foreign keys to relate users, challenges, attempts, and projects.
Store challenge results and reward transactions with enough evidence to audit them.
Grant XP through trusted server-side logic after validation.
Protect tables with appropriate RLS policies.
Store only necessary user information and define a sensible retention policy.
Avoid trusting client-submitted scores, role values, or validation flags.
---
🧭 Example Student Journey
A student opens a tutorial about logic gates.
The student asks the AI Learning Assistant to clarify a confusing concept.
The student completes a Jumble Circuits puzzle.
The student submits an AND-gate solution to the Engineering Challenge Arena.
The application checks the solution against the required truth-table cases.
The student applies the concept in an engineering mission.
The student shares a useful explanation or project with classmates.
Verified completion updates the student's XP, badges, progress, and portfolio.
---
🏆 Recommended Hackathon MVP
For a short build, prioritize a small, connected, working experience rather than incomplete versions of every planned feature.
[ ] Student registration/login or clearly labelled demo login
[ ] Student dashboard with progress and XP
[ ] Small tutorial library with sample ENTC resources
[ ] Working AI help interaction, if API access is configured
[ ] Several deterministic logic-gate challenges
[ ] Interactive circuit editor with visible input/output behavior
[ ] One end-to-end engineering mission
[ ] Rewards granted only after correct or validated completion
[ ] Basic student contributions or doubt exchange
[ ] Simple administrator moderation view
Suggested build order
Set up the app shell, navigation, and responsive visual design.
Implement student access and sample learning content.
Build one working logic-gate challenge and its deterministic validator.
Connect challenge completion to progress and XP.
Add AI assistance through a server-side endpoint if time and API access permit.
Finish with error states, responsive checks, and a complete demo journey.
---
▶️ Getting Started
The commands below are a template for a new Next.js app. If this repository already exists, follow its actual package scripts and dependency manager instead of recreating it.
Prerequisites
Node.js LTS
npm (or the package manager configured by the repository)
Git
Supabase project credentials if using Supabase
OpenAI API key if using the OpenAI API
Create a new project
```bash
npx create-next-app@latest cognivolt --typescript --tailwind --eslint --app
cd cognivolt
```
Install the suggested core dependencies:
```bash
npm install @supabase/supabase-js @supabase/ssr openai
npm install @xyflow/react zustand react-hook-form zod @hookform/resolvers
npm install recharts lucide-react
```
Optional libraries:
```bash
npm install @tanstack/react-query motion
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright
```
Set up shadcn/ui using its current official installation instructions, then add only the components the app needs.
Start the development server:
```bash
npm run dev
```
Open the local URL shown in the terminal (usually `http://localhost:3000`).
> These commands provide a starting point, not a guarantee that every package is configured automatically. Check the current framework and package documentation, configure environment variables, and run the project before committing setup instructions.
Typical Git workflow
```bash
git init
git add .
git commit -m "Initial Cognivolt setup"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
If the repository is already initialized or has a remote, do not repeat `git init` or add a second `origin`. Replace the placeholder with your real repository URL.
---
🔑 Environment Variables
Create a local `.env.local` file for development. Use the exact variables required by the codebase.
Example for Next.js and Supabase:
```dotenv
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
SUPABASE_SERVICE_ROLE_KEY=server_only_secret_if_required
OPENAI_API_KEY=server_only_openai_api_key
```
Security notes:
Use the current Supabase key type recommended by your project; never expose a service-role or secret key to the browser.
`OPENAI_API_KEY` must only be read in server-side code.
Never prefix private secrets with `NEXT_PUBLIC_`.
Add `.env.local` to `.gitignore`.
Configure production secrets in the hosting provider's environment settings.
Do not put real credentials in README examples, screenshots, commits, or public issues.
---
🧪 Quality and Testing
Test the core student journey before a demo or release.
Functional checks
Registration, login, logout, and unauthorized access.
Student and administrator permissions.
Tutorial search and resource display.
AI error handling and API-key protection.
Circuit output correctness for supported input combinations.
Challenge submission and pass/fail results.
XP awards only after valid completion.
Saved designs, project ownership, and progress persistence.
Report submission and moderation behavior.
Suggested commands
```bash
npm run lint
npm run build
npm run test
```
The exact commands depend on scripts configured in `package.json`; add a test script before using `npm run test` if one does not exist.
---
🛡️ Responsible Engineering
Treat AI-generated circuit designs and missions as proposals until validated against supported rules or deterministic test cases.
Clearly label simulated behavior; simulation alone does not prove physical hardware safety or real-world performance.
Award scores only from trusted validation results or transparent contribution criteria.
Publish only learning material that you own or are permitted to share.
Provide reporting and moderation for incorrect, copied, inappropriate, or unsafe content.
Make errors understandable and keep the interface accessible and usable.
Avoid presenting unsupported simulation tools, instruments, measurements, or metrics as implemented features.
---
🗺️ Roadmap
Phase 1 — Core learning experience
[ ] Responsive landing page and student dashboard
[ ] Tutorials and topic navigation
[ ] Basic AI learning assistant
[ ] Deterministic digital logic challenges
[ ] Verified progress and XP
Phase 2 — Interactive engineering
[ ] Visual circuit workspace
[ ] Fault Hunter and ECHO challenge
[ ] Engineering mission templates
[ ] Saved circuit designs and project portfolio
Phase 3 — Community and mentorship
[ ] Doubt exchange and peer answers
[ ] Student-created tutorials and puzzles
[ ] Content reporting and moderation
[ ] Faculty/mentor workflows
Phase 4 — Advanced learning tools
[ ] More ENTC topics and validated simulation scenarios
[ ] Analog simulation integration where appropriate
[ ] Personalized recommendations
[ ] Expanded analytics and challenge quality review
---
🤝 Contributing
Cognivolt is envisioned as a collaborative, student-focused learning platform.
Fork the repository.
Create a branch for your change.
Make a focused improvement.
Test the feature and check existing flows.
Submit a pull request with a clear description and screenshots where useful.
Example:
```bash
git checkout -b feature/your-feature-name
git add .
git commit -m "Add: describe your change"
git push origin feature/your-feature-name
```
Keep contributions educational, respectful, secure, and safe. Add setup instructions and tests when introducing new functionality.
---
📜 License
No license has been specified yet. Add a `LICENSE` file before inviting reuse or redistribution. Choose a license that matches the project team's intentions and any third-party dependencies.
---
🙌 Acknowledgement
Built for the CHAKRAVYUH AI Vibe Coding Challenge, with the goal of making ENTC learning more practical, collaborative, and engaging.
COGNIVOLT — Learn it. Build it. Debug it. Share it. ⚡