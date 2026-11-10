import AdminBar from "@/components/admin/admin-bar";
import AdminTabs from "@/components/admin/admin-tabs";
import DbError from "@/components/admin/db-error";
import GalleryManager from "@/components/admin/gallery-manager";
import { connectDB } from "@/lib/mongodb";
import { GalleryItem } from "@/lib/models/gallery-item";
import { serializeGalleryItem } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery · Studio desk",
  robots: { index: false, follow: false },
};

export default async function AdminGalleryPage() {
  let items = [];
  let dbError = "";

  try {
    await connectDB();
    const docs = await GalleryItem.find({})
      .sort({ order: 1, createdAt: 1 })
      .lean();
    items = docs.map(serializeGalleryItem);
  } catch (error) {
    dbError = error?.message || "Unknown database error";
  }

  return (
    <>
      <AdminBar />
      <AdminTabs active="/admin/gallery" />

      <main className="mx-auto max-w-[84rem] px-5 pb-20 sm:px-8">
        <div className="flex flex-col gap-5 pt-10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">Gallery</p>
            <h1 className="display-lg mt-4 text-ink">What the site shows.</h1>
            <p className="mt-3 max-w-[58ch] text-[0.88rem] leading-relaxed text-quiet">
              Projects, rooms and detail shots. The order here is the order on
              the public page; hiding one keeps it here but takes it off the
              site.
            </p>
          </div>
          <p className="shrink-0 text-[0.76rem] text-quiet">
            Opens the lightbox the visitor sees
          </p>
        </div>

        {dbError ? <DbError message={dbError} /> : <GalleryManager items={items} />}
      </main>
    </>
  );
}
