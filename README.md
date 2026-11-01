# dsaflo

A beautifully designed, production-ready Data Structures and Algorithms practice tracker.
Built entirely with Next.js App Router, Tailwind CSS, Shadcn UI (Custom), Zustand, and Framer Motion. 

This tracker uses the curriculum provided by Kunal Kushwaha, parsed directly from his open-source GitHub repository.

## Features

- 🚀 **100% Free**: No backend costs. Uses LocalStorage to persist progress.
- 🎨 **Beautiful UI**: Modern SaaS-like aesthetic with smooth Framer Motion animations.
- 🌓 **Dark & Light Mode**: Adapts dynamically based on system preferences.
- 📱 **Mobile Optimized**: Full responsive design with mobile drawer navigation.
- 📊 **Dashboard Analytics**: Track your completion percentage, solved count, and important queues.
- 🔖 **Bookmarks & Revision**: Mark difficult problems for later review.
- 💾 **Data Management**: Export and Import your JSON progress file anytime to move between devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with LocalStorage Persistence
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Deployment Guide (Vercel Free Tier)

This app is optimized for Vercel and costs absolutely nothing to run.

1. Create a GitHub repository and push this code.
2. Go to [Vercel](https://vercel.com/) and Sign In.
3. Click **Add New** -> **Project**.
4. Import your GitHub repository.
5. Vercel will automatically detect Next.js.
6. Leave the Build Command and Install Command as default.
7. Click **Deploy**.

*Note: Since there is no database connected (only LocalStorage is used), you don't need any environment variables.*

## Local Development

To run this app locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Data Source
The problems are automatically extracted from Kunal Kushwaha's [DSA-Bootcamp-Java](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java) assignments.
