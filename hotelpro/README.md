# HotelPro: Hotel Management System (MERN)

Guests search and book rooms, pay, review stays and message support. Staff run reservations, check-in/out,
housekeeping and service requests. Admins manage rooms, pricing, users, payments, reports, logs and configuration.

## Prerequisites
Node.js v16+ (v18+ recommended), npm v8+, MongoDB Community running locally, a modern browser.
Postman and VS Code are optional.

## Run
**Backend**
```bash
cd server
cp .env.example .env     # set JWT_SECRET (16+ characters, ideally random)
npm install
npm run seed             # demo data (safe to repeat)
npm run dev              # http://localhost:8001   (npm test runs the pricing tests)
```
**Frontend** (second terminal)
```bash
cd client
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```
Optional: `docker compose up --build`, then `docker compose exec server node seed.js`.

## Demo accounts (created by `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Admin | admin@hotelpro.com | admin123 |
| Staff (front desk) | staff@hotelpro.com | staff123 |
| Staff (housekeeping) | housekeeping@hotelpro.com | staff123 |
| Guest | guest@hotelpro.com | guest123 |

Change or delete these before any real deployment.

## Modules

**Guest**: register/login, email verification, profile and password change, room search (dates, type, category,
hotel, capacity, price, sort, pagination), room details with photos and reviews, booking with a server-side price quote
(seasonal rates + tax) and card payment, booking history with status filter, cancellation with refund request,
invoices (print / save as PDF), reviews and ratings after a stay, guest service requests, support tickets with
two-way messages, notification centre.

**Staff**: dashboard with arrivals, departures, occupancy and open work; reservations list with approve, modify
dates (re-priced), cancel, check-in and check-out; refund review; room status updates; housekeeping tasks
(auto-created at check-out, assignable, finishing a clean releases the room); service request handling; customer support inbox.

**Hotel management (admin)**: room inventory and pricing (including image upload), seasonal pricing rules,
hotels, room categories, availability and occupancy tracking, booking approval mode, staff assignment on tasks.

**Admin**: user and staff management (create, edit role, disable, delete), booking monitoring, payment tracking
with totals, reports (monthly revenue, 14-day occupancy forecast, top rooms), review moderation, announcements to
all/guests/staff, audit log, security monitor (failed logins, errors, system health), platform configuration (site name,
tax rate, approval, check-in/out times).

**Shared**: notifications (polled every 30 s), email confirmations, invoice generation, dark/light theme, responsive layout.

## Security
bcrypt password hashing, JWT (7 days), role checks on every protected route (server) plus route guards (client),
input validation, MongoDB operator-injection stripping, login and sign-up rate limiting plus a global API limit,
upload limits (3 MB, images only), disabled-account enforcement, audit logging of sensitive actions, only the last 4
card digits are stored (never the full number or CVV).

## Performance
Indexes on every common query, MongoDB aggregation pipelines for reports, server-side pagination everywhere,
night-by-night prices stored on each booking, lazy-loaded dashboards (code splitting), lazy-loaded images, an hourly background job
for arrival reminders.

## API summary (all under `/api`)
`/auth/*`, `/settings`, `/users`, `/hotels`, `/categories`, `/seasonal`, `/rooms`, `/bookings` (+ `quote`, `mine`,
`:id/invoice|cancel|approve|modify|refund|checkin|checkout`), `/payments`, `/checkins`, `/housekeeping`, `/services`,
`/support`, `/reviews`, `/notifications`, `/reports/*`, `/admin/logs`, `/admin/security`. Route-to-role mapping is in `server/routes/index.js`.

## Honest limits: read before submitting or deploying
- **Payments are simulated.** The card form is validated and a payment record is created, but no money moves. Replace the marked block in
  `bookingController.createBooking` with Stripe or Razorpay for real payments. Refunds are recorded, not sent to a gateway.
- **Not built from the original tech list:** Redux (React state and hooks are used), Material UI (Bootstrap only), Chart.js/Recharts (a small built-in SVG chart is used),
  Redis caching, cloud image storage (uploads go to `server/uploads`), CDN, load balancing and microservices. The docker-compose file is a starting point and has not been run.
- **Sign-up can create Staff/Admin accounts** while `ALLOW_PRIVILEGED_SIGNUP=true` (matches the course project). Set it to `false` for real use;
  admins can then create staff in User Management.
- **Email** is printed to the server console unless you set SMTP details in `.env`.
- **Single-server design:** the rate limiter and background job live inside the API process.
- **Testing status:** the pricing logic has unit tests (`npm test`). The rest of the code was syntax-checked and its imports verified, but it has **not been run against a
  live database or browser**, so expect to fix a few small issues on first run.
