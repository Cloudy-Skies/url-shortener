# URL Shortener

A small learning project built with Next.js that turns long URLs into short, shareable links using the Bitly API.

This app began as a tutorial-following exercise and then grew into a debugging and refinement project. Along the way, I improved the original implementation by moving the Bitly token to the server, adding better request handling, and designing a more intentional loading and success experience.

## Project Origin

This project was created by following:

[Building a Url Shortener App with Next.js](https://asharibali.medium.com/building-a-url-shortener-app-with-next-js-887d57b493fe) by Asharib Ali on Medium.

The tutorial covers the core idea:

- enter a long URL
- shorten it with Bitly
- display the short link
- copy it to the clipboard

This version keeps that foundation, but also includes a few practical improvements made during the learning process.

## What This Project Does

- Accepts a long URL from the user
- Sends it to a server-side route in the app
- Calls the Bitly API securely from the server
- Returns a short URL to the client
- Lets the user copy the generated link
- Shows a custom visual cue while the request is being processed
- Highlights success with a subtle animated reveal

## Why The Implementation Changed

The original tutorial version called Bitly directly from the client with a public environment variable. That is okay for learning structure, but not ideal for a real project because API tokens should not be exposed in browser code.

This version improves that flow by:

- storing the Bitly token on the server with `BITLY_ACCESS_TOKEN`
- using `app/api/shorten/route.ts` as a server-side boundary
- keeping the client focused on UI and form state
- returning clearer error messages when something goes wrong

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui primitives
- Bitly API

## Project Structure

```text
app/
  api/
    shorten/
      route.ts        # Server route that talks to Bitly
  globals.css         # Global styles and custom motion
  layout.tsx
  page.tsx            # Renders the main shortener component

components/
  ui/
    button.tsx
    input.tsx
  url-shortener.tsx   # Main client UI and interaction logic
```

## What I Learned

- how client and server responsibilities differ in a Next.js app
- why secrets should stay out of client-side environment variables
- how to use route handlers in the App Router
- how to manage loading, error, and success states in React
- how small motion details can make feedback feel more human
- how to debug third-party API integrations instead of only copying a tutorial

## Running The Project Locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root:

```bash
BITLY_ACCESS_TOKEN=your_bitly_token_here
```

3. Start the development server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

This project expects:

```bash
BITLY_ACCESS_TOKEN=your_bitly_token_here
```

Important:

- use `BITLY_ACCESS_TOKEN`, not `NEXT_PUBLIC_BITLY_ACCESS_TOKEN`
- `NEXT_PUBLIC_*` variables are exposed to the browser
- if you change `.env.local`, restart the dev server

## Current UX Notes

Instead of using a generic spinner, this version uses a simple animated status rail during requests and a soft success reveal when a short link is returned. The goal was to keep the interface minimal while still making the app feel responsive and alive.

## Possible Future Improvements

- replace the copy `alert()` with an inline confirmation message
- add URL history for recently shortened links
- support custom aliases if Bitly/account settings allow it
- add tests for the route handler and UI states
- deploy the app and document production setup

## Acknowledgements

Thanks to Asharib Ali for the original tutorial and starter idea. This repository reflects both the tutorial foundation and the debugging, iteration, and design decisions made while learning from it.
