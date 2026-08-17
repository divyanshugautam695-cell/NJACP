"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });
  }, [router]);

  async function googleSignIn() {
    setError("");
    setNotice("");
    if (!supabase) {
      setError("Authentication is not connected yet. Add the Supabase environment variables in Vercel.");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) setError(error.message);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    if (!supabase) {
      setError("Authentication is not connected yet. Add the Supabase environment variables in Vercel.");
      setBusy(false);
      return;
    }

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.replace("/");
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else if (data.session) router.replace("/");
      else setNotice("Account created. Check your email to verify your account, then sign in.");
    }
    setBusy(false);
  }

  async function resetPassword() {
    setError("");
    setNotice("");
    if (!supabase) {
      setError("Authentication is not connected yet.");
      return;
    }
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    if (error) setError(error.message);
    else setNotice("If an account exists for that email, a password-reset link has been sent.");
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-5 py-8 overflow-hidden relative">
      <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative w-full max-w-[430px]">
        <div className="text-center mb-7">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[18px] bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-600 text-2xl font-bold shadow-xl shadow-blue-500/20">N</div>
          <h1 className="text-[30px] font-semibold tracking-tight">Welcome to NJACP</h1>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-6 text-slate-400">A private, non-judgmental space to talk, study, and get through difficult days.</p>
        </div>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
          <button type="button" onClick={googleSignIn} disabled={busy} className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white font-medium text-slate-900 transition hover:bg-slate-100 disabled:opacity-60">
            <span className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 text-[15px] font-bold">G</span>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-slate-500"><span className="h-px flex-1 bg-white/10" />or<span className="h-px flex-1 bg-white/10" /></div>

          <div className="mb-5 grid grid-cols-2 rounded-xl bg-black/20 p-1">
            <button type="button" onClick={() => { setMode("signin"); setError(""); setNotice(""); }} className={`rounded-[10px] py-2.5 text-sm transition ${mode === "signin" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>Sign in</button>
            <button type="button" onClick={() => { setMode("signup"); setError(""); setNotice(""); }} className={`rounded-[10px] py-2.5 text-sm transition ${mode === "signup" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>Create account</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10" />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Password
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={6} placeholder="At least 6 characters" className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10" />
            </label>
            {mode === "signin" && <button type="button" onClick={resetPassword} className="text-left text-xs text-cyan-300 hover:text-cyan-200">Forgot password?</button>}
            <button disabled={busy} className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 font-semibold text-slate-950 shadow-lg shadow-blue-500/10 transition hover:brightness-105 disabled:opacity-60">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {error && <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm leading-5 text-red-200">{error}</div>}
          {notice && <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm leading-5 text-cyan-100">{notice}</div>}

          <p className="mt-6 text-center text-[11px] leading-5 text-slate-500">Your account helps NJACP keep your experience consistent across devices. NJACP is an AI companion, not a replacement for trusted people or professional care.</p>
        </section>
      </div>
    </main>
  );
}
