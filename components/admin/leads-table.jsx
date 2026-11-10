"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatINR, formatIST, formatLakh, relativeTime } from "@/lib/format";

const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

const STATUS_CLASSES = {
  new: "border-brass/45 bg-brass/10 text-[#8a6420]",
  contacted: "border-indigo/25 bg-indigo/8 text-indigo",
  quoted: "border-indigo-soft/35 bg-indigo-soft/10 text-indigo-soft",
  won: "border-[#3f6b4a]/35 bg-[#3f6b4a]/10 text-[#3a6244]",
  lost: "border-line-strong bg-plaster-deep/60 text-quiet",
};

function StatusBadge({ status }) {
  return (
    <Badge
      variant="outline"
      className={`h-5 rounded-full px-2.5 text-[0.68rem] font-normal ${
        STATUS_CLASSES[status] || STATUS_CLASSES.new
      }`}
    >
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

export default function LeadsTable({ items }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function openLead(lead) {
    setSelected(lead);
    setNote(lead.adminNote || "");
    setConfirmDelete(false);
  }

  function close() {
    setSelected(null);
    setConfirmDelete(false);
  }

  async function patch(body, message) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/leads/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Could not save that.");
      toast.success(message);
      close();
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/leads/${selected.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Could not delete that.");
      }
      toast.success("Enquiry deleted");
      close();
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="border-b border-line">
        <Table>
          <TableHeader>
            <TableRow className="border-line hover:bg-transparent">
              <TableHead className="h-10 pl-0 text-[0.7rem] font-normal text-quiet">
                Received
              </TableHead>
              <TableHead className="h-10 text-[0.7rem] font-normal text-quiet">
                Who
              </TableHead>
              <TableHead className="h-10 text-[0.7rem] font-normal text-quiet">
                Project
              </TableHead>
              <TableHead className="h-10 text-[0.7rem] font-normal text-quiet">
                Budget
              </TableHead>
              <TableHead className="h-10 text-[0.7rem] font-normal text-quiet">
                Status
              </TableHead>
              <TableHead className="h-10 pr-0 text-right text-[0.7rem] font-normal text-quiet">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((lead) => (
              <TableRow key={lead.id} className="border-line hover:bg-paper/60">
                <TableCell className="whitespace-nowrap py-4 pl-0 text-[0.76rem] text-quiet">
                  <span title={formatIST(lead.createdAt)}>
                    {relativeTime(lead.createdAt)}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <button
                    type="button"
                    onClick={() => openLead(lead)}
                    className="text-left"
                  >
                    <span className="block text-[0.9rem] text-ink transition-colors hover:text-brass">
                      {lead.name}
                    </span>
                    <span className="num block text-[0.74rem] text-quiet">
                      {lead.phone}
                    </span>
                  </button>
                </TableCell>
                <TableCell className="py-4 text-[0.8rem] text-ink-soft">
                  {lead.projectType}
                  <span className="block text-[0.74rem] text-quiet">
                    {lead.city}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap py-4 text-[0.78rem] text-quiet">
                  {lead.budget}
                  {lead.estimate ? (
                    <span
                      className="num mt-0.5 block text-[0.72rem] text-brass"
                      title={`Estimator ballpark: ${formatINR(
                        lead.estimate.min
                      )} – ${formatINR(lead.estimate.max)}`}
                    >
                      est. {formatLakh(lead.estimate.min)}–
                      {formatLakh(lead.estimate.max)}
                    </span>
                  ) : null}
                </TableCell>
                <TableCell className="py-4">
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="py-4 pr-0 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openLead(lead)}
                    className="text-[0.76rem] text-ink hover:bg-ink hover:text-plaster"
                  >
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {items.length === 0 ? (
        <div className="border-b border-line py-16 text-center">
          <p className="font-display text-2xl text-ink">
            Nothing in this part of the book.
          </p>
          <p className="mx-auto mt-2 max-w-[40ch] text-[0.84rem] text-quiet">
            Try a different status, clear the search, or wait for the next
            enquiry to land.
          </p>
        </div>
      ) : null}

      <Dialog open={Boolean(selected)} onOpenChange={(next) => !next && close()}>
        <DialogContent className="max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden rounded-md border border-line bg-paper p-0 sm:max-w-2xl">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
                <div>
                  <p className="text-[0.7rem] text-quiet">
                    Enquiry GB-{selected.id.slice(-5).toUpperCase()}
                  </p>
                  <DialogTitle className="mt-2 font-display text-[1.75rem] leading-tight text-ink">
                    {selected.name}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-[0.78rem] text-quiet">
                    {formatIST(selected.createdAt)} · {selected.source}
                  </DialogDescription>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="max-h-[60svh] overflow-y-auto px-5 py-5 sm:px-6">
                <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[0.7rem] text-quiet">Phone</dt>
                    <dd className="mt-1">
                      <a
                        href={`tel:${selected.phone.replace(/\s/g, "")}`}
                        className="num text-[0.92rem] text-ink underline decoration-line-strong underline-offset-4 hover:decoration-brass"
                      >
                        {selected.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] text-quiet">Email</dt>
                    <dd className="mt-1">
                      {selected.email ? (
                        <a
                          href={`mailto:${selected.email}`}
                          className="text-[0.92rem] text-ink underline decoration-line-strong underline-offset-4 hover:decoration-brass"
                        >
                          {selected.email}
                        </a>
                      ) : (
                        <span className="text-[0.88rem] text-quiet">Not given</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] text-quiet">Project</dt>
                    <dd className="mt-1 text-[0.9rem] text-ink">
                      {selected.projectType}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] text-quiet">Location</dt>
                    <dd className="mt-1 text-[0.9rem] text-ink">
                      {selected.city}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] text-quiet">Budget</dt>
                    <dd className="mt-1 text-[0.9rem] text-ink">
                      {selected.budget}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] text-quiet">Last update</dt>
                    <dd className="mt-1 text-[0.9rem] text-ink">
                      {relativeTime(selected.updatedAt)}
                    </dd>
                  </div>
                </dl>

                {selected.estimate ? (
                  <div className="mt-6 border border-brass/35 bg-brass/5 px-4 py-4">
                    <p className="text-[0.7rem] text-[#8a6420]">
                      From the cost estimator
                    </p>
                    <p className="num mt-2 font-display text-[1.4rem] leading-none text-ink">
                      {formatINR(selected.estimate.min)} –{" "}
                      {formatINR(selected.estimate.max)}
                    </p>
                    <p className="mt-2 text-[0.78rem] leading-relaxed text-ink-soft">
                      {selected.estimate.summary}
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 border-l-2 border-brass/40 bg-plaster/60 px-4 py-4">
                  <p className="text-[0.7rem] text-quiet">In their words</p>
                  <p className="mt-2 whitespace-pre-line text-[0.9rem] leading-[1.7] text-ink">
                    {selected.message}
                  </p>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="admin-note"
                    className="text-[0.7rem] text-quiet"
                  >
                    Studio note
                  </label>
                  <textarea
                    id="admin-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    placeholder="Called on Tuesday. Wants to see the Patia house first."
                    className="mt-2 w-full resize-none border border-line-strong bg-plaster/40 px-3 py-2.5 text-[0.86rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-quiet/60 focus:border-brass"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => patch({ adminNote: note }, "Note saved")}
                      className="rounded-none bg-ink px-4 text-[0.76rem] text-plaster hover:bg-brass hover:text-ink"
                    >
                      Save note
                    </Button>
                  </div>
                </div>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-[0.7rem] text-quiet">Move this enquiry to</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          patch({ status: value }, `Marked as ${label.toLowerCase()}`)
                        }
                        className={`border px-3 py-2 text-[0.76rem] transition-colors disabled:opacity-50 ${
                          selected.status === value
                            ? "border-ink bg-ink text-plaster"
                            : "border-line-strong text-ink hover:border-ink"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-line bg-plaster-deep/40 px-5 py-4 sm:px-6">
                {confirmDelete ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.76rem] text-laterite">
                      Delete this enquiry for good?
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={busy}
                      onClick={remove}
                      className="rounded-none text-[0.76rem]"
                    >
                      Yes, delete
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDelete(false)}
                      className="rounded-none text-[0.76rem]"
                    >
                      Keep it
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-2 text-[0.76rem] text-quiet transition-colors hover:text-laterite"
                  >
                    <Trash2 className="size-3.5" strokeWidth={1.6} />
                    Delete
                  </button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={close}
                  className="rounded-none border-line-strong px-4 text-[0.76rem]"
                >
                  Close
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
