"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import MediaInput from "@/components/admin/media-input";
import { guessSource } from "@/lib/media";

const SOURCES = [
  ["file", "Uploaded file / MP4"],
  ["youtube", "YouTube"],
  ["vimeo", "Vimeo"],
];

function emptyDraft() {
  return {
    title: "",
    place: "",
    recordedOn: "",
    duration: "",
    note: "",
    description: "",
    poster: "",
    posterAlt: "",
    source: "file",
    src: "",
    published: true,
  };
}

function Field({ label, error, children }) {
  return (
    <div>
      <span className="block text-[0.72rem] text-quiet">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1 text-[0.72rem] text-laterite">{error}</p>
      ) : null}
    </div>
  );
}

export default function VideoManager({ items }) {
  const router = useRouter();
  const [draft, setDraft] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [issues, setIssues] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [orderBusy, setOrderBusy] = useState(false);

  function startNew() {
    setDraft(emptyDraft());
    setEditingId(null);
    setIssues({});
    setConfirmDelete(false);
  }

  function startEdit(item) {
    setDraft({
      title: item.title,
      place: item.place,
      recordedOn: item.recordedOn,
      duration: item.duration,
      note: item.note,
      description: item.description,
      poster: item.poster,
      posterAlt: item.posterAlt,
      source: item.source,
      src: item.src,
      published: item.published,
    });
    setEditingId(item.id);
    setIssues({});
    setConfirmDelete(false);
  }

  function close() {
    setDraft(null);
    setEditingId(null);
    setIssues({});
    setConfirmDelete(false);
  }

  const set = (patch) => setDraft((current) => ({ ...current, ...patch }));

  async function save() {
    setBusy(true);
    setIssues({});
    try {
      const response = await fetch(
        editingId ? `/api/admin/videos/${editingId}` : "/api/admin/videos",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data?.issues) setIssues(data.issues);
        throw new Error(data?.error || "That film could not be saved.");
      }
      toast.success(editingId ? "Film updated" : "Film added");
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
      const response = await fetch(`/api/admin/videos/${editingId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "That film could not be deleted.");
      }
      toast.success("Film deleted");
      close();
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(item) {
    try {
      const response = await fetch(`/api/admin/videos/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.published }),
      });
      if (!response.ok) throw new Error("Could not change that.");
      toast.success(item.published ? "Hidden from the site" : "Live on the site");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function move(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setOrderBusy(true);
    try {
      const response = await fetch("/api/admin/videos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((item) => item.id) }),
      });
      if (!response.ok) throw new Error("The new order could not be saved.");
      toast.success("Order saved");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setOrderBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <p className="text-[0.78rem] text-quiet">
          {items.length} {items.length === 1 ? "film" : "films"} ·{" "}
          {items.filter((item) => item.published).length} live
        </p>
        <Button
          onClick={startNew}
          className="h-10 rounded-none bg-indigo px-4 text-[0.8rem] text-plaster hover:bg-ink"
        >
          <Plus className="size-4" strokeWidth={1.7} />
          Add film
        </Button>
      </div>

      <ul>
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center gap-4 border-b border-line py-4 sm:flex-nowrap"
          >
            <span className="relative aspect-video w-24 shrink-0 overflow-hidden bg-plaster-deep">
              <Image
                src={item.poster}
                alt=""
                fill
                sizes="96px"
                className="photo object-cover"
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] text-ink">{item.title}</p>
              <p className="mt-0.5 truncate text-[0.72rem] text-quiet">
                {item.place || "No place"} · {item.duration || "no length"} ·{" "}
                {item.source === "file" ? "hosted here" : item.source}
              </p>
            </div>

            <button
              type="button"
              onClick={() => togglePublished(item)}
              className={`shrink-0 border px-2.5 py-1 text-[0.68rem] transition-colors ${
                item.published
                  ? "border-[#3f6b4a]/35 bg-[#3f6b4a]/10 text-[#3a6244] hover:bg-[#3f6b4a]/20"
                  : "border-line-strong bg-plaster-deep/50 text-quiet hover:text-ink"
              }`}
            >
              {item.published ? "Live" : "Hidden"}
            </button>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0 || orderBusy}
                aria-label={`Move ${item.title} up`}
                className="flex size-8 items-center justify-center border border-line text-quiet transition-colors hover:border-ink hover:text-ink disabled:opacity-30"
              >
                <ArrowUp className="size-3.5" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1 || orderBusy}
                aria-label={`Move ${item.title} down`}
                className="flex size-8 items-center justify-center border border-line text-quiet transition-colors hover:border-ink hover:text-ink disabled:opacity-30"
              >
                <ArrowDown className="size-3.5" strokeWidth={1.6} />
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEdit(item)}
                className="ml-1 h-8 rounded-none px-2.5 text-[0.76rem] text-ink hover:bg-ink hover:text-plaster"
              >
                <Pencil className="size-3.5" strokeWidth={1.6} />
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <div className="border-b border-line py-16 text-center">
          <p className="font-display text-2xl text-ink">
            The journal is empty.
          </p>
          <p className="mx-auto mt-2 max-w-[42ch] text-[0.84rem] text-quiet">
            Upload an MP4 or paste a YouTube / Vimeo link and it appears in the
            public player.
          </p>
        </div>
      ) : null}

      <Dialog open={Boolean(draft)} onOpenChange={(next) => !next && close()}>
        <DialogContent className="max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden rounded-md border border-line bg-paper p-0 sm:max-w-3xl">
          {draft ? (
            <>
              <div className="border-b border-line px-5 py-5 sm:px-6">
                <p className="text-[0.7rem] text-quiet">
                  {editingId ? "Editing a film" : "New film"}
                </p>
                <DialogTitle className="mt-2 font-display text-[1.7rem] leading-tight text-ink">
                  {draft.title || "Untitled film"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[0.76rem] text-quiet">
                  The poster is what people see before they press play.
                </DialogDescription>
              </div>

              <div className="max-h-[62svh] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Title" error={issues.title}>
                    <input
                      aria-label="Title"
                      value={draft.title}
                      onChange={(event) => set({ title: event.target.value })}
                      className="admin-field"
                      placeholder="A window cut for north light"
                    />
                  </Field>
                  <Field label="Place" error={issues.place}>
                    <input
                      aria-label="Place"
                      value={draft.place}
                      onChange={(event) => set({ place: event.target.value })}
                      className="admin-field"
                      placeholder="Patia, Bhubaneswar"
                    />
                  </Field>
                  <Field label="Filmed" error={issues.recordedOn}>
                    <input
                      aria-label="Filmed"
                      value={draft.recordedOn}
                      onChange={(event) => set({ recordedOn: event.target.value })}
                      className="admin-field"
                      placeholder="March 2026"
                    />
                  </Field>
                  <Field label="Length" error={issues.duration}>
                    <input
                      aria-label="Length"
                      value={draft.duration}
                      onChange={(event) => set({ duration: event.target.value })}
                      className="admin-field"
                      placeholder="0:07"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                  <Field label="Where the video lives" error={issues.source}>
                    <select
                      aria-label="Video source"
                      value={draft.source}
                      onChange={(event) => set({ source: event.target.value })}
                      className="admin-field"
                    >
                      {SOURCES.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {draft.source === "file" ? (
                    <div>
                      <MediaInput
                        label="Video file"
                        kind="video"
                        value={draft.src}
                        onChange={(url) => set({ src: url })}
                        hint="MP4 or WebM, up to 80 MB. Larger films belong on YouTube or Vimeo."
                      />
                      {issues.src ? (
                        <p className="mt-1 text-[0.72rem] text-laterite">
                          {issues.src}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <Field label={`${draft.source} link`} error={issues.src}>
                      <input
                        aria-label="Video link"
                        value={draft.src}
                        onChange={(event) => {
                          const value = event.target.value;
                          const guessed = guessSource(value);
                          set({
                            src: value,
                            source:
                              guessed === "file" ? draft.source : guessed,
                          });
                        }}
                        className="admin-field"
                        placeholder="https://www.youtube.com/watch?v=…"
                      />
                    </Field>
                  )}
                </div>

                <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                  <div className="space-y-3">
                    <MediaInput
                      label="Poster frame"
                      value={draft.poster}
                      onChange={(url) => set({ poster: url })}
                      hint="Shown before playback and in the chapter list."
                    />
                    {issues.poster ? (
                      <p className="text-[0.72rem] text-laterite">
                        {issues.poster}
                      </p>
                    ) : null}
                  </div>
                  <Field label="Poster alt text" error={issues.posterAlt}>
                    <input
                      aria-label="Poster alt text"
                      value={draft.posterAlt}
                      onChange={(event) => set({ posterAlt: event.target.value })}
                      className="admin-field"
                      placeholder="Sunlight raking across a plaster wall"
                    />
                  </Field>
                </div>

                <div className="border-t border-line pt-5">
                  <Field label="One-line note" error={issues.note}>
                    <input
                      aria-label="One-line note"
                      value={draft.note}
                      onChange={(event) => set({ note: event.target.value })}
                      className="admin-field"
                      placeholder="The wall was already up. We took it down again."
                    />
                  </Field>
                </div>

                <Field label="Description" error={issues.description}>
                  <textarea
                    aria-label="Description"
                    value={draft.description}
                    onChange={(event) => set({ description: event.target.value })}
                    rows={3}
                    className="w-full resize-none border border-line-strong bg-paper px-3 py-2.5 text-[0.86rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-quiet/60 focus:border-brass"
                    placeholder="What happens in the film, in two sentences."
                  />
                </Field>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-plaster-deep/40 px-5 py-4 sm:px-6">
                {editingId ? (
                  confirmDelete ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[0.76rem] text-laterite">
                        Delete this film for good?
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
                  )
                ) : (
                  <span className="text-[0.72rem] text-quiet">
                    {draft.published ? "Will publish on save" : "Saved as hidden"}
                  </span>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={close}
                    className="rounded-none border-line-strong px-4 text-[0.76rem]"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={save}
                    className="rounded-none bg-indigo px-4 text-[0.76rem] text-plaster hover:bg-ink"
                  >
                    {busy ? "Saving…" : editingId ? "Save changes" : "Add film"}
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
