const { test, expect } = require('@playwright/test');
const {
    login,
    clearCart,
    addProductToCart,
} = require('./helpers');

test.beforeEach(async ({ request }) => {
    await clearCart(request);
    await addProductToCart(request);
});

test('missing first name shows error', async ({ page }) => {
    await login(page);
    await page.goto('/checkout.html');
    await page.getByLabel('Last name').fill('User');
    await page.getByLabel('Postal code').fill('12345');
    await page.getByRole('button', { name: 'Place order' }).click();

    await expect(page.getByRole('alert')).toContainText('first_name is required');
});

test('missing last name shows error', async ({ page }) => {
    await login(page);
    await page.goto('/checkout.html');
    await page.getByLabel('First name').fill('Standard');
    await page.getByLabel('Postal code').fill('12345');
    await page.getByRole('button', { name: 'Place order' }).click();

    await expect(page.getByRole('alert')).toContainText('last_name is required');
});

test('missing postal code shows error', async ({ page }) => {
    await login(page);
    await page.goto('/checkout.html');
    await page.getByLabel('First name').fill('Standard');
    await page.getByLabel('Last name').fill('User');
    await page.getByRole('button', { name: 'Place order' }).click();

    await expect(page.getByRole('alert')).toContainText('postal_code is required');
});

test('successful checkout shows confirmation', async ({ page }) => {
    await login(page);
    await page.goto('/checkout.html');
    await page.getByLabel('First name').fill('Standard');
    await page.getByLabel('Last name').fill('User');
    await page.getByLabel('Postal code').fill('12345');
    await page.getByRole('button', { name: 'Place order' }).click();

    await expect(page.getByRole('status')).toContainText('Order #');
    await expect(page.getByRole('status')).toContainText('confirmed');
});
