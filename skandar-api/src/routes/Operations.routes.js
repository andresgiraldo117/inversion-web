const { Router } = require('express');
const ClassOperation = require('../controllers/Operations.controller.js');
const { verifyToken, apikey, isUser } = require('../middlewares/AuthJWT');
const router = Router();
const Boom = require('@hapi/boom');
const { body, validationResult } = require('express-validator');

router.post('/', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassOperation.create(req.user, req.body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassOperation.getAll(req.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/today/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassOperation.getAlltoday(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassOperation.getAll(req.user, req.params.id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', verifyToken, apikey, isUser, async(req, res, next) => {
    try {
        const response = await ClassOperation.update(req.user, req.params.id, req.body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;