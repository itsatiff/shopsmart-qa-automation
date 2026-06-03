const API = {
    login: '/api/users/login',
    logout: '/api/users/logout',
    products: '/api/products',
    cart: '/api/cart',
    orders: '/api/orders',
};

function getUser() {
    const savedUser = localStorage.getItem('shopsmartUser');
    return savedUser ? JSON.parse(savedUser) : null;
}

function setUser(user) {
    localStorage.setItem('shopsmartUser', JSON.stringify(user));
}

function clearUser() {
    localStorage.removeItem('shopsmartUser');
}

function requireUser() {
    const user = getUser();

    if (!user) {
        window.location.href = 'login.html';
        return null;
    }

    return user;
}

function formatMoney(value) {
    return `$${Number(value).toFixed(2)}`;
}

async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

async function loadCartCount(userId) {
    const countElement = document.getElementById('cartCount');

    if (!countElement) {
        return;
    }

    const items = await fetchJson(`${API.cart}/${userId}`);
    const count = items.reduce((total, item) => total + Number(item.quantity), 0);
    countElement.textContent = count;
}

async function handleLogout() {
    await fetchJson(API.logout, {
        method: 'POST',
        body: JSON.stringify({}),
    });

    clearUser();
    window.location.href = 'login.html';
}

function setupLogout() {
    const button = document.getElementById('logoutButton');

    if (button) {
        button.addEventListener('click', handleLogout);
    }
}

function renderCarousel(products) {
    const carousel = document.getElementById('carouselTrack');

    if (!carousel) {
        return;
    }

    const featuredProducts = [...products.slice(0, 5), ...products.slice(0, 5)];

    carousel.innerHTML = featuredProducts.map((product) => `
        <article class="carousel-card">
            <img src="${product.image_url}" alt="${product.name}">
            <strong>${product.name}</strong>
            <span>${formatMoney(product.price)}</span>
        </article>
    `).join('');
}

function renderProducts(products, user) {
    const grid = document.getElementById('productsGrid');

    grid.innerHTML = products.map((product) => `
        <article class="product-card" data-testid="product-card">
            <img src="${product.image_url}" alt="${product.name}">
            <div class="product-info">
                <div class="product-meta">
                    <span class="eyebrow">${product.category}</span>
                    <span>${product.stock} in stock</span>
                </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-meta">
                    <span class="price">${formatMoney(product.price)}</span>
                    <button class="primary-button add-to-cart" data-product-id="${product.id}" type="button">
                        Add to cart
                    </button>
                </div>
            </div>
        </article>
    `).join('');

    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', async () => {
            button.textContent = 'Adding...';
            await fetchJson(API.cart, {
                method: 'POST',
                body: JSON.stringify({
                    user_id: user.id,
                    product_id: Number(button.dataset.productId),
                    quantity: 1,
                }),
            });
            await loadCartCount(user.id);
            button.textContent = 'Added';
            setTimeout(() => {
                button.textContent = 'Add to cart';
            }, 900);
        });
    });
}

async function initLoginPage() {
    const form = document.getElementById('loginForm');
    const error = document.getElementById('loginError');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        error.textContent = '';

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            error.textContent = 'username and password are required';
            return;
        }

        try {
            const user = await fetchJson(API.login, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            setUser(user);
            window.location.href = 'products.html';
        } catch (err) {
            error.textContent = err.message;
        }
    });
}

async function initProductsPage() {
    const user = requireUser();

    if (!user) {
        return;
    }

    setupLogout();

    try {
        const products = await fetchJson(API.products);
        renderCarousel(products);
        renderProducts(products, user);
        await loadCartCount(user.id);
    } catch (err) {
        document.getElementById('productsError').textContent = err.message;
    }
}

function cartSubtotal(items) {
    return items.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
}

