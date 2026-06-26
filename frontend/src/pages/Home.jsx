import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import Showcase from "@/components/Showcase";
import WhyPureFit from "@/components/WhyPureFit";
import FinishingOptions from "@/components/FinishingOptions";
import ProcessTimeline from "@/components/ProcessTimeline";
import Industries from "@/components/Industries";
import SocialProof from "@/components/SocialProof";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import GoogleMapSection from "@/components/GoogleMapSection";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <main data-testid="home-page" className="bg-[#111111]">
      <Hero />
      <WhatWeDo />
      <Showcase />
      <WhyPureFit />
      <FinishingOptions />
      <ProcessTimeline />
      <Industries />
      <SocialProof />
      <Gallery />
      <Testimonials />
      <GoogleMapSection />
      <CTASection />
    </main>
  );
}
