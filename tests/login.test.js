const { test, expect } = require('@playwright/test');
const { resetDatabase, login } = require('./helpers');

test.beforeAll(() => {
    resetDatabase();
});

test('valid login redirects to products page', async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL(/products.html/);
    await expect(page.getByRole('heading', { name: 'Premium gear for sharper workdays.' })).toBeVisible();
});

test('invalid password shows error', async ({ page }) => {
    await page.goto('/login.html');
    await page.getByLabel('Username').fill('standard_user');
    await page.getByLabel('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('alert')).toContainText('Invalid username or password');
});

test('empty username and password shows validation error', async ({ page }) => {
    await page.goto('/login.html');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('alert')).toContainText('username and password are required');
});

test('logout works', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/login.html/);
});
