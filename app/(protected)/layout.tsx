import { AppLayout } from "@/components/shared/app-layout";
import { WeddingGuard } from "@/components/shared/wedding-guard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <WeddingGuard>{children}</WeddingGuard>
    </AppLayout>
  );
}
