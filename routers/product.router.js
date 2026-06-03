const express = require('express');

const router = express.Router();

const {
    getAllProducts,
    getProductById,
} = require('../models/Product.model');

router.get('/', (req, res, next) => {
    getAllProducts()
        .then((products) => res.status(200).json(products))
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    const id = Number(req.params.id);

    getProductById(id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({
                    error: 'Product not found',
                });
            }

            return res.status(200).json(product);
        })
        .catch(next);
});

module.exports = router;
