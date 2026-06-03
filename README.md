# ShopSmart QA Automation Portfolio

ShopSmart is a recruiter-friendly QA automation portfolio project built as a real full-stack e-commerce app. It uses an Express backend, PostgreSQL database tables, a polished HTML/CSS/JavaScript frontend, and Playwright automated tests.

## Features

- Login and logout with seeded QA user credentials
- Product catalog loaded from PostgreSQL
- Shopify-style product page with hero, carousel, and product cards
- Database-backed cart with add, update quantity, remove, and clear behavior
- Checkout flow that creates orders and order items
- Backend validation for login, products, cart, and checkout
- Playwright UI tests for login, product/cart, and checkout flows
- Manual test case and sample bug report documentation

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- HTML
- CSS
- JavaScript
- Playwright

## Backend Architecture

The backend follows a model/router structure:

- `services/app.js` configures Express, static frontend hosting, API routes, and error handling.
- `models/db.js` creates the PostgreSQL pool.
- `models/*.model.js` files contain async PostgreSQL queries using `pool.query`.
- `routers/*.router.js` files import model functions and handle request validation, status codes, and error responses.
- `configs/createSchema.js` creates the database tables.
- `configs/initData.js` seeds the user and product data.

## Database Schema

`Users`: `id`, `username`, `password`, `full_name`, `email`, `created_at`

`Products`: `id`, `name`, `description`, `category`, `price`, `image_url`, `stock`, `created_at`

`CartItems`: `id`, `user_id`, `product_id`, `quantity`, `created_at`

`Orders`: `id`, `user_id`, `first_name`, `last_name`, `postal_code`, `total_amount`, `status`, `created_at`

`OrderItems`: `id`, `order_id`, `product_id`, `quantity`, `price_at_purchase`

## API Routes

User routes:

- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/:id`

Product routes:

- `GET /api/products`
- `GET /api/products/:id`

Cart routes:

- `GET /api/cart/:userId`
- `POST /api/cart`
- `PATCH /api/cart/:id`
- `DELETE /api/cart/:id`
- `DELETE /api/cart/user/:userId`

Order routes:

- `POST /api/orders`
- `GET /api/orders/:userId`

## PostgreSQL Setup

Create a local PostgreSQL database named `shopsmart_qa`.

Example using `psql`:

```bash
createdb shopsmart_qa
```

Update `.env` if your local PostgreSQL username or password is different:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/shopsmart_qa
PORT=3000
```

## Setup Commands

```bash
npm install
npm run db:create
npm run db:seed
npm run dev
npx playwright test
npx playwright show-report
```

## Running the App

Install dependencies:

```bash
npm install
```

Create tables:

```bash
npm run db:create
```

Seed database:

```bash
npm run db:seed
```

Start the backend and frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/login.html
```

Seeded login:

```text
Username: standard_user
Password: secret_sauce
```

## Running Playwright Tests

Run tests:

```bash
npx playwright test
```

View the HTML report:

```bash
npx playwright show-report
```

The Playwright config starts the app with `npm start` and writes the HTML report to `reports/playwright-report`.

## QA Scope

Automation covers:

- Valid login redirect
- Invalid login validation
- Empty login validation
- Logout
- Product loading from database
- Add to cart
- Cart count updates
- Quantity increase
- Item removal
- Cart clearing after checkout
- Missing checkout field validation
- Successful checkout confirmation

Manual QA documentation is in `test-cases/test-cases.md`.

Bug report samples are in `bug-reports/bug-report-samples.md`.

## Resume Bullet

Built and tested a full-stack e-commerce QA portfolio project using Node.js, Express, PostgreSQL, and Playwright, including API validation, database-backed cart and checkout flows, 14 automated UI tests, manual test cases, and professional bug report samples.
