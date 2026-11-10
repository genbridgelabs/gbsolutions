import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/admin/login-form";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative flex flex-col justify-between overflow-hidden bg-indigo px-5 py-10 text-plaster sm:px-10 sm:py-12 lg:px-16 lg:py-14">
        <div className="grain grain-light" aria-hidden="true" />

        <Link href="/" className="relative flex items-center gap-3">
          <Image
            src="/brand/mark-paper.png"
            alt=""
            width={72}
            height={36}
            className="h-8 w-auto"
          />
          <span className="font-display text-[1.15rem]">GB Solutions</span>
        </Link>

        <div className="relative mt-16 max-w-lg lg:mt-0">
          <p className="label !text-brass-light">Studio access</p>
          <h1 className="display-lg mt-6 max-w-[15ch] text-plaster">
            The enquiries desk, behind the door.
          </h1>
          <p className="mt-6 max-w-[38ch] text-[0.9rem] leading-[1.75] text-plaster/55">
            Every enquiry from the website lands here: name, number, budget and
            the paragraph they wrote. Read it, mark it, take it to Excel, or call
            them back.
          </p>
        </div>

        <div className="relative mt-16 flex flex-col gap-2 border-t border-line-light pt-6 text-[0.72rem] text-plaster/40 lg:mt-0">
          <p>Admin only. Sessions end after eight hours.</p>
          <p>Bhubaneswar, Odisha</p>
        </div>
      </section>

      <section className="flex items-center px-5 py-14 sm:px-10 lg:px-16">
        <div className="w-full max-w-sm">
          <p className="label">Sign in</p>
          <h2 className="mt-5 font-display text-[2rem] leading-tight text-ink">
            Admin login
          </h2>
          <p className="mt-2 text-[0.86rem] text-quiet">
            Use the studio account to see the enquiry book.
          </p>

          <LoginForm />

          <Link
            href="/"
            className="mt-10 inline-block text-[0.8rem] text-quiet underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          >
            Back to the site
          </Link>
        </div>
      </section>
    </main>
  );
}
