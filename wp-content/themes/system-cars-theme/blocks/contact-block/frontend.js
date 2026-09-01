/**
 * Frontend handler for System Cars contact form.
 */
(function () {
  function getConfig() {
    return window.scContactForm || {
      ajaxUrl: '/wp-admin/admin-ajax.php',
      nonce: '',
      action: 'sc_contact_form_submit',
    };
  }

  function fieldValue(form, name) {
    const el = form.querySelector('[name="' + name + '"]');
    if (!el) return '';
    if (el.type === 'checkbox') {
      return el.checked ? '1' : '0';
    }
    return (el.value || '').trim();
  }

  function setFeedback(el, message, type) {
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || '';
    el.className = 'sc-contact__feedback' + (type ? ' is-' + type : '');
  }

  function initForm(form) {
    if (form.dataset.scContactReady) return;
    form.dataset.scContactReady = '1';

    const submitBtn = form.querySelector('.sc-contact__submit');
    const feedback = form.querySelector('.sc-contact__feedback');
    const defaultLabel = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Honeypot filled → pretend success, do not send.
      if (fieldValue(form, 'sc_hp')) {
        setFeedback(feedback, form.dataset.success || '¡Gracias!', 'success');
        form.reset();
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const config = getConfig();
      if (!config.nonce) {
        setFeedback(
          feedback,
          form.dataset.error || 'No se pudo enviar el mensaje. Recarga la página e inténtalo de nuevo.',
          'error'
        );
        return;
      }

      const body = new FormData();
      body.append('action', config.action);
      body.append('nonce', config.nonce);
      body.append('name', fieldValue(form, 'name'));
      body.append('email', fieldValue(form, 'email'));
      body.append('phone', fieldValue(form, 'phone'));
      body.append('message', fieldValue(form, 'message'));
      body.append('privacy', fieldValue(form, 'privacy'));
      body.append('recipient', form.dataset.recipient || '');
      body.append('subject', form.dataset.subject || 'Formulario desde la web');
      body.append('sig', form.dataset.sig || '');
      body.append('sc_hp', fieldValue(form, 'sc_hp'));

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }
      setFeedback(feedback, '', '');

      fetch(config.ajaxUrl, {
        method: 'POST',
        credentials: 'same-origin',
        body,
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          }).catch(function () {
            return { ok: false, data: null };
          });
        })
        .then(function (result) {
          if (result.data && result.data.success) {
            setFeedback(
              feedback,
              (result.data.data && result.data.data.message) ||
                form.dataset.success ||
                '¡Gracias! Tu mensaje fue enviado correctamente.',
              'success'
            );
            form.reset();
          } else {
            const msg =
              (result.data && result.data.data && result.data.data.message) ||
              form.dataset.error ||
              'No se pudo enviar el mensaje. Inténtalo de nuevo.';
            setFeedback(feedback, msg, 'error');
          }
        })
        .catch(function () {
          setFeedback(
            feedback,
            form.dataset.error || 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
            'error'
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = defaultLabel;
          }
        });
    });
  }

  function init() {
    document.querySelectorAll('.sc-contact__form').forEach(initForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
