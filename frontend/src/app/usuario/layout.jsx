import SidebarLayout from "@/components/SidebarLayout";

export default function usuarioLayout({ children }) {
  return (
     <html lang="pt-BR">
      <body>
        <SidebarLayout>
          {children}
        </SidebarLayout>
      </body>
    </html>
  );
}
