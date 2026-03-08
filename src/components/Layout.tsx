import Header from "./Header";
import Footer from "./Footer";
import BottomTabBar from "./BottomTabBar";
import WhatsAppButton from "./WhatsAppButton";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomTabBar />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
