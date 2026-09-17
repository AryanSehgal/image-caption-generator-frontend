# Image Caption Generator — Frontend

A React + TypeScript single-page app that lets users upload a photo and receive an AI-generated caption in real time, powered by a custom-trained image captioning model.

**Live App:** https://image-caption-generator-frontend.vercel.app/
**API it connects to:** https://image-caption-generator-backend.onrender.com

## Related Repositories

| Repo | Description |
|---|---|
| [image-caption-generator-backend](https://github.com/AryanSehgal/image-caption-generator-backend) | Flask API that this frontend calls to generate captions |
| [image-captioning-case-study](https://github.com/AryanSehgal/image-captioning-case-study) | Jupyter notebook used to train the underlying caption model on the Flickr8k dataset |

## Overview

This app is the client-facing half of a two-part deployment: a decoupled frontend (this repo) and a Flask/TensorFlow backend (linked above) communicating over a REST API. This mirrors a common industry pattern — separating a lightweight, fast-deploying UI layer from a heavier ML backend, each independently deployed and scaled.

## Features

- Drag-and-drop or click-to-browse image upload
- One-click sample images for quick demoing without needing a test file on hand
- Live preview of the selected image before submitting
- Loading state with context (flags Render's free-tier cold-start delay to the user)
- Responsive layout — stacks vertically on mobile, side-by-side image/controls layout on wider screens
- Clear inline error handling (e.g., wrong file type, server errors)

## Tech Stack

- **React 18 + TypeScript** — component logic with static typing
- **Vite** — build tooling and dev server
- **Plain CSS** (`App.css`) — no framework dependency, custom playful/colorful visual design
- **Deployment:** Vercel (static hosting, auto-deploys on push to `main`)

## Project Structure

```
├── src/
│   ├── App.tsx          # Main component: upload logic, API calls, UI state
│   ├── App.css           # All custom styling
│   └── index.css         # Global resets
├── public/
│   └── samples/           # Bundled sample images for one-click demo captions
├── .env                   # VITE_API_URL (not committed — see below)
└── vite.config.ts
```

## Running Locally

```bash
git clone https://github.com/AryanSehgal/image-caption-generator-frontend.git
cd image-caption-generator-frontend
npm install
```

Create a `.env` file in the project root:
```
VITE_API_URL=https://image-caption-generator-backend.onrender.com
```
(Or point it at a locally-running backend, e.g. `http://localhost:5000`, if you're also running the [backend](https://github.com/AryanSehgal/image-caption-generator-backend) locally.)

```bash
npm run dev
```

## How It Works

1. User selects/drops a JPEG image, or picks one of the bundled sample images
2. On submit, the image is sent as `multipart/form-data` to the backend's `POST /caption` endpoint
3. The backend uploads the image to Cloudinary, runs it through the ResNet50 → LSTM captioning pipeline, and returns `{ image, caption }` as JSON
4. The app displays the returned (Cloudinary-hosted) image alongside its generated caption

## Deployment

Deployed on **Vercel**, connected directly to this GitHub repo — every push to `main` triggers an automatic rebuild and redeploy. The backend API URL is configured via the `VITE_API_URL` environment variable in Vercel's project settings rather than committed to the repo.

## Known Limitations

This UI is intentionally restricted to **JPEG uploads**, and the interface tells users the app **works best with photos of people, dogs, and everyday outdoor scenes**. This isn't a frontend limitation — it reflects a real characteristic of the backend's captioning model, which was trained on the Flickr8k dataset (a small, domain-limited dataset dominated by exactly those categories). See the [backend README](https://github.com/AryanSehgal/image-caption-generator-backend) and [training notebook repo](https://github.com/AryanSehgal/image-captioning-case-study) for the full explanation.

## Credits

Built by **Aryan Sehgal** as the deployment and frontend layer for an image captioning model originally developed by **Apoorv Garg**.
