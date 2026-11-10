import AdminBar from "@/components/admin/admin-bar";
import AdminTabs from "@/components/admin/admin-tabs";
import DbError from "@/components/admin/db-error";
import VideoManager from "@/components/admin/video-manager";
import { connectDB } from "@/lib/mongodb";
import { Video } from "@/lib/models/video";
import { serializeVideo } from "@/lib/videos";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Video journal · Studio desk",
  robots: { index: false, follow: false },
};

export default async function AdminJournalPage() {
  let items = [];
  let dbError = "";

  try {
    await connectDB();
    const docs = await Video.find({}).sort({ order: 1, createdAt: 1 }).lean();
    items = docs.map(serializeVideo);
  } catch (error) {
    dbError = error?.message || "Unknown database error";
  }

  return (
    <>
      <AdminBar />
      <AdminTabs active="/admin/journal" />

      <main className="mx-auto max-w-[84rem] px-5 pb-20 sm:px-8">
        <div className="flex flex-col gap-5 pt-10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">Video journal</p>
            <h1 className="display-lg mt-4 text-ink">Films from the sites.</h1>
            <p className="mt-3 max-w-[58ch] text-[0.88rem] leading-relaxed text-quiet">
              Upload an MP4 or point at YouTube or Vimeo. Each film gets a poster
              frame, a place, a length and a note, and appears in the public
              player in this order.
            </p>
          </div>
          <p className="shrink-0 text-[0.76rem] text-quiet">
            First film plays by default
          </p>
        </div>

        {dbError ? <DbError message={dbError} /> : <VideoManager items={items} />}
      </main>
    </>
  );
}
