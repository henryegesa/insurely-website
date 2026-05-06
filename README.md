# Insurely — Marketing Website

Private motor insurance, reimagined for Kenya.

A React + Vite marketing website for Insurely, a licensed digital insurance agency offering instant private motor insurance via M-Pesa.

## Pages

- **Home** — Hero with dual CTA (Play Store + waitlist), 3-step how it works, cover options (TPO / TPP / Comprehensive), trust signals, bottom CTA
- **About** — Mission, problem/solution, differentiators, IRA regulatory compliance
- **FAQ** — Accordion-style grouped by Coverage, Payments, Claims, Trust & Regulation

## Brand

- **Font**: Plus Jakarta Sans (400, 500, 600, 700, 800)
- **Primary**: Midnight Navy `#0B1A2E`
- **Accent**: Champagne Gold `#C9A55C`
- **Neutrals**: `#F8F7F4`, `#E8E6E1`, `#9B978E`, `#3D3B36`

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── constants/
│   └── theme.js          # Colors, shared style tokens
├── components/
│   ├── Nav.jsx            # Fixed top navigation
│   ├── Hero.jsx           # Homepage hero with CTAs
│   ├── HowItWorks.jsx     # 3-step process section
│   ├── CoverOptions.jsx   # TPO / TPP / Comprehensive cards
│   ├── Trust.jsx           # Trust signals grid
│   ├── CTASection.jsx      # Bottom call-to-action
│   └── Footer.jsx          # Site footer
├── pages/
│   ├── HomePage.jsx        # Assembles homepage sections
│   ├── AboutPage.jsx       # About page
│   └── FAQPage.jsx         # FAQ with accordion
├── App.jsx                 # Root component with routing
├── main.jsx                # Entry point
└── index.css               # Global styles & animations
```

## Deployment

Build the project and deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, etc.)

## License

Private — Insurely © 2026
