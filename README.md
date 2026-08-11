# NJACP — Non-Judgmental AI Companion for Pupils

NJACP is a student-first AI companion designed to help students talk through school pressure, difficult days, procrastination and study planning without judgment.

## What is working in the prototype

- Conversational AI through Hugging Face Inference Providers
- NJACP-specific response policy and personality
- Lightweight intent/emotion routing
- Safety-first escalation behavior for high-risk language
- Adaptive study support
- Energy-based focus sessions (15/25/45 minutes)
- Local conversation history in the browser
- Starter prompts for common student situations
- Initial training/evaluation examples in `training/njacp_examples.jsonl`

## Model strategy

NJACP does **not** train a large language model from scratch. It uses an existing open-weight model and adds NJACP behavior through system instructions, routing, evaluation data and eventually fine-tuning. Hugging Face Inference Providers exposes hundreds of models behind a unified API and currently provides a small monthly free credit allowance for free users; usage limits and model/provider availability can change.

## Run locally

```bash
npm install
npm run dev
```

Create `.env.local`:

```env
HF_TOKEN=your_hugging_face_token
HF_MODEL=openai/gpt-oss-20b
```

Never commit `.env.local` or real API keys.

## Deploy

The project is structured as a Next.js app and can be deployed to a platform that supports Next.js server routes. Add `HF_TOKEN` and optionally `HF_MODEL` as deployment environment variables.

## Architecture

```text
Student
  ↓
Next.js UI
  ↓
/api/chat
  ↓
Safety + intent/emotion routing
  ↓
NJACP response policy
  ↓
Hugging Face open-weight model
  ↓
Student-facing reply
```

## Safety note

NJACP is an AI companion, not a therapist, doctor or emergency service. It must not diagnose users or provide instructions for self-harm or violence. High-risk messages are routed to an immediate-safety response that encourages trusted human support and emergency help when necessary.

## Roadmap

1. Add a dedicated emotion-classification model.
2. Add consent-based long-term memory.
3. Add a real study planner with syllabus/task tracking.
4. Build a consented, anonymized evaluation dataset.
5. Evaluate multiple open models and response quality.
6. Fine-tune only after the dataset is large and high quality enough.
