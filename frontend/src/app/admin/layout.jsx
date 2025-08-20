import 'bootstrap/dist/css/bootstrap.min.css';
import "../globals.css";
import Sideuser from "@/components/Sidebar/Sideruser";
import Footer from "@/components/Footer/Footer";

export default function usuarioLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Sideuser/>
        {children}
       <Footer/>
      </body>
    </html>
  );
}
