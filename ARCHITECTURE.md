# Modern Studio Architecture (MERN + GSAP)

## 1) Monorepo Layout

```text
F:\Modern Studio
├─ client/                        # React + Vite + Tailwind + GSAP
├─ server/                        # Node + Express + MongoDB + JWT
├─ .env.example                   # Shared template env
└─ README.md                      # Setup + run docs (to be added in later step)
```

## 2) Frontend Architecture (client)

```text
client/
├─ src/
│  ├─ app/
│  │  └─ App.jsx
│  ├─ main.jsx
│  ├─ index.css
│  ├─ routes/
│  │  ├─ AppRouter.jsx
│  │  ├─ PublicRoutes.jsx
│  │  └─ AdminRoutes.jsx
│  ├─ layouts/
│  │  ├─ PublicLayout.jsx
│  │  └─ AdminLayout.jsx
│  ├─ pages/
│  │  ├─ public/
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ WeddingsPage.jsx
│  │  │  ├─ FashionPage.jsx
│  │  │  ├─ FilmsPage.jsx
│  │  │  ├─ PortfolioPage.jsx
│  │  │  ├─ AboutPage.jsx
│  │  │  └─ BookingPage.jsx
│  │  ├─ admin/
│  │  │  ├─ AdminLoginPage.jsx
│  │  │  ├─ DashboardPage.jsx
│  │  │  ├─ PackagesPage.jsx
│  │  │  ├─ MediaPage.jsx
│  │  │  ├─ FilmsManagePage.jsx
│  │  │  ├─ HomeContentPage.jsx
│  │  │  ├─ BookingsPage.jsx
│  │  │  └─ InquiriesPage.jsx
│  ├─ components/
│  │  ├─ common/
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ Footer.jsx
│  │  │  ├─ SectionHeading.jsx
│  │  │  └─ Loader.jsx
│  │  ├─ ui/
│  │  │  ├─ Button.jsx
│  │  │  ├─ Card.jsx
│  │  │  ├─ Input.jsx
│  │  │  ├─ Select.jsx
│  │  │  └─ Modal.jsx
│  │  ├─ motion/
│  │  │  ├─ HeroWordStagger.jsx
│  │  │  └─ FadeUpReveal.jsx
│  │  └─ admin/
│  │     ├─ DataTable.jsx
│  │     ├─ StatusPill.jsx
│  │     └─ CrudFormDrawer.jsx
│  ├─ hooks/
│  │  ├─ useHeroWordStagger.js
│  │  ├─ useFadeUpReveal.js
│  │  └─ useNavbarBlurOnScroll.js
│  ├─ services/
│  │  ├─ apiClient.js
│  │  ├─ authApi.js
│  │  ├─ packageApi.js
│  │  ├─ mediaApi.js
│  │  ├─ filmApi.js
│  │  ├─ homeApi.js
│  │  ├─ bookingApi.js
│  │  └─ inquiryApi.js
│  ├─ store/
│  │  └─ authStore.js
│  ├─ lib/
│  │  └─ formatters.js
│  └─ constants/
│     ├─ navLinks.js
│     ├─ packageDefaults.js
│     └─ addOnDefaults.js
├─ tailwind.config.js
├─ postcss.config.js
└─ vite.config.js
```

### Frontend Key Decisions
- React Router based public + admin route groups.
- Protected admin routes with JWT guard (token + expiry checks).
- Axios instance with auth interceptor for admin API calls.
- GSAP + ScrollTrigger for cinematic motion system.
- Design tokens in Tailwind for your premium dark visual language.

## 3) Backend Architecture (server)

```text
server/
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  │  ├─ env.js
│  │  └─ db.js
│  ├─ models/
│  │  ├─ User.js
│  │  ├─ Package.js
│  │  ├─ Media.js
│  │  ├─ Film.js
│  │  ├─ HomeContent.js
│  │  ├─ Booking.js
│  │  └─ Inquiry.js
│  ├─ controllers/
│  │  ├─ auth.controller.js
│  │  ├─ package.controller.js
│  │  ├─ media.controller.js
│  │  ├─ film.controller.js
│  │  ├─ home.controller.js
│  │  ├─ booking.controller.js
│  │  ├─ inquiry.controller.js
│  │  └─ dashboard.controller.js
│  ├─ routes/
│  │  ├─ index.js
│  │  ├─ auth.routes.js
│  │  ├─ package.routes.js
│  │  ├─ media.routes.js
│  │  ├─ film.routes.js
│  │  ├─ home.routes.js
│  │  ├─ booking.routes.js
│  │  ├─ inquiry.routes.js
│  │  └─ dashboard.routes.js
│  ├─ middleware/
│  │  ├─ auth.middleware.js
│  │  ├─ requireAdmin.middleware.js
│  │  ├─ validate.middleware.js
│  │  ├─ error.middleware.js
│  │  └─ notFound.middleware.js
│  ├─ validators/
│  │  ├─ auth.validator.js
│  │  ├─ package.validator.js
│  │  ├─ media.validator.js
│  │  ├─ film.validator.js
│  │  ├─ home.validator.js
│  │  ├─ booking.validator.js
│  │  └─ inquiry.validator.js
│  ├─ utils/
│  │  ├─ ApiError.js
│  │  ├─ ApiResponse.js
│  │  ├─ asyncHandler.js
│  │  └─ seedDefaults.js
│  └─ constants/
│     ├─ packages.seed.js
│     └─ addons.seed.js
├─ package.json
└─ .env.example (or root-level shared template)
```

