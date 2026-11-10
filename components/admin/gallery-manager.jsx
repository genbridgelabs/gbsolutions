"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import MediaInput from "@/components/admin/media-input";

const CATEGORIES = ["Homes", "Workspaces", "Hospitality", "Details"];

function emptyDraft() {
  return {
    title: "",
    category: "Homes",
    typeLabel: "",
    place: "Bhubaneswar",
    year: String(new Date().getFullYear()),
    summary: "",
    description: "",
    cover: "",
    coverAlt: "",
    images: [],
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

export default function GalleryManager({ items }) {
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
      category: item.category,
      typeLabel: item.typeLabel,
      place: item.place,
      year: item.year || String(new Date().getFullYear()),
      summary: item.summary,
      description: item.description,
      cover: item.cover,
      coverAlt: item.coverAlt,
      images: item.images.map((image) => ({ ...image })),
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

  function updateImage(index, patch) {
    setDraft((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, ...patch } : image
      ),
    }));
  }

  async function save() {
    setBusy(true);
    setIssues({});
    try {
      const payload = {
        ...draft,
        images: draft.images.filter((image) => image.url.trim()),
      };
      const response = await fetch(
        editingId ? `/api/admin/gallery/${editingId}` : "/api/admin/gallery",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data?.issues) setIssues(data.issues);
        throw new Error(data?.error || "That project could not be saved.");
      }
      toast.success(editingId ? "Project updated" : "Project added");
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
      const response = await fetch(`/api/admin/gallery/${editingId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "That project could not be deleted.");
      }
      toast.success("Project deleted");
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
      const response = await fetch(`/api/admin/gallery/${item.id}`, {
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
      const response = await fetch("/api/admin/gallery", {
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
          {items.length} {items.length === 1 ? "project" : "projects"} ·{" "}
          {items.filter((item) => item.published).length} live
        </p>
        <Button
          onClick={startNew}
          className="h-10 rounded-none bg-indigo px-4 text-[0.8rem] text-plaster hover:bg-ink"
        >
          <Plus className="size-4" strokeWidth={1.7} />
          Add project
        </Button>
      </div>

      <ul>
        {items.map((item, index) => (
          <li
            key={item.id}
            className="group flex flex-wrap items-center gap-4 border-b border-line py-4 sm:flex-nowrap"
          >
            <span className="relative h-14 w-20 shrink-0 overflow-hidden bg-plaster-deep">
              <Image
                src={item.cover}
                alt=""
                fill
                sizes="80px"
                className="photo object-cover"
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] text-ink">{item.title}</p>
              <p className="mt-0.5 truncate text-[0.72rem] text-quiet">
                {item.category} · {item.place}, {item.year} ·{" "}
                {item.images.length} photographs
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
              <Link
                href={`/work/${item.slug}`}
                target="_blank"
                aria-label={`Open ${item.title} on the site`}
                className="ml-1 flex size-8 items-center justify-center border border-line text-quiet transition-colors hover:border-ink hover:text-ink"
              >
                <ExternalLink className="size-3.5" strokeWidth={1.6} />
              </Link>
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
            No projects on the wall yet.
          </p>
          <p className="mx-auto mt-2 max-w-[42ch] text-[0.84rem] text-quiet">
            Add the first one and it appears on the site as soon as you save it.
          </p>
        </div>
      ) : null}

      <Dialog open={Boolean(draft)} onOpenChange={(next) => !next && close()}>
        <DialogContent className="max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden rounded-md border border-line bg-paper p-0 sm:max-w-3xl">
          {draft ? (
            <>
              <div className="border-b border-line px-5 py-5 sm:px-6">
                <p className="text-[0.7rem] text-quiet">
                  {editingId ? "Editing a project" : "New project"}
                </p>
                <DialogTitle className="mt-2 font-display text-[1.7rem] leading-tight text-ink">
                  {draft.title || "Untitled project"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[0.76rem] text-quiet">
                  The cover is the card on the site; every photograph here is a
                  frame in the gallery it opens.
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
                      placeholder="The Monolith House"
                    />
                  </Field>
                  <Field label="Category" error={issues.category}>
                    <select
                      aria-label="Category"
                      value={draft.category}
                      onChange={(event) => set({ category: event.target.value })}
                      className="admin-field"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Short label on the card" error={issues.typeLabel}>
                    <input
                      aria-label="Short label on the card"
                      value={draft.typeLabel}
                      onChange={(event) => set({ typeLabel: event.target.value })}
                      className="admin-field"
                      placeholder="Home, Apartment, Workspace…"
                    />
                  </Field>
                  <Field label="Place" error={issues.place}>
                    <input
                      aria-label="Place"
                      value={draft.place}
                      onChange={(event) => set({ place: event.target.value })}
                      className="admin-field"
                      placeholder="Bhubaneswar"
                    />
                  </Field>
                  <Field label="Year" error={issues.year}>
                    <input
                      aria-label="Year"
                      value={draft.year}
                      onChange={(event) => set({ year: event.target.value })}
                      className="admin-field"
                      placeholder="2026"
                      inputMode="numeric"
                    />
                  </Field>
                  <Field label="One-line summary" error={issues.summary}>
                    <input
                      aria-label="One-line summary"
                      value={draft.summary}
                      onChange={(event) => set({ summary: event.target.value })}
                      className="admin-field"
                      placeholder="Laterite, lime plaster and a courtyard."
                    />
                  </Field>
                </div>

                <Field
                  label="The story, shown on the project page"
                  error={issues.description}
                >
                  <textarea
                    aria-label="The story"
                    value={draft.description}
                    onChange={(event) => set({ description: event.target.value })}
                    rows={5}
                    className="w-full resize-none border border-line-strong bg-paper px-3 py-2.5 text-[0.86rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-quiet/60 focus:border-brass"
                    placeholder="What the project was, what was hard, what you changed. Blank lines start a new paragraph."
                  />
                </Field>

                <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                  <div className="space-y-3">
                    <MediaInput
                      label="Cover photograph"
                      value={draft.cover}
                      onChange={(url) => set({ cover: url })}
                      hint="Shown as the card. JPG, PNG, WebP or AVIF up to 12 MB."
                    />
                    {issues.cover ? (
                      <p className="text-[0.72rem] text-laterite">{issues.cover}</p>
                    ) : null}
                  </div>
                  <Field label="Cover alt text" error={issues.coverAlt}>
                    <input
                      aria-label="Cover alt text"
                      value={draft.coverAlt}
                      onChange={(event) => set({ coverAlt: event.target.value })}
                      className="admin-field"
                      placeholder="Living room with a low sofa and a tall window"
                    />
                  </Field>
                </div>

                <div className="border-t border-line pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[0.72rem] text-quiet">
                      Gallery photographs · {draft.images.length}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        set({
                          images: [
                            ...draft.images,
                            { url: "", alt: "", caption: "" },
                          ],
                        })
                      }
                      className="h-8 rounded-none border-line-strong text-[0.74rem]"
                    >
                      <Plus className="size-3.5" strokeWidth={1.7} />
                      Add photograph
                    </Button>
                  </div>

                  <div className="mt-3 space-y-3">
                    {draft.images.map((image, index) => (
                      <div
                        key={index}
                        className="border border-line bg-plaster/40 px-3 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="num text-[0.68rem] text-quiet">
                            Photograph {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              disabled={!image.url}
                              onClick={() =>
                                set({ cover: image.url, coverAlt: image.alt })
                              }
                              className="text-[0.7rem] text-brass transition-colors hover:text-ink disabled:opacity-40"
                            >
                              Use as cover
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                set({
                                  images: draft.images.filter(
                                    (_item, imageIndex) => imageIndex !== index
                                  ),
                                })
                              }
                              aria-label={`Remove photograph ${index + 1}`}
                              className="text-quiet transition-colors hover:text-laterite"
                            >
                              <Trash2 className="size-3.5" strokeWidth={1.6} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 space-y-2">
                          <MediaInput
                            label="File or URL"
                            value={image.url}
                            onChange={(url) => updateImage(index, { url })}
                          />
                          <input
                            aria-label="Alt text"
                            value={image.alt}
                            onChange={(event) =>
                              updateImage(index, { alt: event.target.value })
                            }
                            className="admin-field"
                            placeholder="Alt text — describe what is in the frame"
                          />
                          <input
                            aria-label="Caption"
                            value={image.caption}
                            onChange={(event) =>
                              updateImage(index, { caption: event.target.value })
                            }
                            className="admin-field"
                            placeholder="Caption shown under the photograph"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-plaster-deep/40 px-5 py-4 sm:px-6">
                {editingId ? (
                  confirmDelete ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[0.76rem] text-laterite">
                        Delete this project for good?
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
                    {busy ? "Saving…" : editingId ? "Save changes" : "Add project"}
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
