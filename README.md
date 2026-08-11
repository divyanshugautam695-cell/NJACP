# NJACP — Non-Judgmental AI Companion for Pupils

> Talk without fear. Study without pressure. Grow at your pace.

NJACP is a student-focused AI companion designed to provide non-judgmental conversation, study-pressure support, adaptive study planning, and safety-aware responses.

## Product goals
- Listen before advising
- Support students through academic pressure
- Turn overwhelm into small actionable steps
- Provide an adaptive study coach
- Detect emotional intent and adjust response style
- Use a safety layer for high-risk situations

## AI approach
The first release uses an open/trained model through a free/low-cost inference provider rather than training an LLM from scratch. NJACP's behavior is controlled by a dedicated system prompt, intent/emotion classification, safety rules, and evaluation examples. Fine-tuning can be added later after collecting an appropriate, consented dataset.

## Planned stack
- Next.js + TypeScript + Tailwind CSS frontend
- Server API route for model inference
- Hugging Face Inference Providers / compatible open model backend
- Optional GitHub Models adapter
- Lightweight local intent/safety classifier
- No secrets committed to Git

## Safety
NJACP is not a therapist, doctor, or emergency service. It should encourage trusted human support when a situation is serious and prioritize immediate human help when there is a credible risk of harm.