async function renderCartPage(user) {
    const container = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('cartSubtotal');
    const message = document.getElementById('cartMessage');
    const items = await fetchJson(`${API.cart}/${user.id}`);

    await loadCartCount(user.id);
    subtotalElement.textContent = formatMoney(cartSubtotal(items));

    if (items.length === 0) {
        container.innerHTML = '<div class="empty-state">Your cart is empty.</div>';
        return;
    }

    container.innerHTML = items.map((item) => `
        <article class="cart-item" data-testid="cart-item">
            <img src="${item.image_url}" alt="${item.name}">
            <div>
                <div class="product-meta">
                    <h3>${item.name}</h3>
                    <strong>${formatMoney(item.line_total)}</strong>
                </div>
                <p class="muted">${item.description}</p>
                <div class="cart-actions">
                    <div class="cart-controls" aria-label="Quantity controls">
                        <button class="decrease" data-id="${item.id}" data-quantity="${item.quantity}" type="button">-</button>
                        <strong data-testid="quantity-value">${item.quantity}</strong>
                        <button class="increase" data-id="${item.id}" data-quantity="${item.quantity}" type="button">+</button>
                    </div>
                    <button class="remove-button" data-id="${item.id}" type="button">Remove</button>
                </div>
            </div>
        </article>
    `).join('');

    document.querySelectorAll('.increase, .decrease').forEach((button) => {
        button.addEventListener('click', async () => {
            const currentQuantity = Number(button.dataset.quantity);
            const nextQuantity = button.classList.contains('increase') ? currentQuantity + 1 : currentQuantity - 1;

            if (nextQuantity < 1) {
                return;
            }

            await fetchJson(`${API.cart}/${button.dataset.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ quantity: nextQuantity }),
            });
            await renderCartPage(user);
        });
    });

    document.querySelectorAll('.remove-button').forEach((button) => {
        button.addEventListener('click', async () => {
            await fetchJson(`${API.cart}/${button.dataset.id}`, {
                method: 'DELETE',
            });
            message.textContent = 'Item removed from cart.';
            await renderCartPage(user);
        });
    });
}

async function initCartPage() {
    const user = requireUser();

    if (!user) {
        return;
    }

    setupLogout();
    await renderCartPage(user);
}

async function renderCheckoutSummary(user) {
    const itemsElement = document.getElementById('checkoutItems');
    const totalElement = document.getElementById('checkoutTotal');
    const items = await fetchJson(`${API.cart}/${user.id}`);

    await loadCartCount(user.id);
    totalElement.textContent = formatMoney(cartSubtotal(items));
    itemsElement.innerHTML = items.length
        ? items.map((item) => `<div class="summary-line"><span>${item.quantity} x ${item.name}</span><strong>${formatMoney(item.line_total)}</strong></div>`).join('')
        : '<p class="muted">Your cart is empty.</p>';
}

async function initCheckoutPage() {
    const user = requireUser();

    if (!user) {
        return;
    }

    setupLogout();
    await renderCheckoutSummary(user);

    const form = document.getElementById('checkoutForm');
    const error = document.getElementById('checkoutError');
    const success = document.getElementById('checkoutSuccess');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        error.textContent = '';
        success.textContent = '';

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();

        if (!firstName) {
            error.textContent = 'first_name is required';
            return;
        }

        if (!lastName) {
            error.textContent = 'last_name is required';
            return;
        }

        if (!postalCode) {
            error.textContent = 'postal_code is required';
            return;
        }

        try {
            const order = await fetchJson(API.orders, {
                method: 'POST',
                body: JSON.stringify({
                    user_id: user.id,
                    first_name: firstName,
                    last_name: lastName,
                    postal_code: postalCode,
                }),
            });

            success.textContent = `Order #${order.id} confirmed. Thank you for shopping with ShopSmart.`;
            form.reset();
            await renderCheckoutSummary(user);
        } catch (err) {
            error.textContent = err.message;
        }
    });
}

const page = document.body.dataset.page;

if (page === 'login') {
    initLoginPage();
}

if (page === 'products') {
    initProductsPage();
}

if (page === 'cart') {
    initCartPage();
}

if (page === 'checkout') {
    initCheckoutPage();
}
