# Adaptive Study Companion

The `/study` route adds an adaptive planning layer to NJACP.

## What it does
- Uses energy, available minutes, and exam proximity to resize the study queue.
- Keeps completed work visible instead of silently removing it.
- Supports manual task creation and one-tap completion.
- Uses Hugging Face when `HF_TOKEN` is configured.
- Falls back to a deterministic local planner when the model is unavailable.

## Honest development history
This feature was added on the `firstcommit-adaptive-study` branch as new work. The pre-existing NJACP application remains separate from the hackathon additions.

## Demo
1. Open `/study`.
2. Add a subject/topic.
3. Change energy and available time.
4. Press **Adapt my plan**.
5. Complete a task and adapt again.

The fallback planner is intentionally deterministic so the core demo remains usable without an AI API key.
