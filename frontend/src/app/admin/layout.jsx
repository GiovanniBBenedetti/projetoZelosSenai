import RotaProtegida from "@/components/RotaProtegida/RotaProtegida";
import SidebarLayout from "@/components/SidebarLayout";

export default function tecnicoLayout({ children }) {
  return (
    <RotaProtegida permitido={["admin"]}>
      <SidebarLayout>
        {children}
      </SidebarLayout>
    </RotaProtegida>
  );
} 