import { SiteNavbar, type NavItem } from "@/components/site-navbar";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import AboutPage from "@/components/ui/about-page";
import { MissionVision } from "@/components/mission-vision";
import { CoachesShowcase } from "@/components/ui/connoisseur-stack-interactor";
import SkewCards from "@/components/ui/gradient-card-showcase";
import { JourneyTimeline } from "@/components/ui/journey-timeline";
import { ContactSection } from "@/components/ui/contact-section";
import { TrainingFormats } from "@/components/ui/training-formats";
import { ClassSchedule } from "@/components/ui/class-schedule";
import { SiteFooter } from "@/components/site-footer";
import { SOCIALS, whatsappUrl } from "@/lib/site";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/social-icons";

const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Coaches", href: "#coaches" },
  { label: "Disciplines", href: "#disciplines" },
  { label: "Journey", href: "#journey" },
  { label: "Schedule", href: "#schedule" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: <InstagramIcon className="size-4" />, href: SOCIALS.instagram, label: "Instagram" },
  { icon: <FacebookIcon className="size-4" />, href: SOCIALS.facebook, label: "Facebook" },
  { icon: <TikTokIcon className="size-4" />, href: SOCIALS.tiktok, label: "TikTok" },
  { icon: <WhatsAppIcon className="size-4" />, href: whatsappUrl(), label: "WhatsApp" },
];

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <SiteNavbar items={navItems} activeHref="#home" ctaLabel="Start Training" ctaHref="#contact" />
        <MinimalistHero
          eyebrow="Est. 2023 · Penang, Malaysia"
          mainText="Structured Boxing, Muay Thai and Taekwondo training that builds real skill, fitness and mental resilience — whether it's your first class or your next fight."
          primaryCta={{ label: "Start Training", href: "#contact" }}
          secondaryCta={{ label: "Our Story", href: "#about" }}
          imageSrc="/hero-strike-cutout.png"
          imageAlt="A StrikeZone fighter in a high guard wearing black and gold boxing gloves."
          imageWidth={1105}
          imageHeight={1280}
          overlayText={{ part1: ["Building", "Fighters."], part2: ["Building", "Character."] }}
          stats={[
            { value: "16+", label: "Yrs coaching" },
            { value: "3", label: "Expert coaches" },
            { value: "4", label: "Disciplines" },
          ]}
          socialLinks={socialLinks}
          motto="Discipline • Development • Dedication"
          locationText="Machang Bubok, Bukit Mertajam, Penang"
        />
        <AboutPage />
        <MissionVision />
        <CoachesShowcase />
        <SkewCards />
        <JourneyTimeline />
        <TrainingFormats />
        <ClassSchedule />
        <ContactSection />
      </main>
      <SiteFooter navItems={navItems} />
    </>
  );
}
