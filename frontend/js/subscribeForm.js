// Обработка формы подписки: клиентская валидация + отправка на backend.
(function () {
  const form = document.getElementById('subscribeForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const interestSelect = document.getElementById('interest');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('subscribeSubmit');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setStatus(message, type) {
    status.textContent = message;
    status.className = 'form-status' + (type ? ` form-status--${type}` : '');
  }

  function validateClientSide() {
    let valid = true;
    nameError.textContent = '';
    emailError.textContent = '';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (name.length < 2 || name.length > 60) {
      nameError.textContent = 'Имя должно содержать от 2 до 60 символов.';
      valid = false;
    }

    if (!EMAIL_RE.test(email)) {
      emailError.textContent = 'Укажите корректный e-mail адрес.';
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateClientSide()) {
      setStatus('Исправьте отмеченные поля перед отправкой.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('btn--submitting');
    setStatus('Отправка...', 'pending');

    try {
      const result = await postJSON('/subscribe', {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        interest: interestSelect.value,
      });

      setStatus(result.message || 'Спасибо за подписку!', 'success');
      form.reset();
    } catch (err) {
      if (err.errors) {
        if (err.errors.name) nameError.textContent = err.errors.name;
        if (err.errors.email) emailError.textContent = err.errors.email;
      }
      setStatus(err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn--submitting');
    }
  });
})();
