import { formatDay } from "@/lib/format";

const cells = [
  { key: "total", label: "Enquiries, all time" },
  { key: "fresh", label: "Waiting on us" },
  { key: "week", label: "Last seven days" },
  { key: "quoted", label: "Quoted or won" },
];

export default function Stats({ stats }) {
  const peak = Math.max(1, ...stats.days.map((day) => day.count));

  return (
    <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
      <dl className="grid grid-cols-2 gap-y-7 border-y border-line py-7 sm:grid-cols-4 sm:gap-6">
        {cells.map((cell) => (
          <div key={cell.key} className="sm:border-l sm:border-line sm:pl-4 sm:first:border-l-0 sm:first:pl-0">
            <dd className="num font-display text-[2rem] leading-none text-ink">
              {String(stats[cell.key] ?? 0).padStart(2, "0")}
            </dd>
            <dt className="mt-2 max-w-[14ch] text-[0.72rem] leading-snug text-quiet">
              {cell.label}
            </dt>
          </div>
        ))}
      </dl>

      <div className="border-y border-line py-7">
        <div className="flex items-baseline justify-between">
          <p className="text-[0.72rem] text-quiet">Enquiries, last 14 days</p>
          <p className="num text-[0.72rem] text-quiet">
            peak {peak} / day
          </p>
        </div>
        <div className="mt-4 flex h-16 items-end gap-[3px]">
          {stats.days.map((day) => (
            <div
              key={day.date}
              className="group relative flex-1"
              title={`${formatDay(day.date)} — ${day.count} enquiry${
                day.count === 1 ? "" : "s"
              }`}
            >
              <div
                className={`w-full transition-colors ${
                  day.count > 0 ? "bg-indigo/80 group-hover:bg-brass" : "bg-line"
                }`}
                style={{
                  height: day.count > 0 ? `${Math.max(12, (day.count / peak) * 100)}%` : "3px",
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[0.66rem] text-quiet">
          <span>{formatDay(stats.days[0]?.date)}</span>
          <span>today</span>
        </div>
      </div>
    </section>
  );
}
