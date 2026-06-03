const { test, expect } = require('@playwright/test');
const {
    login,
    clearCart,
    addProductToCart,
} = require('./helpers');

test.beforeEach(async ({ request }) => {
    await clearCart(request);
});

test('products load from database', async ({ page }) => {
    await login(page);

    await expect(page.getByTestId('product-card')).toHaveCount(8);
    await expect(page.getByText('Wireless Headphones').first()).toBeVisible();
});

test('add product to cart', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.goto('/cart.html');

    await expect(page.getByTestId('cart-item')).toHaveCount(1);
    await expect(page.getByText('Wireless Headphones')).toBeVisible();
});

test('cart count updates', async ({ page }) => {
    await login(page);
    await expect(page.locator('#cartCount')).toHaveText('0');
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    await expect(page.locator('#cartCount')).toHaveText('1');
});

test('increase quantity', async ({ page, request }) => {
    await addProductToCart(request);
    await login(page);
    await page.goto('/cart.html');
    await page.getByRole('button', { name: '+' }).click();

    await expect(page.getByTestId('quantity-value')).toHaveText('2');
    await expect(page.locator('#cartCount')).toHaveText('2');
});

test('remove product from cart', async ({ page, request }) => {
    await addProductToCart(request);
    await login(page);
    await page.goto('/cart.html');
    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(page.getByText('Your cart is empty.')).toBeVisible();
    await expect(page.locator('#cartCount')).toHaveText('0');
});

test('clear cart after checkout', async ({ page, request }) => {
    await addProductToCart(request, 1, 2);
    await login(page);
    await page.goto('/checkout.html');
    await page.getByLabel('First name').fill('Standard');
    await page.getByLabel('Last name').fill('User');
    await page.getByLabel('Postal code').fill('12345');
    await page.getByRole('button', { name: 'Place order' }).click();

    await expect(page.getByRole('status')).toContainText('confirmed');
    await expect(page.locator('#cartCount')).toHaveText('0');
    await page.goto('/cart.html');
    await expect(page.getByText('Your cart is empty.')).toBeVisible();
});
