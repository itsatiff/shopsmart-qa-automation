# ShopSmart Sample Bug Reports

## BUG-001: Invalid Login Error Does Not Display

- Severity: High
- Priority: High
- Environment: Chrome, Windows, local server
- Steps to Reproduce: Open login page, enter `standard_user`, enter wrong password, submit.
- Expected Result: User sees `Invalid username or password`.
- Actual Result: No visible error appears.
- Status: Sample report

## BUG-002: Duplicate Product Creates Separate Cart Rows

- Severity: Medium
- Priority: High
- Environment: Chrome, Windows, local server
- Steps to Reproduce: Sign in, click Add to cart twice on Wireless Headphones, open cart.
- Expected Result: One cart row displays with quantity 2.
- Actual Result: Two separate rows display for the same product.
- Status: Sample report

## BUG-003: Checkout Total Uses Client-Side Price

- Severity: Critical
- Priority: High
- Environment: API and checkout page
- Steps to Reproduce: Add item to cart, modify browser payload or UI price, submit checkout.
- Expected Result: Backend calculates total from PostgreSQL product price.
- Actual Result: Order uses client-provided total.
- Status: Sample report

## BUG-004: Remove Cart Item Does Not Update Cart Count

- Severity: Medium
- Priority: Medium
- Environment: Chrome, Windows, local server
- Steps to Reproduce: Add product, open cart, remove product.
- Expected Result: Cart count changes to 0.
- Actual Result: Header cart count still shows 1.
- Status: Sample report

## BUG-005: Checkout Allows Missing Postal Code

- Severity: High
- Priority: High
- Environment: Checkout page and `/api/orders`
- Steps to Reproduce: Add item, open checkout, fill first and last name, leave postal code empty, submit.
- Expected Result: Postal code validation error displays.
- Actual Result: Order is created without postal code.
- Status: Sample report
