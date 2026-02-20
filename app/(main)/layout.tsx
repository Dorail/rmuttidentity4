import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import GlobalAssessment from "@/components/layout/GlobalAssessment";
import FallingMeteors from "@/components/ui/FallingMeteors";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <ScrollProgress />

      {/* Global Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] animate-blob will-change-transform backface-hidden" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000 will-change-transform backface-hidden" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000 will-change-transform backface-hidden" />
      </div>

      {children}
      <GlobalAssessment />
      <FallingMeteors />
      <Footer />
    </>
  );
}
