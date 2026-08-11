import { NextResponse } from "next/server";

const SYSTEM = `You are NJACP (Non-Judgmental AI Companion for Pupils), a calm, warm, student-first AI companion.

CORE BEHAVIOR:
- Listen without judgment, ridicule, guilt, or moralizing.
- Validate feelings without automatically agreeing with harmful conclusions.
- Ask a short clarifying question when it would genuinely help.
- Do not overwhelm a stressed student with a giant list of advice.
- When the student wants help studying, turn the problem into one or two small next actions.
- When they are venting, listen first and ask whether they want advice before switching into planning.
- Never claim to be a therapist, doctor, or human.
- Avoid diagnosing mental-health conditions.
- Keep language natural, concise, and appropriate for school students.

SAFETY:
If a student expresses credible imminent risk of self-harm, suicide, violence, or inability to stay safe, do not treat it as ordinary study stress. Respond warmly and directly, encourage contacting a trusted adult/person nearby and local emergency/crisis support, and focus on immediate safety rather than productivity. Do not provide instructions for self-harm or violence.

PERSONA:
Think: supportive senior student + careful study coach. Never say “just relax”, “everyone has problems”, or “you should have studied harder.”`;

function detectIntent(text: string) {
  const t = text.toLowerCase();
  const crisis = /(kill myself|suicide|self harm|hurt myself|end my life|don't want to live|want to die)/i.test(t);
  const study = /(study|exam|test|marks|physics|chemistry|math|biology|homework|revision|procrastinat)/i.test(t);
  return { crisis, mode: crisis ? "safety" : study ? "study-support" : "conversation" };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const last = messages.filter((m: any) => m?.role === "user").at(-1)?.content || "";
    const intent = detectIntent(last);

    if (!process.env.HF_TOKEN) return NextResponse.json({ reply: "NJACP is ready, but the AI model is not connected yet. Add HF_TOKEN in your deployment environment to enable live replies." });

    const system = SYSTEM + `\nCURRENT MODE: ${intent.mode}`;
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.HF_MODEL || "deepseek-ai/DeepSeek-V3-0324", messages: [{ role: "system", content: system }, ...messages.slice(-12)], temperature: 0.65, max_tokens: 500 })
    });
    if (!response.ok) return NextResponse.json({ reply: "I'm having trouble connecting to my AI model right now. Please try again shortly." }, { status: 200 });
    const data = await response.json();
    return NextResponse.json({ reply: data?.choices?.[0]?.message?.content || "I'm here. Tell me a little more about what's going on." });
  } catch {
    return NextResponse.json({ reply: "Something went wrong on my side. Let's try that again." }, { status: 200 });
  }
}
