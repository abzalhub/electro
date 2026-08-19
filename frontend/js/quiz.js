// Квиз "Какая плата тебе подойдёт" — вся логика на клиенте, очки суммируются по платам.
(function () {
  const BOARDS = {
    arduino: {
      name: 'Arduino',
      reason: 'Простая, дешёвая и прощающая ошибки плата без ОС — идеальна для первого знакомства с электроникой, датчиками и автоматикой.',
      anchor: '#board-arduino',
    },
    esp32: {
      name: 'ESP32',
      reason: 'Встроенный Wi-Fi/Bluetooth и низкая цена делают ESP32 лучшим выбором для IoT-проектов и умного дома.',
      anchor: '#board-esp32',
    },
    stm32: {
      name: 'STM32 (Nucleo / Discovery)',
      reason: 'Профессиональный микроконтроллер с предсказуемым откликом в реальном времени — выбор для промышленных и требовательных embedded-задач.',
      anchor: '#board-stm32',
    },
    raspberry: {
      name: 'Raspberry Pi',
      reason: 'Полноценный Linux-компьютер с большим сообществом — подходит для проектов с ОС, сетью, файлами и множеством одновременных задач.',
      anchor: '#board-raspberry',
    },
    jetson: {
      name: 'NVIDIA Jetson',
      reason: 'GPU на борту заточен под нейросети и компьютерное зрение в реальном времени — лучший вариант для edge AI и робототехники.',
      anchor: '#board-jetson',
    },
    beaglebone: {
      name: 'BeagleBone',
      reason: 'Сочетает Linux с блоками PRU для точного реального времени — подходит для промышленного контроля с гибкостью SBC.',
      anchor: '#board-beaglebone',
    },
    orangepi: {
      name: 'Orange Pi',
      reason: 'Бюджетный микрокомпьютер на Linux — хороший вариант, когда важна цена, а не максимальная производительность.',
      anchor: '#board-orangepi',
    },
  };

  const QUESTIONS = [
    {
      text: 'Какой у тебя опыт в программировании и электронике?',
      options: [
        { label: 'Совсем нет опыта', scores: { arduino: 2, esp32: 1 } },
        { label: 'Немного программирую', scores: { esp32: 2, stm32: 1, raspberry: 1 } },
        { label: 'Уверенно пишу код, знаком(а) с Linux', scores: { raspberry: 2, jetson: 1, beaglebone: 1 } },
      ],
    },
    {
      text: 'Какой бюджет на первую плату?',
      options: [
        { label: 'До 1500 ₽ — хочу минимальные вложения', scores: { arduino: 2, esp32: 2, orangepi: 1 } },
        { label: '1500–8000 ₽ — готов(а) к среднему бюджету', scores: { raspberry: 2, stm32: 1, beaglebone: 1, orangepi: 1 } },
        { label: 'Бюджет не главное, важны возможности', scores: { jetson: 3, raspberry: 1 } },
      ],
    },
    {
      text: 'Что важнее всего для проекта?',
      options: [
        { label: 'Долгая автономная работа от батарейки', scores: { arduino: 2, esp32: 1, stm32: 1 } },
        { label: 'Подключение к Wi-Fi и интернету', scores: { esp32: 3 } },
        { label: 'Запуск ОС и нескольких программ одновременно', scores: { raspberry: 2, beaglebone: 1, orangepi: 1 } },
        { label: 'Обработка видео и нейросетей в реальном времени', scores: { jetson: 3 } },
      ],
    },
    {
      text: 'Насколько важна точность по времени (real-time) и надёжность?',
      options: [
        { label: 'Не критично, это хобби-проект', scores: { arduino: 1, esp32: 1, raspberry: 1 } },
        { label: 'Очень важна — нужен отклик на уровне микросекунд', scores: { stm32: 2, beaglebone: 2 } },
        { label: 'Важна, но нужна и гибкость Linux', scores: { beaglebone: 2, raspberry: 1 } },
      ],
    },
    {
      text: 'Какой тип проекта тебе ближе?',
      options: [
        { label: 'Мигающие светодиоды, датчики, простая автоматика', scores: { arduino: 2 } },
        { label: 'Умный дом и IoT-устройства с приложением', scores: { esp32: 2 } },
        { label: 'Робот с камерой / компьютерное зрение / ИИ', scores: { jetson: 2, raspberry: 1 } },
        { label: 'Домашний сервер, медиацентр, ретро-игры', scores: { raspberry: 2, orangepi: 2 } },
        { label: 'Промышленный контроллер, управление мотором', scores: { stm32: 2, beaglebone: 1 } },
      ],
    },
  ];

  const questionEl = document.getElementById('quizQuestion');
  const progressEl = document.getElementById('quizProgress');
  const resultEl = document.getElementById('quizResult');
  const resultBoardEl = document.getElementById('quizResultBoard');
  const resultReasonEl = document.getElementById('quizResultReason');
  const restartBtn = document.getElementById('quizRestart');

  if (!questionEl) return;

  let currentIndex = 0;
  let scores = {};

  function resetState() {
    currentIndex = 0;
    scores = Object.keys(BOARDS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    resultEl.hidden = true;
    questionEl.hidden = false;
    renderQuestion();
  }

  function renderQuestion() {
    const question = QUESTIONS[currentIndex];
    progressEl.textContent = `Вопрос ${currentIndex + 1} из ${QUESTIONS.length}`;

    questionEl.innerHTML = '';
    const heading = document.createElement('h3');
    heading.textContent = question.text;
    questionEl.appendChild(heading);

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'quiz__options';

    question.options.forEach((option) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz__option';
      btn.textContent = option.label;
      btn.addEventListener('click', () => selectOption(option));
      optionsWrap.appendChild(btn);
    });

    questionEl.appendChild(optionsWrap);
  }

  function selectOption(option) {
    Object.entries(option.scores).forEach(([board, points]) => {
      scores[board] = (scores[board] || 0) + points;
    });

    if (currentIndex < QUESTIONS.length - 1) {
      currentIndex += 1;
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    const winnerKey = Object.keys(scores).reduce((best, key) =>
      scores[key] > scores[best] ? key : best
    , Object.keys(scores)[0]);

    const winner = BOARDS[winnerKey];

    questionEl.hidden = true;
    resultEl.hidden = false;
    resultBoardEl.textContent = winner.name;
    resultReasonEl.innerHTML = `${winner.reason} <a href="${winner.anchor}">Смотреть карточку платы →</a>`;
  }

  restartBtn.addEventListener('click', resetState);

  resetState();
})();
