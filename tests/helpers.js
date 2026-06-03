const { execSync } = require('child_process');

function resetDatabase() {
    execSync('npm run db:create', { stdio: 'inherit' });
    execSync('npm run db:seed', { stdio: 'inherit' });
}

async function login(page) {
    await page.goto('/login.html');
    await page.getByLabel('Username').fill('standard_user');
    await page.getByLabel('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('**/products.html');
}

async function clearCart(request) {
    await request.delete('/api/cart/user/1');
}

async function addProductToCart(request, productId = 1, quantity = 1) {
    await request.post('/api/cart', {
        data: {
            user_id: 1,
            product_id: productId,
            quantity,
        },
    });
}

module.exports = {
    resetDatabase,
    login,
    clearCart,
    addProductToCart,
};
