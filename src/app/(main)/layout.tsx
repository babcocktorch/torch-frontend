import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Toaster position="top-center" />
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
