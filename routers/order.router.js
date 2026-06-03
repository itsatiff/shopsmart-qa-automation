const express = require('express');

const router = express.Router();

const {
    createOrderFromCart,
    getOrdersByUserId,
} = require('../models/Order.model');

router.post('/', (req, res, next) => {
    if (!req.body.user_id || !req.body.first_name || !req.body.last_name || !req.body.postal_code) {
        return res.status(400).json({
            error: 'user_id, first_name, last_name, and postal_code are required',
        });
    }

    createOrderFromCart({
        user_id: Number(req.body.user_id),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        postal_code: req.body.postal_code,
    })
        .then((order) => {
            if (!order) {
                return res.status(400).json({
                    error: 'cart cannot be empty',
                });
            }

            return res.status(201).json(order);
        })
        .catch(next);
});

router.get('/:userId', (req, res, next) => {
    const userId = Number(req.params.userId);

    getOrdersByUserId(userId)
        .then((orders) => res.status(200).json(orders))
        .catch(next);
});

module.exports = router;
