import { AboutSection, HomeHero } from "@/components/sections";

export default function HomePage() {
  return (
    <div className="page about-stack page--home">
      <HomeHero />
      <AboutSection />
    </div>
  );
}
