"use client";

import { FormEvent, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const starters = [
  "I feel overwhelmed by my studies.",
  "I failed a test and don't know what to do.",
  "Help me make a study plan for today.",
  "I just need someone to listen."
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey. I'm NJACP. You don't have to have everything figured out. Tell me what's going on — I'll listen first, without judging you." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text = input) {
    const value = text.trim();
    if (!value || loading) return;
    const next = [...messages, { role: "user", content: value } as Message];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "I'm here with you. Let's take this one step at a time." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I couldn't reach the AI right now. Your message is still worth talking about — please try again in a moment." }]);
    } finally { setLoading(false); }
  }

  function submit(e: FormEvent) { e.preventDefault(); void sendMessage(); }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-xl text-white shadow-lg">N</div><div><div className="font-bold tracking-tight">NJACP</div><div className="text-xs text-slate-500">Non-Judgmental AI Companion</div></div></div>
        <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm">Private • Supportive • Student-first</span>
      </header>
      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col justify-center py-8"><p className="mb-3 text-sm font-semibold text-indigo-600">A safe place to think out loud.</p><h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight md:text-6xl">You don't have to carry it all alone.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">Talk about school pressure, a difficult day, procrastination, failure, or whatever is on your mind. NJACP listens first, then helps you find the next step.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{starters.map((s) => <button key={s} onClick={() => void sendMessage(s)} className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">{s}</button>)}</div></div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"><div className="border-b border-slate-100 px-5 py-4"><div className="font-semibold">Your conversation</div><div className="text-xs text-slate-400">NJACP is here to listen — no lectures.</div></div><div className="h-[560px] space-y-4 overflow-y-auto p-5">{messages.map((m, i) => <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}>{m.content}</div></div>)}{loading && <div className="text-sm text-slate-400">NJACP is thinking…</div>}</div><form onSubmit={submit} className="flex gap-2 border-t border-slate-100 p-4"><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tell NJACP what's on your mind…" className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none ring-indigo-200 focus:ring-2"/><button disabled={loading} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Send</button></form></div>
      </section>
      <footer className="mx-auto max-w-6xl px-6 pb-8 text-center text-xs text-slate-400">NJACP is an AI companion, not a replacement for trusted people or professional help. If you may be in immediate danger, seek urgent human assistance.</footer>
    </main>
  );
}
