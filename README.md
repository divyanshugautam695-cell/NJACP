# NJACP — Non-Judgmental AI Companion for Pupils

A student-first AI companion for non-judgmental conversation and study-pressure support.

## Run
`npm install && npm run dev`

Set `HF_TOKEN` in `.env.local` to enable Hugging Face Inference Providers. The app uses an open model through the OpenAI-compatible Hugging Face router. Do not commit secrets.

## AI design
NJACP combines a base model with a dedicated system prompt, lightweight intent/safety detection, conversation memory, and evaluation examples. Fine-tuning can be added later after collecting a consented, high-quality dataset.

## Safety
NJACP is not a therapist or emergency service. Serious safety concerns should be routed toward trusted human support and appropriate emergency/crisis resources.
