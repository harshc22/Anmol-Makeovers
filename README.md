# Anmol Makeovers

## Overview

**Anmol Makeup Site** is a modern, responsive portfolio application for makeup and beauty services. I built it as a full‑stack Next.js project to demonstrate product thinking, UX craft, and production‑ready engineering. The app pairs a polished frontend with server‑side API routes for real user interactions (requests, pricing, and notifications).

## Problem & Approach

Professionals often need more than a static brochure site. They need a way for visitors to request quotes, get responses, and for the business to track and refine pricing over time. I approached this as a product:

- **Visitor workflow:** browse services, submit a quote/request with details.
- **Business workflow:** receive an email for each request, store the request and associated pricing data, and keep a history to inform future pricing.

## Why This Project Matters

- **Real Product Thinking:** Goes beyond a static site, supports an actual business workflow.
- **Cost-aware engineering:** Designed to run effectively on Supabase’s free tier by offloading heavy/static workloads (image hosting) while still delivering a full production-like workflow.
- **Scalable by design:** The architecture separates UI, API routes, and data storage, so features like authentication, dashboards, or analytics can be layered in without disrupting existing flows.
- **Production‑Ready Patterns:** TypeScript, linting, route structure, and separation of concerns for long‑term maintainability.

## Backend Highlights

- **Secure Server Handlers:** Validates input and protects secrets by running on the server (not the browser).
- **Supabase Integration:** Used Supabase as the backend for persisting requests and pricing data in structured tables, ensuring a reliable, queryable history.
- **Email Workflow:** Each new request is stored in Supabase and triggers a notification email, allowing the business to respond quickly.
- **Efficient Asset Handling:** Leveraged Supabase public buckets to serve portfolio images directly from storage, reducing server compute and improving page load speed, a pragmatic choice for the free tier.

## Frontend Highlights

- **Next.js + React + TypeScript:** Fast, SEO‑friendly pages with strong type safety and a maintainable component system.
- **Responsive UI:** Thoughtful layouts and media handling that look great on mobile and desktop.
- **Modern Styling:** Utility‑first CSS (Tailwind) and PostCSS enable clean, consistent visuals.
- **Rich Interactions:** Image galleries/sliders (Swiper) and smooth transitions to make the portfolio feel premium.

## What I Learned

- Designing for both **UX polish** and **operational needs** (notifications, data capture).
- Implementing **server‑side logic** within a Next.js codebase using the App Router’s API routes.
- Managing **typed contracts** between client and server with TypeScript.
