# Keepsoft live demos

Free live demos for five WordPress plugins (QuoteFlow, QuoteSign, ProfitLens, PrintPilot, AccessFix) plus a static demo for the TradePro HTML template and a screenshot page for the Proposal Pro PowerPoint template. Everything is plain files. It costs nothing to host on GitHub Pages and needs no build step.

## Put it online in 5 steps (GitHub Pages)

1. **Create the repository.** Sign in at github.com, click **New repository**, name it exactly `keepsoft-demos`, keep it **Public**, and click **Create repository**.
2. **Upload the files.** On the new empty repository page click **uploading an existing file**. Open this folder on your computer, select everything *inside* it (not the folder itself) and drag it into the browser. Include the hidden file `.nojekyll` if your computer shows it. Click **Commit changes**. (If the browser refuses a big upload, upload in two or three batches. The largest file is about 110 KB per plugin zip, so this is rarely a problem.)
3. **Open Settings.** In the repository click **Settings**, then **Pages** in the left menu.
4. **Turn Pages on.** Under **Build and deployment** set **Source** to **Deploy from a branch**, set **Branch** to **main** and the folder to **/ (root)**, then click **Save**.
5. **Get your address.** Wait about a minute and refresh the Pages screen. It shows `https://YOUR-USERNAME.github.io/keepsoft-demos/`. Open it and click a demo.

Nothing needs editing for the links to work. The pages work out their own address.

## URLs to paste into Envato's "Live preview URL"

Replace `YOUR-USERNAME` with your GitHub username.

| Item | Live preview URL |
|---|---|
| QuoteFlow | `https://YOUR-USERNAME.github.io/keepsoft-demos/demo/quoteflow.html` |
| QuoteSign | `https://YOUR-USERNAME.github.io/keepsoft-demos/demo/quotesign.html` |
| ProfitLens | `https://YOUR-USERNAME.github.io/keepsoft-demos/demo/profitlens.html` |
| PrintPilot | `https://YOUR-USERNAME.github.io/keepsoft-demos/demo/printpilot.html` |
| AccessFix | `https://YOUR-USERNAME.github.io/keepsoft-demos/demo/accessfix.html` |
| TradePro (HTML template) | `https://YOUR-USERNAME.github.io/keepsoft-demos/tradepro/index.html` (or `demo/tradepro.html`) |
| Proposal Pro (PowerPoint) | `https://YOUR-USERNAME.github.io/keepsoft-demos/proposalpro/index.html` (or `demo/proposalpro.html`) |

Landing page for all products: `https://YOUR-USERNAME.github.io/keepsoft-demos/`

Each plugin link shows a short "Loading the demo" page for 2 seconds and then opens the demo on WordPress Playground (playground.wordpress.net). Envato reviewers and buyers see a real WordPress admin, already logged in, filled with Australian sample data.

Expected first-load times (a fresh WordPress is built inside the visitor's browser each time): QuoteFlow and AccessFix about 30 seconds, QuoteSign and PrintPilot about a minute, ProfitLens 1 to 2 minutes. Slow connections and phones take longer. Tell Envato reviewers this in the item's preview notes.

## After Envato approves each item

Open `config.js` in the repository (pencil icon), replace each `https://codecanyon.net/user/keepsoft` with the real item page, and commit. This updates the "Buy" buttons on the landing page and inside every demo.

## What is in this folder

| Path | What it is |
|---|---|
| `index.html`, `css/`, `config.js` | Landing page and its settings |
| `demo/*.html` | Short, stable demo links with the loading screen |
| `js/launch.js` | Builds the Playground blueprint in the browser and opens it |
| `blueprints/*.json` | The Playground recipe for each plugin (install, seed data, log in, landing screen) |
| `plugins/*.zip` | The plugin zips Playground installs (copies of the Envato downloads) |
| `seeds/*.php` | The sample-data scripts that the blueprints run (readable source) |
| `mu/keepsoft-demo.php` | Demo-only helper: the "throwaway demo" notice, hides update nags, links to Buy |
| `demo-assets/` | Product images used by the QuoteSign demo |
| `tradepro/` | The TradePro static site |
| `proposalpro/` | Proposal Pro preview screenshots |
| `tools/` | Optional. Only used by a developer to regenerate pages and blueprints |

## How it works (short version)

When someone opens `demo/quotesign.html`, the page downloads `blueprints/quotesign.json`, replaces the placeholders `__BASE__` (your site's address) and `__BUY__` (the Buy link) and sends the finished blueprint to WordPress Playground inside the link itself. Playground then installs WooCommerce from wordpress.org, installs the plugin from `plugins/quotesign.zip`, runs the seed script, logs in as admin and opens the plugin's main screen. GitHub Pages already allows the cross-site download Playground needs.

## Things worth knowing

- **Updating a plugin:** when you release a new version, replace the zip in `plugins/` (same file name). The demos pick it up straight away.
- **Everything is reset on every visit.** Visitors cannot break anything and nothing is stored.
- **WooCommerce comes from wordpress.org** at the moment of the demo, so the demo always uses the current release. If a future WooCommerce release breaks a demo, tell a developer to pin a version in `tools/make-blueprints.js`.
- **AccessFix scans:** a site inside Playground cannot reliably request its own pages, so the demo includes a small helper that hands the scanner each page directly. The scanner and the fixers are the real plugin code. See `mu/keepsoft-demo.php`.
- **PrintPilot:** there is no physical printer in a browser demo. The print log is pre-filled and Print Station opens, but nothing is sent to a printer.
- **Use a desktop browser** for the best result. Playground works in current Chrome, Edge, Firefox and Safari.
- **Editing the demo content:** change a file in `seeds/`, then ask a developer to run `node tools/make-blueprints.js`, or edit the matching `blueprints/*.json` directly.
