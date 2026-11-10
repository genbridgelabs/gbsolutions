"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminBar() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Signed out");
      router.replace("/admin/login");
    } catch {
      toast.error("Could not sign out. Reload and try again.");
      setBusy(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-plaster/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/brand/mark-ink.png"
            alt=""
            width={64}
            height={32}
            className="h-6 w-auto"
          />
          <span className="flex items-baseline gap-3">
            <span className="font-display text-[1.05rem] text-ink">
              GB Solutions
            </span>
            <span className="hidden text-[0.72rem] text-quiet sm:inline">
              Studio desk
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="hidden text-[0.78rem] text-quiet transition-colors hover:text-ink sm:inline"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={busy}
            className="border border-line-strong px-3.5 py-2 text-[0.76rem] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-plaster disabled:opacity-60"
          >
            {busy ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </header>
  );
}
