# athemes Theme

athemes is a free and open source **fork of the Pterodactyl panel** with a premium dark glassmorphism theme. It keeps 100% of Pterodactyl's functionality while adding a modern, futuristic game-hosting dashboard aesthetic: purple-blue gradients, glass cards, glow effects, and a redesigned server dashboard.

> Based on Pterodactyl **v1.15.0**. Not for Pterodactyl 0.7.x or 2.x.

Preview on Discord : https://discord.gg/k5bue2kesg

## Features

- 🎨 **Dark gaming aesthetic** — deep black/dark-gray background with subtle purple & blue radial glows
- 🪟 **Glassmorphism cards** — semi-transparent surfaces, backdrop blur, rounded corners, thin borders
- 📊 **Redesigned dashboard** — Server Status, CPU, RAM, Disk, Network, Console & server controls all styled
- 💜 **Purple-blue gradients** on buttons, active sidebar items, stat blocks, progress bars and badges
- ✨ **Glow effects** — glowing icon boxes, hover lifts, pulsing status indicators
- 🖥️ **Styled console/terminal** — custom xterm palette, monospace font, glowing cursor
- 📱 **Fully responsive** — desktop, tablet, mobile
- 🔒 **Non-breaking** — all Pterodactyl features intact

## Screenshots

_Add screenshots here._

## Installation

This will update your panel to the latest version of the athemes theme fork. The theme is baked directly into the panel source, so it applies to both the client UI and the admin UI automatically.

### Enter Maintenance Mode

Whenever you are performing an update you should place your Panel into maintenance mode:

```bash
cd /var/www/pterodactyl
php artisan down
```

### Download the theme

```bash
curl -L https://github.com/AlnoXD404/athemes/releases/latest/download/panel.tar.gz | tar -xzv
```

Once all of the files are downloaded, set the correct permissions on the cache and storage directories:

```bash
chmod -R 755 storage/* bootstrap/cache
```

### Update Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

### Build the frontend

athemes re-themes the panel's React frontend. Build the new assets:

```bash
yarn install --frozen-lockfile
yarn build:production
```

### Clear Compiled Template Cache

```bash
php artisan view:clear
php artisan config:clear
```

### Database Updates

```bash
php artisan migrate --seed --force
```

### Set Permissions

Set the proper owner of the files to the user that runs your webserver (usually `www-data`):

```bash
# If using NGINX or Apache (not on CentOS):
chown -R www-data:www-data /var/www/pterodactyl/*

# If using NGINX on CentOS:
chown -R nginx:nginx /var/www/pterodactyl/*

# If using Apache on CentOS:
chown -R apache:apache /var/www/pterodactyl/*
```

### Restart Queue Workers

After every update you should restart the queue worker:

```bash
php artisan queue:restart
```

### Exit Maintenance Mode

```bash
php artisan up
```

## Building from source

If you want to build the release tarball yourself:

```bash
git clone https://github.com/AlnoXD404/athemes.git
cd athemes
yarn install --frozen-lockfile
./release.sh
```

Artifacts are written to `./release/panel.tar.gz`.

## Customization

The main theme colors are defined in two places:

| Where | What |
| --- | --- |
| `public/themes/pterodactyl/css/aurora.css` (CSS variables) | All glass surfaces, glows, admin UI |
| `tailwind.config.js` + `resources/scripts/...` | Client (React) palette & component styling |

Key variables at the top of `aurora.css`:

| Variable | Default |
| --- | --- |
| `--aurora-purple` | `#8b5cf6` |
| `--aurora-blue` | `#3b82f6` |
| `--aurora-cyan` | `#22d3ee` |
| `--aurora-gradient` | purple → blue |
| `--aurora-bg` | `#08080d` |

Edit them to instantly re-theme the whole panel.

## Documentation

- [Panel Documentation](https://pterodactyl.io/panel/1.0/getting_started.html)
- [Wings Documentation](https://pterodactyl.io/wings/1.0/installing.html)

## License

Pterodactyl® Copyright © 2015 - 2024 Dane Everitt and contributors.

Pterodactyl code released under the [MIT License](LICENSE.md).

athemes theme edits released under the MIT License — see [LICENSE.md](LICENSE.md).

_Not affiliated with Pterodactyl® Panel or its contributors._
