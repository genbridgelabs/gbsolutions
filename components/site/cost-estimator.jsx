"use client";

import { useMemo, useState } from "react";
import { cities } from "@/lib/content";
import {
  MAX_AREA,
  MIN_AREA,
  computeEstimate,
  estimateScopes,
  estimateSizes,
  estimateStyles,
  estimateWork,
} from "@/lib/estimator";
import { formatINR } from "@/lib/format";

const fieldClass =
  "h-11 w-full border-b border-line-strong bg-transparent text-[0.94rem] text-ink outline-none transition-colors placeholder:text-quiet/55 focus:border-brass";

const initial = {
  scope: estimateScopes[0].value,
  size: estimateSizes[1].value,
  style: estimateStyles[0].value,
  work: estimateWork[0].value,
  city: cities[0],
  area: String(estimateSizes[1].area),
  name: "",
  phone: "",
  email: "",
  notes: "",
  website: "",
};

function Control({ id, label, hint, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between gap-3 text-[0.76rem] text-ink-soft"
      >
        <span>{label}</span>
        {hint ? <span className="text-[0.7rem] text-quiet/80">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[0.72rem] text-laterite">{error}</p>
      ) : null}
    </div>
  );
}

function Select({ id, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`${fieldClass} appearance-none pr-7`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Chevron />
    </div>
  );
}

