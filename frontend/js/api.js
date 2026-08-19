// Обёртка над fetch для обращений к backend API.
// Сайт отдаётся тем же express-сервером, что и API, поэтому используем относительные пути.
const API_BASE = '/api';

/**
 * Отправляет POST-запрос с JSON-телом и возвращает разобранный ответ.
 * Бросает Error с понятным сообщением, если сеть недоступна или сервер вернул не-2xx статус.
 */
async function postJSON(path, body) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    throw new Error('Не удалось связаться с сервером. Проверьте подключение и повторите попытку.');
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // тело ответа могло быть пустым — оставляем payload как null
  }

  if (!response.ok) {
    const message = payload && payload.message ? payload.message : `Ошибка сервера (${response.status}).`;
    const error = new Error(message);
    error.errors = payload && payload.errors ? payload.errors : null;
    error.status = response.status;
    throw error;
  }

  return payload;
}

/**
 * Отправляет GET-запрос и возвращает разобранный JSON-ответ.
 * Бросает Error с понятным сообщением при сетевой ошибке или не-2xx статусе.
 */
async function getJSON(path) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`);
  } catch (networkError) {
    throw new Error('Не удалось связаться с сервером. Проверьте подключение и повторите попытку.');
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // тело ответа могло быть пустым — оставляем payload как null
  }

  if (!response.ok) {
    const message = payload && payload.message ? payload.message : `Ошибка сервера (${response.status}).`;
    throw new Error(message);
  }

  return payload;
}
