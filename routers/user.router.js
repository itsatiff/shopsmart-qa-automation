const express = require('express');

const router = express.Router();

const {
    findUserByCredentials,
    getUserById,
} = require('../models/User.model');

router.post('/login', (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            error: 'username and password are required',
        });
    }

    findUserByCredentials(req.body.username, req.body.password)
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    error: 'Invalid username or password',
                });
            }

            return res.status(200).json(user);
        })
        .catch(next);
});

router.post('/logout', (req, res) => {
    return res.status(200).json({
        message: 'Logged out successfully',
    });
});

router.get('/:id', (req, res, next) => {
    const id = Number(req.params.id);

    getUserById(id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: 'User not found',
                });
            }

            return res.status(200).json(user);
        })
        .catch(next);
});

module.exports = router;