export default function CostEstimator() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const [receipt, setReceipt] = useState(null);

  const update = (key) => (event) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  function changeSize(event) {
    const size = event.target.value;
    const preset = estimateSizes.find((item) => item.value === size);
    setValues((current) => ({
      ...current,
      size,
      area: String(preset?.area ?? current.area),
    }));
  }

  const range = useMemo(
    () =>
      computeEstimate({
        scope: values.scope,
        size: values.size,
        style: values.style,
        work: values.work,
        area: Number(values.area),
      }),
    [values.scope, values.size, values.style, values.work, values.area]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setFormError("");
    setErrors({});

    try {
      const response = await fetch("/api/estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, area: Number(values.area) }),
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
        min: data.range?.min ?? range.min,
        max: data.range?.max ?? range.max,
      });
      setStatus("done");
    } catch {
      setFormError("The connection dropped. Try again, or call the studio.");
      setStatus("error");
    }
  }

  return (
    <div className="border border-line bg-paper">
      <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
        <Control id="est-scope" label="What are we building?">
          <Select
            id="est-scope"
            value={values.scope}
            onChange={update("scope")}
            options={estimateScopes}
          />
        </Control>

        <Control id="est-size" label="How big is it?">
          <Select
            id="est-size"
            value={values.size}
            onChange={changeSize}
            options={estimateSizes}
          />
        </Control>

        <Control id="est-work" label="How far do we go?">
          <Select
            id="est-work"
            value={values.work}
            onChange={update("work")}
            options={estimateWork}
          />
        </Control>

        <Control id="est-style" label="Finish and style">
          <Select
            id="est-style"
            value={values.style}
            onChange={update("style")}
            options={estimateStyles}
          />
        </Control>

        <Control
          id="est-area"
          label="Floor area"
          hint="sq.ft"
          error={errors.area}
        >
          <input
            id="est-area"
            type="number"
            inputMode="numeric"
            min={MIN_AREA}
            max={MAX_AREA}
            step={50}
            value={values.area}
            onChange={update("area")}
            className={`${fieldClass} num`}
          />
        </Control>

        <Control id="est-city" label="Where is the site?">
          <Select
            id="est-city"
            value={values.city}
            onChange={update("city")}
            options={cities.map((city) => ({ value: city, label: city }))}
          />
        </Control>
      </div>

      <div className="bg-indigo px-6 py-8 text-plaster sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="text-[0.66rem] uppercase tracking-[0.24em] text-brass-light">
              Ballpark · {range.area.toLocaleString("en-IN")} sq.ft
            </p>
            <p
              aria-live="polite"
              className="num mt-3 font-display text-[clamp(1.55rem,3.2vw,2.15rem)] leading-none text-plaster"
            >
              {formatINR(range.min)} – {formatINR(range.max)}
            </p>
          </div>
          <p className="num text-[0.74rem] text-plaster/60">
            {formatINR(range.perSqftMin)}–{formatINR(range.perSqftMax)} / sq.ft
          </p>
        </div>
        <p className="mt-4 max-w-[54ch] text-[0.74rem] leading-relaxed text-plaster/50">
          From published 2026 Odisha rates for interiors. Structure, loose
          furniture, appliances and GST sit outside the range. We confirm the
          real figure after a site visit.
        </p>
      </div>

      {status === "done" && receipt ? (
        <div className="anim-rise p-6 sm:p-8">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brass/50 text-brass">
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
              <path
                d="M4.5 12.5l5 5 10-11"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="mt-5 font-display text-[1.7rem] leading-tight text-ink">
            Sent{receipt.name ? `, ${receipt.name}` : ""}. The studio has the
            same range you saw.
          </h3>
          <p className="mt-3 max-w-[48ch] text-[0.9rem] leading-relaxed text-ink-soft">
            {formatINR(receipt.min)} – {formatINR(receipt.max)} is on their desk
            with your notes. A principal replies within one working day, usually
            with questions before numbers.
          </p>
          <p className="mt-5 border-t border-line pt-4 text-[0.76rem] text-quiet">
            Your reference:{" "}
            <span className="num text-ink">{receipt.reference}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setReceipt(null);
              setValues(initial);
            }}
            className="link-rule mt-7 w-fit text-[0.82rem] text-ink"
          >
            Start another estimate
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="border-t border-line p-6 sm:p-8"
        >
          <p className="label">Step two</p>
          <h3 className="mt-3 font-display text-[1.45rem] leading-tight text-ink">
            Send this estimate to the studio.
          </h3>
          <p className="mt-2 mb-7 max-w-[48ch] text-[0.82rem] leading-relaxed text-quiet">
            Same desk as the enquiry form. Your choices, the range and your notes
            arrive together.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <Control id="est-name" label="Your name" error={errors.name}>
              <input
                id="est-name"
                name="name"
                value={values.name}
                onChange={update("name")}
                autoComplete="name"
                required
                placeholder="Priyabrata Mohanty"
                className={fieldClass}
              />
            </Control>

            <Control id="est-phone" label="Phone" error={errors.phone}>
              <input
                id="est-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={update("phone")}
                autoComplete="tel"
                required
                placeholder="+91 98765 43210"
                className={fieldClass}
              />
            </Control>
          </div>

          <div className="mt-5">
            <Control
              id="est-email"
              label="Email"
              hint="optional"
              error={errors.email}
            >
              <input
                id="est-email"
                name="email"
                type="email"
                value={values.email}
                onChange={update("email")}
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldClass}
              />
            </Control>
          </div>

          <div className="mt-5">
            <Control
              id="est-notes"
              label="Your site and timeline"
              hint="optional"
              error={errors.notes}
            >
              <textarea
                id="est-notes"
                name="notes"
                value={values.notes}
                onChange={update("notes")}
                rows={3}
                placeholder="Fourth floor in Patia, possession in March. The kitchen wall can come down."
                className="w-full resize-none border-b border-line-strong bg-transparent py-2 text-[0.94rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-quiet/55 focus:border-brass"
              />
            </Control>
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="est-website">Website</label>
            <input
              id="est-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={update("website")}
            />
          </div>

          {formError ? (
            <p className="mt-5 border-l-2 border-laterite bg-laterite/5 px-4 py-3 text-[0.8rem] text-laterite">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "sending"}
            className="group mt-6 flex w-full items-center justify-between bg-indigo px-6 py-4 text-[0.84rem] font-medium text-plaster transition-colors duration-300 hover:bg-ink disabled:cursor-wait disabled:opacity-70"
          >
            <span>{status === "sending" ? "Sending…" : "Send estimate request"}</span>
            <span className="h-px w-8 bg-plaster/40 transition-all duration-300 group-hover:w-12 group-hover:bg-brass-light" />
          </button>

          <p className="mt-4 text-[0.7rem] leading-relaxed text-quiet">
            We use these details to answer this enquiry and nothing else. The
            estimator is a ballpark, not a quotation.
          </p>
        </form>
      )}
    </div>
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
