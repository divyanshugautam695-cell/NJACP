"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!supabase) return setError("Authentication is not connected yet.");
    if (!ready) return setError("This reset link is invalid or has expired. Please request a new one.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else {
      setMessage("Your password has been updated. You can continue to NJACP.");
      setTimeout(() => router.replace("/"), 1200);
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-5">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.055] p-7 shadow-2xl">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-bold">N</div>
        <h1 className="text-center text-2xl font-semibold">Set a new password</h1>
        <p className="mt-2 text-center text-sm text-slate-400">Choose a new password for your NJACP account.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" minLength={6} required placeholder="New password" className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 outline-none focus:border-cyan-300/60" />
          <button className="w-full rounded-xl bg-cyan-300 py-3 font-semibold text-slate-950">Update password</button>
        </form>
        {error && <p className="mt-4 rounded-xl bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
        {message && <p className="mt-4 rounded-xl bg-cyan-400/10 p-3 text-sm text-cyan-100">{message}</p>}
      </section>
    </main>
  );
}
