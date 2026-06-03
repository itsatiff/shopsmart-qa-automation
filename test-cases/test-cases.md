# ShopSmart Manual Test Cases

| ID | Area | Test Case | Steps | Expected Result |
| --- | --- | --- | --- | --- |
| TC-001 | Login | Valid user can sign in | Open login page, enter `standard_user` and `secret_sauce`, submit | User lands on products page |
| TC-002 | Login | Invalid password is rejected | Enter valid username and wrong password, submit | Error message displays and user remains on login page |
| TC-003 | Login | Empty credentials show validation | Submit login form with empty fields | Required field error displays |
| TC-004 | Logout | User can log out | Sign in, click Logout | User returns to login page |
| TC-005 | Products | Product list loads from database | Sign in and view products page | Eight seeded products display |
| TC-006 | Products | Product card shows details | Inspect a product card | Name, description, category, price, stock, image, and button display |
| TC-007 | Products | Carousel displays featured items | View products hero section | Featured product carousel is visible |
| TC-008 | Cart | Add item to cart | Click Add to cart on a product | Cart count increases |
| TC-009 | Cart | Duplicate product updates quantity | Add the same product twice | Cart contains one row with quantity 2 |
| TC-010 | Cart | Cart page shows subtotal | Add product and open cart page | Item line total and subtotal display correctly |
| TC-011 | Cart | Increase quantity | Open cart and click plus button | Quantity and subtotal increase |
| TC-012 | Cart | Decrease quantity | Open cart with quantity above 1 and click minus button | Quantity and subtotal decrease |
| TC-013 | Cart | Remove item | Click Remove on a cart item | Item disappears and cart count updates |
| TC-014 | Checkout | Missing first name validation | Open checkout with cart item, leave first name blank, submit | First name error displays |
| TC-015 | Checkout | Missing last name validation | Leave last name blank and submit | Last name error displays |
| TC-016 | Checkout | Missing postal code validation | Leave postal code blank and submit | Postal code error displays |
| TC-017 | Checkout | Empty cart cannot checkout | Clear cart, open checkout, fill form, submit | Empty cart error displays |
| TC-018 | Checkout | Successful checkout | Add item, fill checkout form, submit | Confirmation displays and cart clears |
