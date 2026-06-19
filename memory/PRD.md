# PureFit Customs — Product Requirements Document

## Original Problem Statement
Build an ultra-premium, luxury business website for PUREFIT CUSTOMS — a Kerala-based customized water bottle branding company. The business positioning is: water is the product, branding is the service, customization is the business. Style inspiration: Apple / Tesla / Rolls-Royce / luxury wedding brands.

## Architecture
- **Frontend**: React 19 + React Router 7, Tailwind CSS, Framer Motion, shadcn UI, sonner toasts, Lucide icons
- **Backend**: FastAPI + Motor (MongoDB async)
- **Database**: MongoDB
- **Typography**: Cormorant Garamond (serif headings) + DM Sans (body)
- **Palette**: Deep Forest Green #0B3D2E · Gold #D4AF37 · Cream #F8F5EE · Matte Black #111111 · White #FFFFFF

## User Personas
1. **Wedding Planners / Couples** — Want luxury custom-labelled wedding bottles
2. **Corporate / Event Organizers** — Need bulk branded bottles for conferences, AGMs
3. **Restaurants & Hotels** — Want private-label bottles for table service
4. **Religious organisations** — Communion, baptism, ceremony bottles
5. **Admin / Sales team** — Reviews submitted quote requests and contact messages

## Core Requirements (Static)
- Premium luxury aesthetic, dark theme, gold accents
- Mobile responsive, fast loading
- SEO ready (schema markup, OpenGraph, keyword-rich content for Kerala)
- WhatsApp floating button (links to +91 91881 08947)
- Quote request form with file uploads (logo, photo) stored as base64 in MongoDB
- Public admin dashboard for reviewing leads

## What's Been Implemented (June 2026)
- **Home page** with all 10 sections: Hero, What We Do (6 services), Customization Showcase (bento grid), Why PureFit (8 features), Process Timeline (4 steps), Industries marquee, Animated Counters (5000+ / 100+ / 100%), Gallery with category filter, Testimonials carousel, CTA section
- **Contact page** with full inquiry form + Google Maps embed + WhatsApp / phone / email cards
- **Quote page** with full request form (Name, Phone, Email, Event Type, Bottle Size, Quantity, Event Date, Logo Upload, Photo Upload, Additional Requirements) + success state
- **Admin page** (`/admin`) listing all quote requests and contact messages with tab switching
- **Backend endpoints**: POST/GET /api/quotes, GET /api/quotes/{id}, POST/GET /api/contact
- **Floating WhatsApp button**, sticky navbar with scroll behaviour, mobile menu
- **SEO**: meta tags, OpenGraph, Twitter cards, schema.org LocalBusiness JSON-LD
- Testing: 15/15 backend tests + all frontend flows passed (iteration 1)

## Prioritised Backlog
- **P1**: Email notification when quote submitted (Resend / SendGrid integration to purefit2026@gmail.com)
- **P1**: Admin authentication (currently public — recommended JWT or Emergent Google OAuth)
- **P2**: Replace placeholder bottle imagery with real PureFit product photos
- **P2**: Live "design preview" generator — user uploads logo and sees a mockup on a bottle
- **P2**: Pricing tiers / quantity calculator on quote page
- **P3**: Blog / case studies section for SEO
- **P3**: WhatsApp Business API integration for in-platform chat
- **P3**: Multi-language (English / Malayalam) support

## Next Tasks
1. Replace gallery / showcase images with real customer project photos
2. Add admin login (recommend Emergent Google OAuth for quick setup)
3. Hook up email notification on quote submission
