"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };
type Session = { id: string; title: string; messages: Message[]; updatedAt: number };

const starters = [
  "I feel overwhelmed by my studies.",
  "I failed a test and don't know what to do.",
  "Help me make a study plan for today.",
  "I just need someone to listen."
];

const initial: Message[] = [{ role: "assistant", content: "Hey. I'm NJACP. You don't have to have everything figured out. Tell me what's going on — I'll listen first, without judging you." }];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [energy, setEnergy] = useState(6);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("njacp-sessions");
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setSeconds((s) => {
        if (s > 0) return s - 1;
        setMinutes((m) => {
          if (m <= 1) { setTimerRunning(false); return 0; }
          return m - 1;
        });
        return 59;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const timeLabel = useMemo(() => `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`, [minutes, seconds]);

  function saveSession(next: Message[]) {
    const title = next.find((m) => m.role === "user")?.content.slice(0, 42) || "New conversation";
    const session: Session = { id: Date.now().toString(), title, messages: next, updatedAt: Date.now() };
    const updated = [session, ...sessions].slice(0, 10);
    setSessions(updated);
    localStorage.setItem("njacp-sessions", JSON.stringify(updated));
  }

  async function sendMessage(text = input) {
    const value = text.trim();
    if (!value || loading) return;
    const next = [...messages, { role: "user", content: value } as Message];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const data = await res.json();
      const finished = [...next, { role: "assistant", content: data.reply || "I'm here with you. Let's take this one step at a time." } as Message];
      setMessages(finished); saveSession(finished);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I couldn't reach the AI right now. Please try again in a moment." }]);
    } finally { setLoading(false); }
  }

  function submit(e: FormEvent) { e.preventDefault(); void sendMessage(); }
  function newChat() { setMessages(initial); setInput(""); }
  function loadSession(s: Session) { setMessages(s.messages); setShowSidebar(false); }
  function startFocus() { setTimerRunning(true); void sendMessage(`I want to study for ${minutes} minutes. My energy is ${energy}/10. Give me a very small focus plan.`); }

  return <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
      <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-200">N</div><div><div className="font-black tracking-tight">NJACP</div><div className="text-xs text-slate-500">Non-Judgmental AI Companion for Pupils</div></div></div>
      <div className="flex items-center gap-2"><button onClick={() => setShowSidebar(!showSidebar)} className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm">History</button><button onClick={newChat} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">New chat</button></div>
    </header>

    {showSidebar && <aside className="fixed right-4 top-20 z-20 w-80 rounded-2xl border bg-white p-4 shadow-2xl"><div className="mb-3 font-bold">Recent conversations</div>{sessions.length === 0 ? <p className="text-sm text-slate-400">Your conversations will appear here. Stored locally in this prototype.</p> : sessions.map(s => <button key={s.id} onClick={() => loadSession(s)} className="mb-2 w-full rounded-xl bg-slate-50 p-3 text-left text-sm hover:bg-slate-100">{s.title}</button>)}</aside>}

    <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 md:px-6 lg:grid-cols-[0.9fr_1.35fr_0.7fr]">
      <div className="rounded-3xl border bg-white p-7 shadow-sm"><p className="text-sm font-bold text-indigo-600">A place to think out loud.</p><h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">You don't have to carry it all alone.</h1><p className="mt-4 leading-7 text-slate-600">Talk about school pressure, failure, procrastination, a difficult day, or whatever is on your mind. NJACP listens first, then helps you find the next step.</p><div className="mt-7 grid gap-2">{starters.map(s => <button key={s} onClick={() => void sendMessage(s)} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">{s}</button>)}</div><div className="mt-7 rounded-2xl bg-indigo-50 p-4"><div className="font-semibold">How NJACP works</div><div className="mt-2 text-sm leading-6 text-slate-600">Listen → understand → choose what you need → take one manageable step.</div></div></div>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-xl"><div className="flex items-center justify-between border-b px-5 py-4"><div><div className="font-bold">Your private conversation</div><div className="text-xs text-slate-400">Supportive • student-first • no lectures</div></div><div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_#dcfce7]"/></div><div className="h-[600px] space-y-4 overflow-y-auto p-5">{messages.map((m,i)=><div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}>{m.content}</div></div>)}{loading && <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-400 w-fit">NJACP is thinking…</div>}</div><form onSubmit={submit} className="flex gap-2 border-t p-4"><input value={input} onChange={e => setInput(e.target.value)} placeholder="Tell NJACP what's on your mind…" className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"/><button disabled={loading} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Send</button></form></div>

      <div className="space-y-5"><div className="rounded-3xl border bg-white p-5 shadow-sm"><div className="text-sm font-bold">⚡ Focus session</div><p className="mt-1 text-xs leading-5 text-slate-500">Tell NJACP your energy. It will keep the plan realistic.</p><label className="mt-5 block text-xs font-semibold text-slate-500">Energy: {energy}/10</label><input type="range" min="1" max="10" value={energy} onChange={e => setEnergy(+e.target.value)} className="mt-2 w-full"/><label className="mt-4 block text-xs font-semibold text-slate-500">Session: {minutes} min</label><div className="mt-2 flex gap-2">{[15,25,45].map(n => <button key={n} onClick={() => {setMinutes(n);setSeconds(0)}} className={`flex-1 rounded-xl border py-2 text-xs font-semibold ${minutes === n ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"}`}>{n}m</button>)}</div><div className="mt-5 text-center text-4xl font-black tabular-nums">{timeLabel}</div><button onClick={() => timerRunning ? setTimerRunning(false) : startFocus()} className="mt-3 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white">{timerRunning ? "Pause focus" : "Start with NJACP"}</button></div><div className="rounded-3xl border bg-white p-5 shadow-sm"><div className="text-sm font-bold">🌱 Today</div><div className="mt-3 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-slate-50 p-3"><div className="text-xl font-black">{messages.filter(m => m.role === "user").length}</div><div className="text-[10px] text-slate-400">messages</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xl font-black">{energy}</div><div className="text-[10px] text-slate-400">energy</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xl font-black">{minutes}</div><div className="text-[10px] text-slate-400">focus min</div></div></div></div><div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 text-xs leading-5 text-amber-800">NJACP is an AI companion, not a replacement for a trusted person or professional help. If you may be in immediate danger, seek human help now.</div></div>
    </section>
  </main>;
}
