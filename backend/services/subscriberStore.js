// Простое файловое хранилище подписчиков (JSON-файл вместо БД).
const fs = require('fs/promises');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'subscribers.json');

async function ensureFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

async function getAll() {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw || '[]');
}

async function findByEmail(email) {
  const all = await getAll();
  return all.find((s) => s.email.toLowerCase() === email.toLowerCase());
}

async function addSubscriber({ name, email, interest }) {
  const all = await getAll();
  const entry = {
    id: all.length > 0 ? all[all.length - 1].id + 1 : 1,
    name,
    email,
    interest: interest || 'other',
    createdAt: new Date().toISOString(),
  };
  all.push(entry);
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
  return entry;
}

module.exports = { getAll, findByEmail, addSubscriber };
