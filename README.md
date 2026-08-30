# Jaju's Mart — final expanded store

This version keeps the existing storefront structure, restores wishlist buttons, uses real product photography URLs, adds 30 products, creates individual product pages, and adds server-side pricing/offer control plus persistent orders.

## Run
`cd backend`
`npm install`
copy `.env.example` to `.env`
set `ADMIN_TOKEN`
add Razorpay TEST keys if online payments are needed
`npm start`

Open `http://localhost:3000/index.html`.

## Control prices and offers
Open `http://localhost:3000/admin.html`.
Enter the ADMIN_TOKEN.
Change the price or offer % and press Save.

The storefront calculates the customer price from the server-side catalog, so the displayed offer and checkout price stay synchronized.

## View orders
Open `http://localhost:3000/admin-orders.html`.
Enter ADMIN_TOKEN.
Orders are stored in `backend/data/orders.json`.

## Important
Do not open the store with `file:///...`; run the Node server. Keep ADMIN_TOKEN and Razorpay secret keys private. For production, use HTTPS, a real database/backups, proper admin authentication, and Razorpay webhooks/reconciliation.
