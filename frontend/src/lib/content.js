// Static content for the PureFit Customs site
import {
  Heart, Utensils, Briefcase, Cross, Wine, Megaphone,
  Sparkles, Zap, Package, Award, Tag, Truck, UserCheck, Eye
} from "lucide-react";

export const CONTACT = {
  phone1: "+91 91881 08947",
  phone2: "+91 92073 51551",
  whatsapp: "919188108947",
  email: "purefit2026@gmail.com",
  address: "Eravimangalam (PO), Manjoor, Kerala 686613, Kottayam",
  shortAddress: "Eravimangalam, Kerala",
  mapsQuery: "Eravimangalam Manjoor Kottayam Kerala 686613",
};

export const NAV_LINKS = [
  { label: "Home", to: "/", testid: "nav-home" },
  { label: "Services", to: "/#services", testid: "nav-services" },
  { label: "Gallery", to: "/#gallery", testid: "nav-gallery" },
  { label: "Process", to: "/#process", testid: "nav-process" },
  { label: "Contact", to: "/contact", testid: "nav-contact" },
];

// AI-generated PureFit-style luxury PET water bottle product imagery
// (located in /app/frontend/public/bottles/, served as /bottles/*.png)
export const BOTTLES = {
  wedding: "/bottles/wedding.png",
  catering: "/bottles/catering.png",
  corporate: "/bottles/corporate.png",
  religious: "/bottles/religious.png",
  restaurant: "/bottles/restaurant.png",
  political: "/bottles/political.png",
  funeral: "/bottles/funeral.png",
  communion: "/bottles/communion.png",
  birthday: "/bottles/birthday.png",
  housewarming: "/bottles/housewarming.png",
};

export const HERO_ROTATION = [
  { title: "Wedding Edition", subtitle: "Bride & Groom Bottle", image: BOTTLES.wedding },
  { title: "Catering Edition", subtitle: "Banquet Branded Bottle", image: BOTTLES.catering },
  { title: "Corporate Edition", subtitle: "Boardroom Branded Bottle", image: BOTTLES.corporate },
  { title: "Funeral Service", subtitle: "Memorial Branded Bottle", image: BOTTLES.funeral },
];

export const SERVICES = [
  {
    id: "wedding",
    title: "Wedding Branding",
    description: "Bride & Groom edition bottles, gold-foil labels and bespoke monograms for unforgettable celebrations.",
    icon: Heart,
    image: BOTTLES.wedding,
  },
  {
    id: "catering",
    title: "Catering Branding",
    description: "Elevate catering services with branded bottles that turn every table into a signature experience.",
    icon: Utensils,
    image: BOTTLES.catering,
  },
  {
    id: "corporate",
    title: "Corporate Branding",
    description: "Boardroom-grade custom bottles with your logo, message and brand identity, crafted to impress.",
    icon: Briefcase,
    image: BOTTLES.corporate,
  },
  {
    id: "religious",
    title: "Religious Events",
    description: "Holy Communions, baptisms, temple events — delicate, respectful designs with timeless typography.",
    icon: Cross,
    image: BOTTLES.communion,
  },
  {
    id: "restaurant",
    title: "Restaurant Branding",
    description: "Bring your restaurant identity to the table with private-label bottles your guests will remember.",
    icon: Wine,
    image: BOTTLES.restaurant,
  },
  {
    id: "political",
    title: "Political & Social",
    description: "Campaigns, rallies, social events — bulk-ready customisation with crisp prints and fast turnaround.",
    icon: Megaphone,
    image: BOTTLES.political,
  },
];

export const SHOWCASE = [
  { title: "Bride & Groom", subtitle: "Wedding Edition", image: BOTTLES.wedding, testid: "showcase-bride-groom" },
  { title: "Corporate Logo", subtitle: "Boardroom Branding", image: BOTTLES.corporate, testid: "showcase-corporate" },
  { title: "Restaurant", subtitle: "Private Label", image: BOTTLES.restaurant, testid: "showcase-restaurant" },
  { title: "Holy Communion", subtitle: "Sacred Edition", image: BOTTLES.communion, testid: "showcase-communion" },
  { title: "Birthday", subtitle: "Celebration Series", image: BOTTLES.birthday, testid: "showcase-birthday" },
  { title: "Housewarming", subtitle: "Home Edition", image: BOTTLES.housewarming, testid: "showcase-housewarming" },
];

