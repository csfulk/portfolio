
# 👋 Hi, I’m Colt — Design Systems Architect, Interface Optimist, and Recovering Pixel Addict

I once rebuilt the engine of a 1985 Toyota pickup with a borrowed wrench set and a lot of misplaced confidence. These days, I channel that same stubborn optimism into building scalable design systems with Figma, React, and just enough CSS variables to keep things interesting.

At YouTube, I led the design of the TV app interface — work that helped make it Nielsen’s #1 app for viewtime. It wasn’t about flashy features; it was about building a system that could scale across devices, regions, and teams without falling apart under the weight of its own complexity. Design systems: glamorous stuff.

Later, in Zurich, I helped Google Europe break up with Sketch and transition to Figma. It was a clean break. I partnered with Figma directly, ran trainings across disciplines, and migrated libraries with enough care to make a Swiss train conductor proud.


These days, I’m focused on building a portfolio that reflects my approach: modular, expressive, slightly over-engineered (but in a good way). It features animated transitions, modular case study viewers, and a carefully managed sense of humor.

---


---


## 📁 Case Study Viewer Architecture

### 🖼️ FigmaEmbedViewer.jsx
`src/components/FigmaEmbedViewer.jsx` is a modular React component for displaying a Figma embed in a modal overlay. It supports:
- Fade-in animation on open
- Cropping of the Figma bottom bar for a clean look
- Always-visible close button (top right)
- Keyboard accessibility (Escape closes modal if iframe is not focused)

**Props:**
- `embedUrl` (string): The Figma embed URL to display
- `onClose` (function): Callback to close the modal

### 🖼️ FeaturedProjectViewer (projectViewer.jsx)
`src/components/projectViewer.jsx` exports `FeaturedProjectViewer`, a React component for image gallery case studies. It supports:
- Image carousel with left/right navigation
- Keyboard navigation (←/→ arrows, R to reset)
- Fade-in animation
- Always-visible close button
- Focus trap for accessibility

**Props:**
- `title` (string): Optional title for the gallery
- `images` (array): Array of image URLs to display
- `onClose` (function): Callback to close the modal

---


## ➕ Adding Case Study Buttons

All case study buttons are defined in `src/components/caseStudyButtons.js`.

**To add a new button:**
1. Find the section key (`youtube`, `apple`, `figma`, etc.) in `caseStudyButtons`.
2. Add a new object to the array with the following fields:
   - `text`: Button label
   - `icon`: Icon class (e.g., 'icon-Lock_light')
   - `action`: Viewer config object:
     - For Figma embeds: `{ type: 'FigmaEmbedViewer', embedUrl: 'YOUR_FIGMA_EMBED_URL' }`
     - For image galleries: `{ type: 'FeaturedProjectViewer', caseStudyKey: 'YOUR_CASE_STUDY_KEY' }`

**Example:**
```js
// In src/components/caseStudyButtons.js
caseStudyButtons.youtube.push({
  text: 'Case Study 4',
  icon: 'icon-Lock_light',
  action: {
    type: 'FigmaEmbedViewer',
    embedUrl: 'https://embed.figma.com/deck/your-new-url'
  }
});
```

**No need to update multiple files!** The UI will automatically use the new button.

---

Check the case studies for serious work.  
Or reach out for design therapy, war stories, and font pairing advice.

---

## 🔒 Password Gate (optional)

To require a password before opening case study viewers:

Local testing
- Edit your local .env (gitignored):
  - VITE_PASSWORD_GATE_ENABLED=true
  - VITE_SITE_PASSWORD=your-strong-password
- Restart the dev server after changes (npm run dev).

Production (e.g., Netlify)
- In the host’s environment settings, add the same vars:
  - VITE_PASSWORD_GATE_ENABLED=true
  - VITE_SITE_PASSWORD=your-strong-password
- Trigger a rebuild/redeploy for the new vars to take effect.

Notes
- Keep real secrets out of git; share variable names via a .env.example if needed.
