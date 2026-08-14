# Aurora — Premium Glassmorphism Theme for Pterodactyl 1.x

A dark, premium, futuristic game-hosting dashboard theme for the **Pterodactyl Panel 1.x (current stable)**. Built with glassmorphism, purple-blue gradients, rounded corners and tasteful glow effects — while preserving 100% of Pterodactyl's functionality.

> Compatible with: Pterodactyl **1.x** (AdminLTE 3 markup). Not for Pterodactyl 2.x.

---

## Features

- 🎨 **Dark gaming aesthetic** — deep black/dark-gray background with subtle purple & blue radial glows
- 🪟 **Glassmorphism cards** — semi-transparent surfaces, backdrop blur, rounded corners, thin borders
- 📊 **Redesigned dashboard** — Server Status, CPU, RAM, Storage, Network, Console & server controls all styled
- 💜 **Purple-blue gradients** on buttons, active sidebar items, progress bars and badges
- ✨ **Glow effects** — animated pulsing status indicator, glowing icon boxes, hover lifts
- 🖥️ **Styled console/terminal** — monospace font, dark glass, preserved cursor
- 📱 **Fully responsive** — desktop, tablet, mobile
- 🔒 **Non-breaking** — pure CSS/HTML injection via the panel's built-in Theme settings; no core files touched
- ♿ **Accessible** — respects `prefers-reduced-motion`

## Installation

### 1. Panel Theme Settings (recommended)

1. Log in to your Pterodactyl panel as an **admin**.
2. Go to **Admin Panel → Settings → Theme**.
3. **Copy the entire contents** of [`aurora/custom.css`](aurora/custom.css) into the **Custom CSS** box.
4. **Copy the entire contents** of [`aurora/custom.html`](aurora/custom.html) into the **Custom HTML** box *(enables fonts, animated background orbs & polish)*.
5. Click **Save** and hard-refresh (`Ctrl+Shift+R`).

Done — the theme applies instantly, no rebuild or restart needed.

### 2. Manual drop-in (alternative)

If you prefer a filesystem install, copy the two files over the panel's template output:

```bash
# From the panel root directory:
mkdir -p resources/views/admin/settings
# Then place the contents of custom.css / custom.html as described in step 1 via the admin UI instead.
```

> **Note:** The Theme-settings method is strongly preferred — it survives panel updates and never breaks core functionality.

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

Open an issue in this repository. To keep updates conflict-free, prefer the panel's built-in Theme settings over editing core files.