### Backend Key Decisions
- REST API with clean controller/service-like separation.
- Mongoose schemas with timestamps + indexes for common queries.
- JWT auth for admin, role-safe middleware.
- Centralized validation and error handling.
- Seeded starter data for packages/add-ons exactly as provided.

## 4) Database Schema Design

### User
- `name`, `email` (unique), `passwordHash`, `role` (`admin`), `isActive`

### Package
- `name` (`Essential`, `Premium`, `Luxury`)
- `priceDisplay` (`₹45,000+`, etc.)
- `startingPrice` (number for sorting)
- `description`
- `features[]`
- `isActive`
- `sortOrder`

### Media
- `title`, `type` (`photo|video`), `category` (`weddings|fashion|films|portfolio|home`)
- `url`, `thumbnailUrl`, `alt`, `isFeatured`, `sortOrder`

### Film
- `title`, `slug`, `summary`, `coverImage`, `videoUrl`, `tags[]`, `isPublished`

### HomeContent
- `heroTitle`, `heroSubtitle`, `heroBackgroundMedia`
- `aboutSnippet`, `stats[]`, `ctaText`, `ctaLink`
- `sectionBlocks` (flexible JSON for future edits)

### Booking
- `name`, `email`, `phone`
- `selectedPackage` (snapshot object + optional `packageId` ref)
- `addOns[]` (snapshot objects)
- `status` (`pending|accepted|rejected`)
- `statusHistory[]`:
  - `status`, `note`, `changedBy`, `changedAt`
- `payment` (future-ready):
  - `status` (`unpaid|processing|paid|failed|refunded`)
  - `amount`, `currency`, `transactionId`, `provider`, `paidAt`

### Inquiry
- `name`, `email`, `phone`, `message`, `sourcePage`, `isResolved`

## 5) API Surface (v1)

### Public
- `GET /api/v1/home`
- `GET /api/v1/packages`
- `GET /api/v1/media?category=`
- `GET /api/v1/films`
- `POST /api/v1/bookings`
- `POST /api/v1/inquiries`

### Admin Auth
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Admin CRUD
- `GET/POST/PUT/DELETE /api/v1/admin/packages`
- `GET/POST/PUT/DELETE /api/v1/admin/media`
- `GET/POST/PUT/DELETE /api/v1/admin/films`
- `GET/PUT /api/v1/admin/home`
- `GET /api/v1/admin/bookings`
- `PATCH /api/v1/admin/bookings/:id/status`
- `GET /api/v1/admin/inquiries`
- `PATCH /api/v1/admin/inquiries/:id/resolve`
- `GET /api/v1/admin/dashboard/stats`

## 6) Required Seed Data (Exact Business Data)

### Packages
1. Essential Package — `₹45,000 onwards`
- 1 Photographer + 1 Cinematographer
- Full day wedding coverage
- Candid + Traditional Photography
- 3-5 min cinematic film
- 300+ edited photos
- Premium album

2. Premium Package — `₹85,000 onwards`
- 2 Photographers + 2 Cinematographers
- Multi-event coverage
- Drone shots
- Cinematic wedding film
- Teaser reel in 48 hrs
- Bridal editorial portraits
- Premium album

3. Luxury Package — `₹1,50,000 onwards`
- Full luxury wedding production
- Documentary-style wedding film
- Drone + cinematic storytelling
- Same-day edit
- Couple love story film
- Luxury album + premium box
- Instagram content coverage
- For destination & premium weddings

### Add-ons
- Pre-Wedding Film — `₹20,000+`
- Drone Coverage — `₹8,000+`
- Wedding Content Creator — `₹15,000+`
- Same Day Edit — `₹18,000+`

## 7) Motion/Design System Implementation Plan

### Design Tokens
- Background: `#0a0a0a`
- Surface: `#111111`
- Cards: `rgba(255,255,255,0.04)`
- Border: `rgba(255,255,255,0.10)`
- Accent Gradient: `#a855f7 -> #f59e0b`

### GSAP Rules
- Hero word stagger: `stagger: 0.08`, `y: 40 -> 0`, `opacity: 0 -> 1`
- Scroll reveal: fade-up on viewport enter
- Card hover: `translateY(-5px)`
- Button hover: `scale(1.05)`
- Navbar: transparent to blur on scroll

## 8) Security + Production Readiness
- `helmet`, `cors`, `express-rate-limit`, `cookie-parser`
- Input validation (Zod/Joi), centralized errors
- Mongoose indexes + lean queries for list APIs
- Password hashing (`bcrypt`), JWT expiry checks
- Env-based config, `.env.example`

## 9) Build Order (Execution)
1. Architecture (this step)
2. Backend scaffolding + models/routes/controllers
3. Frontend scaffolding + Tailwind + base routes
4. Navbar/Layout + global motion hooks
5. Hero section + cinematic GSAP timeline
6. Remaining public sections
7. Admin panel + CRUD screens
8. Frontend-backend integration
9. End-to-end testing + cleanup

## 10) Environment Template

```env
MONGO_URI=
JWT_SECRET=
PORT=
```

