# Swoop Window Cleaning — Website

A complete, from-scratch redesign of the Swoop Window Cleaning site: residential
window cleaning in the Phoenix Valley, Arizona.

Built with vanilla HTML, CSS and JavaScript — no framework, no build step, no
external APIs.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Entry point — all page sections, semantic markup, meta + JSON-LD |
| `styles.css` | Design system, layout, responsive rules, animations |
| `script.js` | Mobile nav, sticky header, scroll reveal, quote-form validation |

## Sections

- **Hero** — business name, tagline and primary calls to action
- **Why Choose Us** — the five service promises
- **Swoop Services** — exterior windows, interior windows, screens, tracks
- **What We Actually Clean** — the three passes of a standard visit
- **About** — the founders and the story behind the company
- **Contact** — phone, email, service area, social links and a quote form

## Contact details used

- Phone: 602-603-5560
- Email: hello@swoopwindowcleaning.com
- Service area: the Phoenix Valley, Arizona
- Instagram: https://www.instagram.com/swoopwindowcleaning
- Facebook: https://www.facebook.com/share/1HNaVkiWNt/?mibextid=wwXIfr

## Imagery

Authentic company photography is preserved: the eagle logo, the "Swoop Services"
and "Built With Purpose" wordmarks, the technician cleaning a home's exterior
windows, the squeegee-on-glass shot, and the founders' photo.

The previous site's hero image was a generic stock photo (a squeegee on soapy
glass against a blue sky) that did not show this business, so it was dropped in
favour of the company's own photography. The three supporting photos in the
"What we actually clean" section are licensed Pexels photography chosen to match
each specific step of the job.

## Accessibility & performance

- Semantic landmarks, skip link, visible focus states, labelled form fields
- Descriptive alt text on every image
- `prefers-reduced-motion` support
- Lazy loading on below-the-fold imagery
- Responsive from 320px up
