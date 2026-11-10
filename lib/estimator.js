// The estimator's rate card, shared by the browser and the API route so the
// number a visitor sees is the number the studio receives.
export const scopeValues = ["apartment", "villa", "commercial", "hospitality"];
export const sizeValues = ["2", "3", "4", "commercial"];
export const styleValues = ["minimalist", "tropical", "heritage", "industrial"];
export const workValues = ["turnkey", "design", "renovation"];

export const estimateScopes = [
  { value: "apartment", label: "Apartment or duplex", rate: 1 },
  { value: "villa", label: "Independent villa", rate: 1.12 },
  { value: "commercial", label: "Workspace or office", rate: 0.92 },
  { value: "hospitality", label: "Café, restaurant or boutique stay", rate: 1.18 },
];

export const estimateSizes = [
  { value: "2", label: "2 BHK", area: 1000 },
  { value: "3", label: "3 BHK", area: 1500 },
  { value: "4", label: "4 BHK or large duplex", area: 2500 },
  { value: "commercial", label: "Commercial floor", area: 3000 },
];

export const estimateStyles = [
  { value: "minimalist", label: "Minimalist, warm neutrals", rate: 1.02 },
  { value: "tropical", label: "Tropical modern, courtyard and wood", rate: 1.08 },
  { value: "heritage", label: "Traditional Odia, lime and brass", rate: 1.14 },
  { value: "industrial", label: "Industrial, concrete and steel", rate: 0.96 },
];

// Per square foot, in rupees. Interiors only for these figures: structure,
// loose furniture and GST sit outside them.
export const estimateWork = [
  {
    value: "turnkey",
    label: "Full turnkey, design and build",
    min: 1650,
    max: 2400,
  },
  {
    value: "design",
    label: "Design and drawings only",
    min: 160,
    max: 320,
  },
  {
    value: "renovation",
    label: "Renovation and structural work",
    min: 1150,
    max: 1750,
  },
];

export const MIN_AREA = 300;
export const MAX_AREA = 20000;

const byValue = (list) => Object.fromEntries(list.map((item) => [item.value, item]));

const scopeMap = byValue(estimateScopes);
const sizeMap = byValue(estimateSizes);
const styleMap = byValue(estimateStyles);
const workMap = byValue(estimateWork);

function roundTo(value, step) {
  return Math.round(value / step) * step;
}

export function computeEstimate({ scope, size, style, work, area }) {
  const scopeOption = scopeMap[scope] ?? estimateScopes[0];
  const sizeOption = sizeMap[size] ?? estimateSizes[1];
  const styleOption = styleMap[style] ?? estimateStyles[0];
  const workOption = workMap[work] ?? estimateWork[0];

  const requested = Number(area) || sizeOption.area;
  const safeArea = Math.min(MAX_AREA, Math.max(MIN_AREA, Math.round(requested)));

  const factor = scopeOption.rate * styleOption.rate;
  const min = roundTo(safeArea * workOption.min * factor, 5000);
  const max = Math.max(
    roundTo(safeArea * workOption.max * factor, 5000),
    min + 5000
  );

  return {
    min,
    max,
    area: safeArea,
    perSqftMin: Math.round(min / safeArea),
    perSqftMax: Math.round(max / safeArea),
    scope: scopeOption.value,
    size: sizeOption.value,
    style: styleOption.value,
    work: workOption.value,
    summary: [
      sizeOption.label,
      `${safeArea.toLocaleString("en-IN")} sq.ft`,
      scopeOption.label,
      workOption.label,
      styleOption.label,
    ].join(" · "),
  };
}

// The lead book's budget filter uses these bands, so the estimator files a
// visitor into the same buckets the desk already works with.
export function budgetBucket(max) {
  if (max < 1000000) return "Under 10 lakh";
  if (max < 2500000) return "10 to 25 lakh";
  if (max < 5000000) return "25 to 50 lakh";
  return "50 lakh and above";
}

export function projectTypeFor(scope, work) {
  if (scope === "villa") return "Villa or independent house";
  if (scope === "commercial") return "Workspace";
  if (scope === "hospitality") return "Hospitality";
  return work === "design" ? "Interiors only" : "Full home turnkey";
}
