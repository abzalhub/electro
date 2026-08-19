// Загрузка и отрисовка списка подписчиков на служебной странице /admin.html.
(function () {
  const INTEREST_LABELS = {
    arduino: 'Arduino / DIY-проекты',
    raspberry: 'Raspberry Pi / микрокомпьютеры',
    esp32: 'ESP32 / IoT',
    stm32: 'STM32 / промышленный embedded',
    other: 'Пока не определился(-ась)',
  };

  const tableBody = document.getElementById('subscribersBody');
  const caption = document.getElementById('subscribersCaption');
  const statusEl = document.getElementById('adminStatus');
  const emptyState = document.getElementById('emptyState');
  const refreshBtn = document.getElementById('refreshBtn');
  const table = document.getElementById('subscribersTable');

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString('ru-RU');
    } catch {
      return iso;
    }
  }

  function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.className = 'admin-status' + (isError ? ' admin-status--error' : '');
  }

  async function loadSubscribers() {
    refreshBtn.disabled = true;
    setStatus('Загрузка...', false);

    try {
      const result = await getJSON('/subscribers');
      const rows = result.data || [];

      tableBody.innerHTML = '';

      if (rows.length === 0) {
        table.hidden = true;
        emptyState.hidden = false;
      } else {
        table.hidden = false;
        emptyState.hidden = true;

        rows
          .slice()
          .sort((a, b) => b.id - a.id)
          .forEach((row) => {
            const tr = document.createElement('tr');

            const cells = [
              row.id,
              row.name,
              row.email,
              INTEREST_LABELS[row.interest] || row.interest,
              formatDate(row.createdAt),
            ];

            cells.forEach((value) => {
              const td = document.createElement('td');
              td.textContent = value;
              tr.appendChild(td);
            });

            tableBody.appendChild(tr);
          });
      }

      caption.textContent = `Всего подписчиков: ${result.count}`;
      setStatus(`Обновлено: ${new Date().toLocaleTimeString('ru-RU')}`, false);
    } catch (err) {
      setStatus(err.message, true);
      caption.textContent = 'Не удалось загрузить данные';
    } finally {
      refreshBtn.disabled = false;
    }
  }

  refreshBtn.addEventListener('click', loadSubscribers);
  loadSubscribers();
})();
