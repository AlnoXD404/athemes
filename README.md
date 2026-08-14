# Aurora — Premium Glassmorphism Theme for Pterodactyl 1.x

A dark, premium, futuristic game-hosting dashboard theme for the **Pterodactyl Panel 1.x (current stable)**. Built with glassmorphism, purple-blue gradients, rounded corners and tasteful glow effects — while preserving 100% of Pterodactyl's functionality.

> Compatible with: Pterodactyl **1.x** (AdminLTE admin panel + React/Tailwind client UI). Not for Pterodactyl 0.7.x or 2.x.

---

## Features

- 🎨 **Dark gaming aesthetic** — deep black/dark-gray background with subtle purple & blue radial glows
- 🪟 **Glassmorphism cards** — semi-transparent surfaces, backdrop blur, rounded corners, thin borders
- 📊 **Redesigned dashboard** — Server Status, CPU, RAM, Disk, Network, Console & server controls all styled
- 💜 **Purple-blue gradients** on buttons, active sidebar items, stat blocks, progress bars and badges
- ✨ **Glow effects** — glowing icon boxes, hover lifts, pulsing status indicators
- 🖥️ **Styled console/terminal** — monospace font, dark glass, glowing cursor
- 📱 **Fully responsive** — desktop, tablet, mobile
- 🔒 **Non-breaking** — pure CSS injection; all Pterodactyl features intact

## Installation

> **Important:** Pterodactyl 1.x has **no "Theme" settings page** (the Custom CSS/HTML boxes were removed with Pterodactyl 0.7). The theme is injected by adding a `<link>` to the two layout files below.

### Step 1 — Upload the CSS

SSH into your panel server and place the stylesheet where the panel can serve it:

```bash
cd /var/www/pterodactyl
```

Upload `aurora/custom.css` to `public/themes/pterodactyl/css/aurora.css`:

```bash
# from your local machine:
scp aurora/custom.css root@YOUR_SERVER:/var/www/pterodactyl/public/themes/pterodactyl/css/aurora.css
```

### Step 2 — Load the CSS in both layouts

**Client UI** (dashboard, console, files — the React app). Edit:

```bash
nano /var/www/pterodactyl/resources/views/templates/wrapper.blade.php
```

Inside the `<head>`, right before `</head>`, add:

```html
<link rel="stylesheet" href="/themes/pterodactyl/css/aurora.css">
```

**Admin UI** (admin panel — AdminLTE). Edit:

```bash
nano /var/www/pterodactyl/resources/views/layouts/admin.blade.php
```

Add the same line right before `</head>`:

```html
<link rel="stylesheet" href="/themes/pterodactyl/css/aurora.css">
```

### Step 3 (optional) — Background orbs & fonts

Open the client layout again and paste the **entire contents of `aurora/custom.html`** right before `</body>` in `resources/views/templates/wrapper.blade.php`. This adds the animated glow orbs, premium fonts and small UI polish. (Skip this if you only want the flat glass styling.)

### Step 4 — Clear the view cache & reload

```bash
cd /var/www/pterodactyl
php artisan view:clear
```

Then hard-refresh your browser (`Ctrl+Shift+R`).

> **Note:** Editing `resources/views/...` files will be overwritten when you update the panel. Re-apply the `<link>` lines after each panel update. The CSS file itself in `public/` survives updates.

## Customization

All colors are defined as CSS variables at the top of `aurora/custom.css`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `--aurora-purple` | `#8b5cf6` | Primary purple accent |
| `--aurora-blue` | `#3b82f6` | Primary blue accent |
| `--aurora-cyan` | `#22d3ee` | Secondary highlight |
| `--aurora-gradient` | purple → blue | Buttons, active items, progress |
| `--aurora-bg` | `#08080d` | Page background |

Edit any variable to instantly re-theme the whole panel.

## Screenshots

_Add screenshots here by running the theme on a live panel and dropping images into the repo._

## Support

Open an issue in this repository.