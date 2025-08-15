import Sideuser from '@/components/Sidebar/Sideruser';
import Footer from '@/components/Footer/Footer';

export default function admLayout({ children }) {
  return (
    <>
      <html lang="pt-br">
        <body>
          <Sideuser />
          <div className="body-content">{children}</div>
          <Footer />
        </body>
      </html>
    </>
  );
}
