import { auth } from "@/lib/auth";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { SkipNav } from "@/components/landing/SkipNav";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StorySection } from "@/components/landing/StorySection";
import { FeaturesDial } from "@/components/landing/FeaturesDial";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default async function HomePage() {
  const session = await auth();
  const hasSession = !!session?.user;

  return (
    <SmoothScroll>
      <SkipNav />
      <Navbar hasSession={hasSession} />
      <main id="main-content" style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
        <HeroSection hasSession={hasSession} />
        <StorySection />
        <FeaturesDial />
        <CTASection hasSession={hasSession} />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
