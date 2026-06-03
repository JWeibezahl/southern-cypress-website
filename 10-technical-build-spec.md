# Technical Build Specification

## Hosting

Use Cloudflare Pages.

## Recommended File Structure

```text
southern-cypress-homes/
  index.html
  about.html
  services.html
  kitchen-remodeling.html
  bathroom-remodeling.html
  outdoor-living.html
  decks-and-pergolas.html
  exterior-painting.html
  flooring-and-trim.html
  our-work.html
  process.html
  reviews.html
  contact.html
  assets/
    css/
      styles.css
    js/
      main.js
    images/
      logo.png
      hero-home.jpg
      kitchen.jpg
      bathroom.jpg
      outdoor-living.jpg
      deck.jpg
      exterior-painting.jpg
```

## Build Rules

- Static HTML and CSS preferred
- No heavy frameworks required
- Fully responsive
- Mobile first
- Fast loading
- SEO-friendly semantic HTML
- Accessible navigation
- Alt text on all images
- HubSpot embedded form on contact page
- Click-to-call phone links
- External links open normally, not in forced new tabs unless appropriate

## Required CSS Sections

- root variables
- reset
- typography
- buttons
- header
- top bar
- navigation
- mobile menu
- hero
- service strip
- cards
- about sections
- portfolio grid
- trust badges
- process steps
- reviews
- contact form wrapper
- footer
- responsive breakpoints

## CSS Variables

```css
:root {
  --color-green: #445B2A;
  --color-green-dark: #2E3B1F;
  --color-gold: #C8A25A;
  --color-gold-soft: #D6B97A;
  --color-cream: #F4F1EA;
  --color-charcoal: #2B2B2B;
  --color-white: #FFFFFF;

  --font-heading: "Cormorant Garamond", Georgia, serif;
  --font-body: "Montserrat", Arial, sans-serif;

  --container: 1180px;
  --radius: 4px;
  --shadow: 0 18px 45px rgba(0,0,0,0.12);
}
```

## Breakpoints

```css
@media (max-width: 1100px) {}
@media (max-width: 900px) {}
@media (max-width: 700px) {}
@media (max-width: 480px) {}
```

## Header Requirements

Desktop:

- top contact bar
- logo left
- nav center/right
- quote button right

Mobile:

- logo left
- hamburger right
- tap-to-call visible
- sticky bottom call/quote bar optional

## Footer Requirements

Footer should include:

- logo
- tagline
- phone
- email
- service area
- quick links
- services
- CTA box

## JavaScript

Only use JS for:

- mobile navigation
- optional FAQ accordions
- optional gallery filtering
- form enhancements

## Performance

- Compress images
- Use WebP where possible
- Lazy-load non-hero images
- Keep CSS lean
- Avoid unnecessary libraries
- Use system fallback fonts if Google Fonts fail

## Deployment to Cloudflare Pages

1. Push repo to GitHub
2. Go to Cloudflare Pages
3. Connect GitHub repo
4. Framework preset: None
5. Build command: blank
6. Build output directory: `/`
7. Deploy
8. Add custom domain: southerncypresshomes.com
