const express = require('express');

const router = express.Router();

const {
    getCartByUserId,
    addCartItem,
    updateCartItem,
    deleteCartItem,
    clearCartByUserId,
} = require('../models/Cart.model');

router.get('/:userId', (req, res, next) => {
    const userId = Number(req.params.userId);

    getCartByUserId(userId)
        .then((items) => res.status(200).json(items))
        .catch(next);
});

router.post('/', (req, res, next) => {
    const quantity = Number(req.body.quantity);

    if (!req.body.user_id || !req.body.product_id || !req.body.quantity) {
        return res.status(400).json({
            error: 'user_id, product_id, and quantity are required',
        });
    }

    if (quantity < 1) {
        return res.status(400).json({
            error: 'quantity must be at least 1',
        });
    }

    addCartItem({
        user_id: Number(req.body.user_id),
        product_id: Number(req.body.product_id),
        quantity,
    })
        .then((item) => res.status(201).json(item))
        .catch(next);
});

router.patch('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    const quantity = Number(req.body.quantity);

    if (!req.body.quantity) {
        return res.status(400).json({
            error: 'quantity is required',
        });
    }

    if (quantity < 1) {
        return res.status(400).json({
            error: 'quantity must be at least 1',
        });
    }

    updateCartItem(id, quantity)
        .then((item) => {
            if (!item) {
                return res.status(404).json({
                    error: 'Cart item not found',
                });
            }

            return res.status(200).json(item);
        })
        .catch(next);
});

router.delete('/user/:userId', (req, res, next) => {
    const userId = Number(req.params.userId);

    clearCartByUserId(userId)
        .then((items) => res.status(200).json(items))
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    const id = Number(req.params.id);

    deleteCartItem(id)
        .then((item) => {
            if (!item) {
                return res.status(404).json({
                    error: 'Cart item not found',
                });
            }

            return res.status(200).json(item);
        })
        .catch(next);
});

module.exports = router;
