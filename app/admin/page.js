import Link from "next/link";
import AdminBar from "@/components/admin/admin-bar";
import AdminTabs from "@/components/admin/admin-tabs";
import Stats from "@/components/admin/stats";
import Toolbar from "@/components/admin/toolbar";
import LeadsTable from "@/components/admin/leads-table";
import { leadStats, listLeads } from "@/lib/leads";
import { formatIST } from "@/lib/format";

export const dynamic = "force-dynamic";

const allowedStatus = ["new", "contacted", "quoted", "won", "lost"];

export default async function AdminPage({ searchParams }) {
  const params = (await searchParams) || {};
  const q = typeof params.q === "string" ? params.q : "";
  const status =
    typeof params.status === "string" && allowedStatus.includes(params.status)
      ? params.status
      : "all";
  const type = typeof params.type === "string" ? params.type : "all";
  const page = Math.max(1, Number.parseInt(params.page, 10) || 1);

  const exportParams = new URLSearchParams();
  if (q) exportParams.set("q", q);
  if (status !== "all") exportParams.set("status", status);
  if (type !== "all") exportParams.set("type", type);
  const exportHref = `/api/admin/export${
    exportParams.toString() ? `?${exportParams}` : ""
  }`;

  let data = null;
  let stats = null;
  let dbError = "";

  try {
    [data, stats] = await Promise.all([
      listLeads({ q, status, type, page }),
      leadStats(),
    ]);
  } catch (error) {
    dbError = error?.message || "Unknown database error";
  }

  return (
    <>
      <AdminBar />
      <AdminTabs active="/admin" />

      <main className="mx-auto max-w-[84rem] px-5 pb-20 sm:px-8">
        <div className="flex flex-col gap-5 pt-10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">Enquiry book</p>
            <h1 className="display-lg mt-4 text-ink">Who wrote in.</h1>
            <p className="mt-3 max-w-[54ch] text-[0.88rem] leading-relaxed text-quiet">
              Every message sent through the contact form, newest first. Open one
              to read it properly, note what you did, and move it along. The
              Excel file follows whatever filters you have on.
            </p>
          </div>
          <p className="shrink-0 text-[0.76rem] text-quiet">
            Desk time {formatIST(new Date())}
          </p>
        </div>

        {dbError ? (
          <div className="border border-laterite/40 bg-laterite/5 px-5 py-6">
            <p className="font-display text-xl text-laterite">
              The enquiry book could not be reached.
            </p>
            <p className="mt-2 max-w-[60ch] text-[0.84rem] leading-relaxed text-ink-soft">
              MongoDB did not answer. Check <code>MONGODB_URI</code> in{" "}
              <code>.env.local</code> and that this machine can reach the
              cluster, then reload.
            </p>
            <p className="mt-3 font-mono text-[0.72rem] text-quiet">{dbError}</p>
          </div>
        ) : (
          <>
            <Stats stats={stats} />
            <div className="mt-10">
              <Toolbar
                q={q}
                status={status}
                type={type}
                total={data.total}
                exportHref={exportHref}
              />
            </div>
            <LeadsTable items={data.items} />

            {data.pages > 1 ? (
              <nav
                className="mt-8 flex items-center justify-between gap-4 text-[0.8rem]"
                aria-label="Pagination"
              >
                <PageLink
                  disabled={data.page <= 1}
                  href={buildHref({ q, status, type, page: data.page - 1 })}
                >
                  Previous
                </PageLink>
                <span className="num text-[0.76rem] text-quiet">
                  Page {data.page} of {data.pages}
                </span>
                <PageLink
                  disabled={data.page >= data.pages}
                  href={buildHref({ q, status, type, page: data.page + 1 })}
                >
                  Next
                </PageLink>
              </nav>
            ) : null}
          </>
        )}
      </main>
    </>
  );
}

function buildHref({ q, status, type, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status !== "all") params.set("status", status);
  if (type !== "all") params.set("type", type);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}

function PageLink({ href, disabled, children }) {
  if (disabled) {
    return (
      <span className="border border-line px-4 py-2 text-quiet/50">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="border border-line-strong px-4 py-2 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-plaster"
    >
      {children}
    </Link>
  );
}
