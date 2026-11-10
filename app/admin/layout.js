import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Studio desk",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-svh bg-plaster">
      {children}
      <Toaster position="bottom-right" />
    </div>
  );
}
