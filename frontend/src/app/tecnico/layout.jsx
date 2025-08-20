import Sideuser from '@/components/Sidebar/Sideruser';
import Footer from '@/components/Footer/Footer';

export default function admLayoutTecnico({ children }) {
  return (
    <>
      <html lang="pt-BR">
        <body>
          <Sideuser />
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
