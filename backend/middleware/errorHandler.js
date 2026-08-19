// 404 — маршрут не найден
function notFound(req, res) {
  res.status(404).json({ success: false, message: `Маршрут ${req.originalUrl} не найден.` });
}

// Централизованный обработчик ошибок express (сигнатура из 4 аргументов обязательна)
function errorHandler(err, req, res, _next) {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера.',
  });
}

module.exports = { notFound, errorHandler };
