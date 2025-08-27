import SidebarLayout from "@/components/SidebarLayout";

export default function adminLayout({ children }) {
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
