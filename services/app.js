const path = require('path');
const express = require('express');

require('dotenv').config();

const userRouter = require('../routers/user.router');
const productRouter = require('../routers/product.router');
const cartRouter = require('../routers/cart.router');
const orderRouter = require('../routers/order.router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: 'Something went wrong on the server',
    });
});

app.listen(PORT, () => {
    console.log(`ShopSmart server is running on http://localhost:${PORT}`);
});
