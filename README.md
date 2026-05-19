# MoveOut Sale

A personal clearance sale storefront built with Next.js. Buyers browse listings, view photos/videos in a gallery, and contact the seller directly via WhatsApp.

---

## Live Site

> [ MoveOut. ](https://moveout-sale.vercel.app/)

---

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- Deployed on Vercel

---

## Project Structure

```
app/
└── page.tsx        ← All listings data and UI live here

public/             ← Static assets (favicon, icons)
components/ui/      ← shadcn/ui components
```

Everything is in `app/page.tsx`. There is no database, no backend, no auth.

---

## Adding or Editing Listings

Open `app/page.tsx` and find the `LISTINGS` array near the top. Each listing looks like this:

```ts
{
  id: 1,
  title: "Item Name",
  category: "Furniture",
  price: "$40",
  description: "Full description shown in the popup.",
  payment: "Cash or Zelle. Pickup only from Jamaica Plain.",
  media: [
    { type: "image", url: "https://..." },
    { type: "video", url: "https://..." },
  ],
  sold: false,
}
```

### Media types

| Type | Usage |
|------|-------|
| `image` | Direct image URL |
| `video` | Direct `.mp4` URL (GitHub raw or hosted) |
| `youtube` | YouTube or youtu.be link |
| `emoji` | Placeholder when no photo is available yet |

### Using images/videos from this repo

1. Upload your file to this GitHub repo (e.g. under `public/images/` or `public/videos/`)
2. Click the file on GitHub → click **Raw** → copy the URL from your browser's address bar
3. Paste it as the `url` value

```ts
{ type: "image", url: "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/public/images/photo.jpg" }
{ type: "video", url: "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/public/videos/clip.mp4" }
```

> **Note:** For large videos (over ~20MB), YouTube (unlisted) loads much faster than GitHub raw URLs.

### Using Facebook images

1. Open the photo on Facebook
2. Right-click → **Copy image address**
3. Paste as the `url` — Facebook CDN URLs work directly

### Marking an item as sold

```ts
sold: true
```

The card will grey out automatically and show a "Sold" badge.

---

## WhatsApp Number

The seller's number is set once at the top of `page.tsx`:

```ts
const WHATSAPP_NUMBER = "918805799434"
```

Change this if the number ever changes. No other file needs to be updated.

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import this GitHub repo
4. Leave all settings as default — Vercel detects Next.js automatically
5. Click **Deploy**

Every time you push a change to the `main` branch, Vercel redeploys automatically.

---

## Common Tasks

**Add a new listing** → append a new object to the `LISTINGS` array in `page.tsx` with a unique `id`

**Add more photos to an existing listing** → add more `{ type: "image", url: "..." }` entries to that listing's `media` array; they'll appear in the gallery carousel

**Change a price** → update the `price` field in the relevant listing

**Remove a listing** → delete its object from the `LISTINGS` array, or set `sold: true` to keep it visible but marked as unavailable
