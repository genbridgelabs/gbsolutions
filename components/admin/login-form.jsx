"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (key) => (event) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || "That did not work. Try again.");
        setBusy(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("The connection dropped. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-9 space-y-6">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-[0.76rem] text-ink-soft"
        >
          Studio email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={values.email}
          onChange={update("email")}
          placeholder="studio@gbsolutions.in"
          className="h-11 w-full border-b border-line-strong bg-transparent text-[0.95rem] text-ink outline-none transition-colors placeholder:text-quiet/50 focus:border-brass"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-[0.76rem] text-ink-soft"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={values.password}
          onChange={update("password")}
          placeholder="••••••••••"
          className="h-11 w-full border-b border-line-strong bg-transparent text-[0.95rem] text-ink outline-none transition-colors placeholder:text-quiet/50 focus:border-brass"
        />
      </div>

      {error ? (
        <p className="border-l-2 border-laterite bg-laterite/5 px-4 py-3 text-[0.8rem] text-laterite">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="group flex w-full items-center justify-between bg-indigo px-6 py-4 text-[0.84rem] font-medium text-plaster transition-colors duration-300 hover:bg-ink disabled:cursor-wait disabled:opacity-70"
      >
        <span>{busy ? "Checking…" : "Enter the desk"}</span>
        <span className="h-px w-8 bg-plaster/40 transition-all duration-300 group-hover:w-12 group-hover:bg-brass-light" />
      </button>

      <p className="text-[0.72rem] leading-relaxed text-quiet">
        One account, created with the studio. There is no public sign-up and no
        password reset by email — the studio principal holds the credentials.
      </p>
    </form>
  );
}
