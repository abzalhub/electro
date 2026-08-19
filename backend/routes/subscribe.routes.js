const express = require('express');
const { subscribe, listSubscribers } = require('../controllers/subscribe.controller');

const router = express.Router();

// POST /api/subscribe — добавить нового подписчика
router.post('/subscribe', subscribe);

// GET /api/subscribers — демонстрационный эндпоинт для проверки сохранённых данных
router.get('/subscribers', listSubscribers);

module.exports = router;