export const WHY_FEATURES = [
  { title: "Premium Design Team", description: "In-house designers crafting label artwork like a luxury brand.", icon: Sparkles },
  { title: "Fast Turnaround", description: "Tight event timelines? We deliver without compromise on quality.", icon: Zap },
  { title: "Bulk Event Supply", description: "From 100 to 50,000+ bottles — production scaled for any event.", icon: Package },
  { title: "High Quality Printing", description: "Gold foil, matte, gloss & embossed finishes available.", icon: Award },
  { title: "Professional Labels", description: "Waterproof, scratch-resistant labels with premium finishing.", icon: Tag },
  { title: "Kerala Wide Delivery", description: "Door delivery across Kerala — temperature-safe packaging.", icon: Truck },
  { title: "Personalized Service", description: "A dedicated branding consultant from concept to delivery.", icon: UserCheck },
  { title: "Attention To Detail", description: "Every bottle inspected. Every label perfect. No exceptions.", icon: Eye },
];

export const PROCESS_STEPS = [
  { step: "01", title: "Share Your Vision", description: "Send us your logo, photo, or design brief along with the event details." },
  { step: "02", title: "Receive Premium Preview", description: "Our design team crafts a luxury label mockup tailored to your story." },
  { step: "03", title: "Approve The Design", description: "Refine until perfect. We iterate as many times as you need — at no cost." },
  { step: "04", title: "Production & Delivery", description: "Premium printing, careful packaging, and on-time delivery across Kerala." },
];

export const INDUSTRIES = [
  "Wedding Planners",
  "Event Management",
  "Catering Services",
  "Restaurants",
  "Hotels & Resorts",
  "Churches & Temples",
  "Educational Institutions",
  "Corporate Organizations",
  "Funeral Service Providers",
];

export const STATS = [
  { value: 5000, suffix: "+", label: "Customized Bottles Delivered" },
  { value: 100, suffix: "+", label: "Events Served" },
  { value: 100, suffix: "%", label: "Custom Design Support" },
];

export const GALLERY = [
  { category: "Weddings", image: BOTTLES.wedding, title: "Bride & Groom Edition" },
  { category: "Weddings", image: BOTTLES.birthday, title: "Royal Wedding Series" },
  { category: "Corporate", image: BOTTLES.corporate, title: "Annual Conference Edition" },
  { category: "Corporate", image: BOTTLES.political, title: "Brand Launch Bottle" },
  { category: "Religious Events", image: BOTTLES.communion, title: "Holy Communion Bottle" },
  { category: "Religious Events", image: BOTTLES.religious, title: "Sacred Ceremony Edition" },
  { category: "Restaurants", image: BOTTLES.restaurant, title: "Fine Dining Private Label" },
  { category: "Restaurants", image: BOTTLES.funeral, title: "Boutique Café Label" },
  { category: "Catering", image: BOTTLES.catering, title: "Banquet Service Bottle" },
  { category: "Catering", image: BOTTLES.housewarming, title: "Outdoor Event Bottle" },
  { category: "Housewarming", image: BOTTLES.housewarming, title: "Welcome Home Edition" },
  { category: "Housewarming", image: BOTTLES.wedding, title: "Family Gathering Bottle" },
];

export const GALLERY_CATEGORIES = [
  "All", "Weddings", "Corporate", "Religious Events", "Restaurants", "Catering", "Housewarming",
];

export const TESTIMONIALS = [
  {
    name: "Aishwarya & Rohan",
    role: "Wedding, Kottayam",
    quote: "PureFit transformed our wedding tables. Guests took the bottles home as keepsakes. The gold foil monogram was simply breathtaking.",
  },
  {
    name: "Joseph Mathew",
    role: "Director, Kerala Spices Co.",
    quote: "We needed 5000 bottles for our annual conference. Delivered in 5 days, every label perfect. PureFit is now our default branding partner.",
  },
  {
    name: "Fr. Antony",
    role: "Holy Family Church",
    quote: "Beautiful, respectful design for our communion event. The team understood the sentiment and delivered above expectations.",
  },
  {
    name: "Meera Restaurants",
    role: "Restaurant Group, Kochi",
    quote: "Our private-label bottles instantly elevated the dining experience. Customers ask where they can buy them — that says everything.",
  },
];

export const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "Catering",
  "Religious Event",
  "Birthday",
  "Housewarming",
  "Political / Social",
  "Restaurant Branding",
  "Funeral Service",
  "Other",
];

export const BOTTLE_SIZES = [
  "200 ml",
  "250 ml",
  "300 ml PET",
  "500 ml PET",
  "750 ml",
  "1 Litre",
  "Custom",
];
