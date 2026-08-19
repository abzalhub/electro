const path = require('path');
const express = require('express');
const cors = require('cors');
const subscribeRoutes = require('./routes/subscribe.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Отдаём фронтенд как статику, чтобы сайт и API работали на одном порту без CORS-проблем
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Удобный алиас без .html для служебной страницы просмотра подписчиков
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'admin.html'));
});

app.use('/api', subscribeRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
