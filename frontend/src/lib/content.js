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

export const SERVICES = [
  {
    id: "wedding",
    title: "Wedding Branding",
    description: "Bride & Groom edition bottles, gold-foil labels and bespoke monograms for unforgettable celebrations.",
    icon: Heart,
  },
  {
    id: "catering",
    title: "Catering Branding",
    description: "Elevate catering services with branded bottles that turn every table into a signature experience.",
    icon: Utensils,
  },
  {
    id: "corporate",
    title: "Corporate Branding",
    description: "Boardroom-grade custom bottles with your logo, message and brand identity, crafted to impress.",
    icon: Briefcase,
  },
  {
    id: "religious",
    title: "Religious Events",
    description: "Holy Communions, baptisms, temple events — delicate, respectful designs with timeless typography.",
    icon: Cross,
  },
  {
    id: "restaurant",
    title: "Restaurant Branding",
    description: "Bring your restaurant identity to the table with private-label bottles your guests will remember.",
    icon: Wine,
  },
  {
    id: "political",
    title: "Political & Social",
    description: "Campaigns, rallies, social events — bulk-ready customisation with crisp prints and fast turnaround.",
    icon: Megaphone,
  },
];

export const SHOWCASE = [
  { title: "Bride & Groom", subtitle: "Wedding Edition", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80", testid: "showcase-bride-groom" },
  { title: "Corporate Logo", subtitle: "Boardroom Branding", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80", testid: "showcase-corporate" },
  { title: "Restaurant", subtitle: "Private Label", image: "https://images.pexels.com/photos/32560854/pexels-photo-32560854.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", testid: "showcase-restaurant" },
  { title: "Holy Communion", subtitle: "Sacred Edition", image: "https://images.unsplash.com/photo-1606028153746-ad9b2c0a9c7e?w=1200&q=80", testid: "showcase-communion" },
  { title: "Birthday", subtitle: "Celebration Series", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80", testid: "showcase-birthday" },
  { title: "Housewarming", subtitle: "Home Edition", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80", testid: "showcase-housewarming" },
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
  { step: "01", title: "Share Your Vision", description: "Send us your logo, photo, or design brief along with the event details.", },
  { step: "02", title: "Receive Premium Preview", description: "Our design team crafts a luxury label mockup tailored to your story.", },
  { step: "03", title: "Approve The Design", description: "Refine until perfect. We iterate as many times as you need — at no cost.", },
  { step: "04", title: "Production & Delivery", description: "Premium printing, careful packaging, and on-time delivery across Kerala.", },
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
  { category: "Weddings", image: "https://images.pexels.com/photos/29040997/pexels-photo-29040997.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Royal Wedding Branding" },
  { category: "Weddings", image: "https://images.pexels.com/photos/4717555/pexels-photo-4717555.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Bride & Groom Edition" },
  { category: "Corporate", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80", title: "Annual Conference" },
  { category: "Corporate", image: "https://images.unsplash.com/photo-1758520145140-c2dd8e78fc02?w=1200&q=80", title: "Boardroom Edition" },
  { category: "Religious Events", image: "https://images.unsplash.com/photo-1606028153746-ad9b2c0a9c7e?w=1200&q=80", title: "Holy Communion" },
  { category: "Religious Events", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80", title: "Sacred Ceremony" },
  { category: "Restaurants", image: "https://images.pexels.com/photos/32560854/pexels-photo-32560854.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Fine Dining Label" },
  { category: "Restaurants", image: "https://images.pexels.com/photos/6210568/pexels-photo-6210568.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Private Label" },
  { category: "Catering", image: "https://images.pexels.com/photos/34321369/pexels-photo-34321369.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Catering Service" },
  { category: "Catering", image: "https://images.pexels.com/photos/30726881/pexels-photo-30726881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Banquet Branding" },
  { category: "Housewarming", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80", title: "Home Edition" },
  { category: "Housewarming", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80", title: "Welcome Home" },
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
  "Other",
];

export const BOTTLE_SIZES = [
  "200 ml",
  "250 ml",
  "330 ml",
  "500 ml",
  "750 ml",
  "1 Litre",
  "Custom",
];
