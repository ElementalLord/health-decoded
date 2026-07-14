# Prompt 27 — AI Safety, Guardrails & Medical Boundaries

## Objective

Strengthen the AI Tutor’s educational-only boundary without changing its interface, persistence model, data schema, or navigation.

## Safety Pipeline

Each user message is classified server-side before context retrieval or any Gemini call. User messages in supplied temporary conversation history are checked too. A refused message returns a standardized plain-text response and never reaches Gemini.

## Categories

- Lesson Question
- Medication Education
- Nutrition Education
- Exercise Education
- General Type 2 Diabetes Education
- Caregiver Guidance
- Lifestyle Support
- Emotional Support
- Medical Advice Request
- Emergency / Crisis
- Prompt Injection / Abuse
- Unknown

## Guardrails

- Prompt-injection and hidden-prompt requests are refused.
- Emergency and crisis wording receives immediate emergency-services guidance without normal tutoring.
- Diagnosis, personal laboratory interpretation, dose changes, prescription changes, pregnancy-related medication questions, and surgery-related medical advice are refused with a calm redirection to qualified care.
- Provider prompts require careful confidence language and reviewed Health Decoded content remains the first educational source.
- Operational logging records only category, refusal type, latency bucket, size bucket, count bucket, correlation ID, and outcome. It never records messages, responses, personal data, or prompts.

## Tests

Run the focused guardrail tests with:

```bash
npm run test:ai-safety
```
