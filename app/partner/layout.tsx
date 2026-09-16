import { KitchenAuthProvider } from "../../lib/KitchenAuthProvider";
import PartnerGuard from "./components/PartnerGuard";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <KitchenAuthProvider>
      <PartnerGuard>{children}</PartnerGuard>
    </KitchenAuthProvider>
  );
}
