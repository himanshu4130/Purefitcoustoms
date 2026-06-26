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
    description: "Burgundy, Rose Gold, and Cream label designs. Custom monograms on square and round PET bottles.",
    image: "/wedding_bottle.png",
    icon: Heart,
  },
  {
    id: "corporate",
    title: "Corporate Branding",
    description: "Navy Blue, Silver, and Dark Grey board-room quality PET bottles printed with your logo.",
    image: "/corporate_bottle.png",
    icon: Briefcase,
  },
  {
    id: "restaurant",
    title: "Restaurant Branding",
    description: "Matte Black, Gold, and Premium White private labels designed for premium dining experiences.",
    image: "/restaurant_bottle.png",
    icon: Wine,
  },
  {
    id: "catering",
    title: "Catering Branding",
    description: "Vibrant red, orange, and maroon themed custom branding that elevates every serving table.",
    image: "/catering_bottle.png",
    icon: Utensils,
  },
  {
    id: "holy_communion",
    title: "Holy Communion",
    description: "Sacred gold, beige, and white designs reflecting reverence and elegance.",
    image: "/holy_communion_bottle.png",
    icon: Cross,
  },
  {
    id: "baptism",
    title: "Baptism",
    description: "Soft sky blue, white, and gold themed labels for beautiful baptismal celebrations.",
    image: "/baptism_bottle.png",
    icon: Sparkles,
  },
  {
    id: "housewarming",
    title: "Housewarming",
    description: "Warm brown, cream, and traditional Kerala theme designs for welcoming guests.",
    image: "/housewarming_bottle.png",
    icon: Tag,
  },
  {
    id: "funeral",
    title: "Funeral Services",
    description: "Respectful white, black, grey, and gold memorial custom water bottles.",
    image: "/funeral_bottle.png",
    icon: Award,
  },
  {
    id: "political",
    title: "Political Events",
    description: "Bulk-ready campaign bottles customized with party theme colors and crisp prints.",
    image: "/political_bottle.png",
    icon: Megaphone,
  }
];

export const SHOWCASE = [
  { title: "Save the Date", subtitle: "Wedding Edition", image: "/wedding_bottle.png", testid: "showcase-bride-groom" },
  { title: "TechNova Corporation", subtitle: "Boardroom Branding", image: "/corporate_bottle.png", testid: "showcase-corporate" },
  { title: "Royal Dine", subtitle: "Private Label Still Water", image: "/restaurant_bottle.png", testid: "showcase-restaurant" },
  { title: "First Holy Communion", subtitle: "Sacred Edition", image: "/holy_communion_bottle.png", testid: "showcase-communion" },
  { title: "Holy Baptism", subtitle: "Baptism Edition", image: "/baptism_bottle.png", testid: "showcase-birthday" },
  { title: "Grihapravesham", subtitle: "Traditional Kerala Housewarming", image: "/housewarming_bottle.png", testid: "showcase-housewarming" },
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
  "Political Campaigns",
];

export const STATS = [
  { value: 50000, suffix: "+", label: "Customized Bottles Delivered" },
  { value: 500, suffix: "+", label: "Brands & Events Served" },
  { value: 100, suffix: "%", label: "Custom Design Support" },
];

export const GALLERY = [
  { category: "Weddings", image: "/wedding_bottle.png", title: "Wedding Branding", client: "Royal Cloud Caterers", quantity: "500 Bottles" },
  { category: "Corporate", image: "/corporate_bottle.png", title: "Corporate Branding", client: "TechNova", quantity: "2500 Bottles" },
  { category: "Restaurants", image: "/restaurant_bottle.png", title: "Restaurant Branding", client: "Royal Dine", quantity: "1200 Bottles" },
  { category: "Catering", image: "/catering_bottle.png", title: "Catering Branding", client: "Elite Catering", quantity: "1500 Bottles" },
  { category: "Religious Events", image: "/holy_communion_bottle.png", title: "Holy Communion", client: "St. Mary's Church", quantity: "400 Bottles" },
  { category: "Religious Events", image: "/baptism_bottle.png", title: "Baptism", client: "Kottayam Diocese", quantity: "600 Bottles" },
  { category: "Housewarming", image: "/housewarming_bottle.png", title: "Housewarming", client: "The Nair Residency", quantity: "300 Bottles" },
  { category: "Funeral Services", image: "/funeral_bottle.png", title: "Funeral Branding", client: "Gamut Events", quantity: "1000 Bottles" },
  { category: "Political Events", image: "/political_bottle.png", title: "Political Campaigns", client: "Kerala Progress Party", quantity: "5000 Bottles" }
];

export const GALLERY_CATEGORIES = [
  "All", "Weddings", "Corporate", "Religious Events", "Restaurants", "Catering", "Housewarming", "Funeral Services", "Political Events"
];

export const TESTIMONIALS = [
  {
    name: "Royal Cloud Caterers",
    role: "Kottayam",
    quote: "PureFit transformed our banquet tables. Guests loved the customized bottles. The gold foil monogram was simply breathtaking.",
  },
  {
    name: "TechNova Inc.",
    role: "Kochi",
    quote: "We needed 2500 bottles for our annual summit. Delivered on time, every label crisp and clean. PureFit is now our default branding partner.",
  },
  {
    name: "St. Mary's Church Council",
    role: "Ernakulam",
    quote: "Beautiful, respectful design for our communion event. The team understood the sentiment and delivered above expectations.",
  },
  {
    name: "Royal Dine Group",
    role: "Kochi",
    quote: "Our private-label bottles instantly elevated the dining experience. Customers ask where they can get them — that says everything.",
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
