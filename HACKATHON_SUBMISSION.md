# FirstCommit 2026 — NJACP Submission Pack

## Project

**NJACP — Non-Judgmental AI Companion for Pupils**

NJACP is a student-first AI companion designed to help pupils handle school pressure, difficult study days, procrastination, and planning in a non-judgmental way.

## What was newly built for the hackathon

The main hackathon addition is **Adaptive Study**, a dedicated study-planning experience built on top of the existing NJACP app.

Students can provide:

- Current energy level
- Available study time
- Exam proximity
- Study tasks and priorities

The planner then creates or adapts a task queue around those conditions.

### Adaptive Study features

- Adaptive task planning
- Priority-aware task ordering
- Energy-aware study recommendations
- Available-time based planning
- Exam-proximity adjustment
- Manual task creation
- Progress tracking
- "Why this task?" explanations
- AI-assisted planning through the Hugging Face API
- Deterministic local fallback when the AI service is unavailable
- 25-minute focus session
- Local study streak tracking
- Revision recommendations
- Weekly study analytics
- Missed-day recovery mode
- Browser-local persistence for planner data

## Why it is different

Traditional study planners often assume that a student's available time and energy are constant.

NJACP's Adaptive Study flow treats those as changing inputs.

Instead of simply asking:

> "What should I study?"

the planner can adapt to:

> "What can I realistically study right now, given my time, energy, priorities, and exam timeline?"

The goal is to make planning more responsive and recovery-friendly rather than turning a missed session into a reason to abandon the plan.

## Existing project vs. hackathon work

NJACP existed before the hackathon. The submission does **not** claim that the entire application was created during the event.

The hackathon contribution is the substantial Adaptive Study feature and its supporting documentation, fallback behavior, analytics, recovery flow, and validation work added to the existing project.

## Demo flow

1. Open the NJACP app.
2. Open **Adaptive Study** from the home page.
3. Set energy level.
4. Set available study time.
5. Set exam proximity.
6. Add or review study tasks.
7. Generate/adapt the plan.
8. Complete a task and observe progress.
9. Open a task's **Why this task?** explanation.
10. Start the focus session.
11. Check weekly analytics.
12. Try missed-day recovery mode.

## Technical stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Hugging Face Inference Providers
- Local browser storage for planner persistence
- Capacitor Android support in the existing project

## Architecture

```text
Student
   |
   v
NJACP Next.js UI
   |
   +------ Conversation AI
   |
   +------ Adaptive Study
              |
              +-- Energy
              +-- Available time
              +-- Exam proximity
              +-- Task priority
              |
              v
        Adaptive planner
              |
       +------+------+
       |             |
       v             v
Hugging Face     Local fallback
       |             |
       +------+------+
              v
        Study plan + explanations
              |
       +------+------+
       |      |      |
       v      v      v
    Focus  Progress Analytics
    mode    tracking
              |
              v
       Recovery mode
```

## Repository

https://github.com/divyanshugautam695-cell/NJACP

## Main Adaptive Study route

`/study`

## Important safety note

NJACP is not a therapist, doctor, or emergency service. Its safety behavior is designed to avoid diagnosing students or providing instructions for self-harm or violence and to encourage appropriate human support when high-risk language is detected.

## Honest project history

The repository contains the actual development history of the feature. No backdated or fabricated commits are used.

## Suggested submission description

**NJACP is a non-judgmental AI companion for pupils, and its new Adaptive Study module helps students plan around their real situation instead of assuming every day has the same time and energy. Students enter their energy, available time, exam proximity, and tasks; NJACP adapts the study queue, explains priorities, tracks progress, provides focus sessions and analytics, and offers a recovery mode after missed study days. The feature uses AI when available and a deterministic local fallback when it is not, making the planner more resilient.**

## Suggested short pitch

**"A study planner that adapts to the student, not the other way around."**
