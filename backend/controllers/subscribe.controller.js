const store = require('../services/subscriberStore');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_INTERESTS = ['arduino', 'raspberry', 'esp32', 'stm32', 'other'];

function validate({ name, email, interest }) {
  const errors = {};

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) {
    errors.name = 'Имя должно содержать от 2 до 60 символов.';
  }

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    errors.email = 'Укажите корректный e-mail адрес.';
  }

  if (interest !== undefined && interest !== '' && !ALLOWED_INTERESTS.includes(interest)) {
    errors.interest = 'Недопустимое значение интереса.';
  }

  return errors;
}

async function subscribe(req, res, next) {
  try {
    const { name, email, interest } = req.body || {};
    const errors = validate({ name, email, interest });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Проверьте правильность заполнения формы.',
        errors,
      });
    }

    const trimmedEmail = email.trim();
    const existing = await store.findByEmail(trimmedEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Этот e-mail уже подписан.',
      });
    }

    const entry = await store.addSubscriber({
      name: name.trim(),
      email: trimmedEmail,
      interest: interest || 'other',
    });

    return res.status(201).json({
      success: true,
      message: 'Спасибо за подписку! Мы будем присылать полезные материалы.',
      data: entry,
    });
  } catch (err) {
    next(err);
  }
}

async function listSubscribers(req, res, next) {
  try {
    const all = await store.getAll();
    res.status(200).json({ success: true, count: all.length, data: all });
  } catch (err) {
    next(err);
  }
}

module.exports = { subscribe, listSubscribers };
