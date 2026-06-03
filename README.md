# Southern Cypress Homes Website Build Pack

This pack gives GitHub Copilot everything needed to build the full Southern Cypress Homes website.

## Brand Position

Southern Cypress Homes is a Florida-based residential renovation company focused on kitchen remodeling, bathroom remodeling, outdoor living spaces, decks and pergolas, exterior painting, flooring, trim, finish carpentry, and home improvements.

The site should make the company feel established, polished, trustworthy, and larger than a small handyman operation, while avoiding language that directly claims licensed GC services, plumbing, electrical, HVAC, roofing, structural engineering, or ground-up construction.

Use this positioning throughout the website:

> Quality renovations and home improvements crafted with integrity, communication, and lasting craftsmanship.

## Build Recommendation

Build as a fast static website suitable for Cloudflare Pages.

Recommended stack:

- HTML
- CSS
- Vanilla JavaScript
- HubSpot embedded forms
- Cloudflare Pages hosting
- Microsoft 365 email
- Quo/OpenPhone phone and text
- HubSpot CRM

## Required Pages

- Home
- About
- Services
- Kitchen Remodeling
- Bathroom Remodeling
- Outdoor Living
- Decks & Pergolas
- Exterior Painting
- Flooring & Trim
- Our Work
- Process
- Reviews
- Contact

## Important Compliance Language

Do not say:

- Licensed General Contractor
- Full-service GC
- Ground-up construction
- Structural additions
- Roofing
- Electrical contractor
- Plumbing contractor
- HVAC contractor
- All trades performed in-house

Use instead:

- Trusted licensed trade partners when required
- Carefully coordinated projects
- Residential renovations and improvements
- Kitchen and bathroom remodeling
- Outdoor living and home upgrades
- Quality craftsmanship and clear communication

## Primary CTA

Use this everywhere:

> Get a Quote

Secondary CTAs:

> View Our Work  
> Talk About Your Project  
> Schedule a Consultation

## Site Tone

Warm, confident, professional, Southern, trustworthy, polished, not cheap, not ultra luxury.

Avoid sounding like a giant corporation or a one-man handyman.

## Deploy Steps (Cloudflare Pages)

Use these steps to deploy the current repository:

1. Confirm code is pushed to GitHub:
	- Repo: `https://github.com/JWeibezahl/southern-cypress-website`
2. Sign in to Cloudflare and go to `Workers & Pages`.
3. Click `Create application` -> `Pages` -> `Connect to Git`.
4. Select GitHub and authorize Cloudflare if prompted.
5. Choose repository: `JWeibezahl/southern-cypress-website`.
6. Configure build settings:
	- Framework preset: `None`
	- Build command: leave blank
	- Build output directory: `/`
	- Root directory: leave blank
7. Click `Save and Deploy`.
8. After deployment completes, open the generated `*.pages.dev` URL and verify:
	- Navigation links work
	- Header logo and footer logo load
	- Mobile menu works
	- Contact page renders correctly

## Connect Custom Domain

1. In Cloudflare Pages project, open `Custom domains`.
2. Click `Set up a custom domain`.
3. Enter `southerncypresshomes.com` (and `www.southerncypresshomes.com` if desired).
4. Follow Cloudflare DNS prompts to add or confirm records.
5. Wait for SSL status to become active.

## Ongoing Updates

After future edits, deploy updates by pushing to `main`:

```bash
git add .
git commit -m "Update site content"
git push origin main
```

Cloudflare Pages will auto-deploy each push.
