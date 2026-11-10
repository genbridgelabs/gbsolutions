import { notFound } from "next/navigation";
import Room3D from "@/components/site/room-3d";
import { getGalleryItem } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getGalleryItem(slug);
  if (!project) return { title: "Room not found" };
  return {
    title: `${project.title} — 3D room`,
    description: `Walk through the photographs of ${project.title} in a 3D room.`,
    robots: { index: false, follow: true },
  };
}

export default async function RoomPage({ params }) {
  const { slug } = await params;
  const project = await getGalleryItem(slug);
  if (!project) notFound();

  return <Room3D project={project} />;
}
