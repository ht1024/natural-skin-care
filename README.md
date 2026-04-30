# Natural Skin Care SA by Norma Perry - One-Page Site

Modern, responsive one-page website built with **React** on the frontend and **Node.js + Express** on the backend.

## Tech Stack

- Frontend: React, HTML5, CSS3
- Backend: Node.js, Express
- Tooling: Vite, Nodemon, Concurrently

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   npm --prefix client install
   ```
2. Run in development:
   ```bash
   npm run dev
   ```
3. Build frontend:
   ```bash
   npm run build
   ```
4. Run production server:
   ```bash
   npm start
   ```

## Site Sections

1. Hero (animated React word transition)
2. About
3. Services (cards + waxing list)
4. Specials (React rotating banner)
5. Contact
6. Footer

## Updating Content

### Services

- Edit service cards in `client/src/data/services.js` (`serviceCards`).
- Edit waxing items in `client/src/data/services.js` (`waxingServices`).

### Specials Banner

- Edit `specialsSeed` in `client/src/components/SpecialsCarousel.jsx`.
- Each special uses:
  - `title`
  - `details`
  - `cta`

### Menu Items

- Top links are in `topLinks` within `client/src/components/MegaMenu.jsx`.
- Services mega menu columns are in `serviceColumns` within `client/src/components/MegaMenu.jsx`.

## Accessibility Notes

- Semantic sections and headings
- Keyboard-friendly menu controls (Escape to close)
- ARIA labels for navigation and carousel controls
- Visible focus states for buttons, links, and form fields

## Browser Testing Checklist

- iOS Safari
- Android Chrome
- Desktop Chrome, Safari, Firefox, Edge
- Resize from mobile to ultrawide to verify responsive behavior
