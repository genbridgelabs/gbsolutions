"use client";

import { useState } from "react";
import { budgets, cities, projectTypes } from "@/lib/content";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  projectType: projectTypes[0],
  city: cities[0],
  budget: budgets[4],
  message: "",
  website: "",
};

const fieldClass =
  "h-11 w-full border-b border-line-strong bg-transparent text-[0.95rem] text-ink outline-none transition-colors placeholder:text-quiet/55 focus:border-brass";

function Field({ label, htmlFor, error, children, optional = false }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-baseline justify-between text-[0.76rem] text-ink-soft"
      >
        <span>{label}</span>
        {optional ? <span className="text-quiet/80">optional</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[0.72rem] text-laterite">{error}</p>
      ) : null}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const [receipt, setReceipt] = useState(null);

  const update = (key) => (event) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setFormError("");
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data?.issues) setErrors(data.issues);
        setFormError(
          data?.error ?? "That did not send. Try again, or call the studio."
        );
        setStatus("error");
        return;
      }

      setReceipt({
        reference: data.reference,
        name: values.name.trim().split(" ")[0],
      });
      setValues(emptyForm);
      setStatus("done");
    } catch {
      setFormError("The connection dropped. Try again, or call the studio.");
      setStatus("error");
    }
  }

  if (status === "done" && receipt) {
    return (
      <div className="anim-rise flex h-full min-h-[26rem] flex-col justify-center">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brass/50 text-brass">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-5"
            aria-hidden="true"
          >
            <path
              d="M4.5 12.5l5 5 10-11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3 className="mt-6 font-display text-[1.85rem] leading-tight text-ink">
          Thank you{receipt.name ? `, ${receipt.name}` : ""}. It reached the
          studio.
        </h3>
        <p className="mt-3 max-w-[42ch] text-[0.92rem] leading-relaxed text-ink-soft">
          A principal will call you within one working day. If it is urgent, ring
          the studio directly — we would rather talk than email.
        </p>
        <p className="mt-6 border-t border-line pt-4 text-[0.76rem] text-quiet">
          Your reference: <span className="num text-ink">{receipt.reference}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setReceipt(null);
          }}
          className="link-rule mt-8 w-fit text-[0.82rem] text-ink"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      action="/api/contact"
      noValidate
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={update("name")}
            autoComplete="name"
            required
            placeholder="Your Full Name"
            className={fieldClass}
          />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={update("phone")}
            autoComplete="tel"
            required
            placeholder="+91 98765 XXXXX"
            className={fieldClass}
          />
        </Field>
      </div>

      <Field label="Email" htmlFor="email" error={errors.email} optional>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={update("email")}
          autoComplete="email"
          placeholder="you@example.com"
          className={fieldClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="What are we building?"
          htmlFor="projectType"
          error={errors.projectType}
        >
          <div className="relative">
            <select
              id="projectType"
              name="projectType"
              value={values.projectType}
              onChange={update("projectType")}
              className={`${fieldClass} appearance-none pr-7`}
            >
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </Field>

        <Field label="Where is it?" htmlFor="city" error={errors.city}>
          <div className="relative">
            <select
              id="city"
              name="city"
              value={values.city}
              onChange={update("city")}
              className={`${fieldClass} appearance-none pr-7`}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </Field>
      </div>

      <Field label="Rough budget" htmlFor="budget" error={errors.budget} optional>
        <div className="relative">
          <select
            id="budget"
            name="budget"
            value={values.budget}
            onChange={update("budget")}
            className={`${fieldClass} appearance-none pr-7`}
          >
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
      </Field>

      <Field
        label="The room, in your words"
        htmlFor="message"
        error={errors.message}
      >
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={update("message")}
          rows={4}
          required
          placeholder="4BHK in Patia, ground floor is dark most of the day. We move in next winter."
          className="w-full resize-none border-b border-line-strong bg-transparent py-2 text-[0.95rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-quiet/55 focus:border-brass"
        />
      </Field>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={update("website")}
        />
      </div>

      {formError ? (
        <p className="border-l-2 border-laterite bg-laterite/5 px-4 py-3 text-[0.8rem] text-laterite">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group flex w-full items-center justify-between bg-indigo px-6 py-4 text-[0.84rem] font-medium text-plaster transition-colors duration-300 hover:bg-ink disabled:cursor-wait disabled:opacity-70"
      >
        <span>{status === "sending" ? "Sending…" : "Send enquiry"}</span>
        <span className="h-px w-8 bg-plaster/40 transition-all duration-300 group-hover:w-12 group-hover:bg-brass-light" />
      </button>

      <p className="text-[0.7rem] leading-relaxed text-quiet">
        We keep your details to answer this enquiry and nothing else. No lists.
      </p>
    </form>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-1/2 size-3 -translate-y-1/2 text-quiet"
    >
      <path
        d="M1 1.5 6 6.5l5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
