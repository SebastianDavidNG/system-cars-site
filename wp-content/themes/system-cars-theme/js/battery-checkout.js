/**
 * Battery checkout address UI (WooCommerce Blocks).
 *
 * Layout: Ciudad | Departamento | Zona (same row, equal width)
 * - Ciudad default: "Selecciona ciudad"
 * - Departamento: "Selecciona un departamento" | Ninguno (CO-DC) | Cundinamarca (CO-CUN)
 * - Zona:
 *   - Sin departamento o Ninguno → Bogotá localidades
 *   - Cundinamarca → municipios (Cajicá, Chía, etc.)
 */
(function () {
  'use strict';

  var cfg = window.scBatteryCheckout;
  if (!cfg || !cfg.restrict) {
    return;
  }

  var NOTICE_ID = 'sc-battery-shipping-notice';
  var EXPAND_SVG =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="wc-blocks-components-select__expand" aria-hidden="true" focusable="false"><path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path></svg>';

  var bogotaCity = cfg.bogotaCity || 'Bogotá';
  var bogotaZones = Array.isArray(cfg.bogotaZones) ? cfg.bogotaZones : [];
  var municipalities = Array.isArray(cfg.municipalities) ? cfg.municipalities : [];
  var cities = [bogotaCity];
  var cunCode = 'CO-CUN';
  var noneCode = 'CO-DC'; // Distrito Capital — opción "Ninguno" (zonas Bogotá)

  var observer = null;
  var scanTimer = null;
  var isMutating = false;

  function withPausedObserver(fn) {
    isMutating = true;
    if (observer) {
      observer.disconnect();
    }
    try {
      fn();
    } finally {
      isMutating = false;
      if (observer) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  }

  function ensureNotice() {
    if (document.getElementById(NOTICE_ID)) {
      return;
    }

    var host =
      document.querySelector('.wc-block-components-shipping-address') ||
      document.querySelector('.wp-block-woocommerce-checkout-shipping-address-block') ||
      document.querySelector('.wc-block-checkout__shipping-fields') ||
      document.querySelector('.wp-block-woocommerce-checkout') ||
      document.querySelector('form.woocommerce-checkout');

    if (!host) {
      return;
    }

    var notice = document.createElement('div');
    notice.id = NOTICE_ID;
    notice.setAttribute('role', 'status');
    notice.style.cssText =
      'margin:0 0 1rem;padding:0.85rem 1rem;border-left:4px solid #002060;background:#f3f6fb;color:#232225;font-size:0.9rem;line-height:1.45;';
    notice.textContent = cfg.notice;
    host.insertBefore(notice, host.firstChild);
  }

  function createWcSelect(selectId, labelText, options, placeholder, currentValue) {
    var select = document.createElement('select');
    select.className = 'sc-battery-city-select wc-blocks-components-select__select';
    select.id = selectId;
    select.size = 1;
    select.setAttribute('aria-invalid', 'false');

    var placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.selected = true;
    placeholderOpt.textContent = placeholder;
    select.appendChild(placeholderOpt);

    var normalizedCurrent = (currentValue || '').trim().toLowerCase();
    var matched = false;

    options.forEach(function (label) {
      var opt = document.createElement('option');
      opt.value = label;
      opt.textContent = label;
      if (normalizedCurrent && label.toLowerCase() === normalizedCurrent) {
        opt.selected = true;
        matched = true;
      }
      select.appendChild(opt);
    });

    if (matched) {
      placeholderOpt.selected = false;
    } else {
      select.value = '';
    }

    var root = document.createElement('div');
    root.className = 'wc-blocks-components-select';

    var container = document.createElement('div');
    container.className = 'wc-blocks-components-select__container';

    var label = document.createElement('label');
    label.className = 'wc-blocks-components-select__label';
    label.setAttribute('for', selectId);
    label.textContent = labelText;

    container.appendChild(label);
    container.appendChild(select);
    container.insertAdjacentHTML('beforeend', EXPAND_SVG);
    root.appendChild(container);

    return { root: root, select: select };
  }

  function refillSelect(select, options, placeholder, currentValue) {
    var value = currentValue || '';
    var html = '<option value="">' + placeholder + '</option>';
    var matched = false;

    options.forEach(function (label) {
      var selected = value && label.toLowerCase() === value.toLowerCase();
      if (selected) {
        matched = true;
      }
      html +=
        '<option value="' +
        String(label).replace(/"/g, '&quot;') +
        '"' +
        (selected ? ' selected' : '') +
        '>' +
        label +
        '</option>';
    });

    select.innerHTML = html;
    select.value = matched ? value : '';
  }

  function setNativeValue(input, value) {
    if (!(input instanceof HTMLInputElement) && !(input instanceof HTMLTextAreaElement)) {
      return;
    }
    if (input.value === value) {
      return;
    }
    var proto = input instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    var descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    if (descriptor && descriptor.set) {
      descriptor.set.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function findStateSelect(cityInput) {
    var form = cityInput.closest('.wc-block-components-address-form') || document;
    var prefix = cityInput.id && cityInput.id.indexOf('billing') === 0 ? 'billing' : 'shipping';
    return (
      form.querySelector('#' + prefix + '-state') ||
      form.querySelector('.wc-block-components-state-input select') ||
      form.querySelector('select[id*="state"]')
    );
  }

  function findStateWrap(cityInput) {
    var form = cityInput.closest('.wc-block-components-address-form');
    if (!form) {
      return null;
    }
    var prefix = cityInput.id && cityInput.id.indexOf('billing') === 0 ? 'billing' : 'shipping';
    var stateSelect = form.querySelector('#' + prefix + '-state');
    return (
      form.querySelector('.wc-block-components-address-form__state') ||
      (stateSelect && stateSelect.closest('.wc-block-components-state-input'))
    );
  }

  function findAddress2Input(cityInput) {
    var form = cityInput.closest('.wc-block-components-address-form') || document;
    var prefix = cityInput.id && cityInput.id.indexOf('billing') === 0 ? 'billing' : 'shipping';
    return (
      form.querySelector('#' + prefix + '-address_2') ||
      form.querySelector('input[id*="address_2"]') ||
      form.querySelector('input[autocomplete*="address-line2"]')
    );
  }

  function parseZone(address2Value) {
    var value = (address2Value || '').trim();
    var match = value.match(/^(?:Localidad|Zona)\s*:\s*(.+)$/i);
    return match ? match[1].trim() : value;
  }

  function formatZone(zone) {
    return zone ? 'Localidad: ' + zone : '';
  }

  function isBogota(value) {
    return (value || '').trim().toLowerCase() === bogotaCity.toLowerCase();
  }

  function isMunicipality(value) {
    var needle = (value || '').trim().toLowerCase();
    return municipalities.some(function (item) {
      return item.toLowerCase() === needle;
    });
  }

  function isCundinamarca(stateValue) {
    return stateValue === cunCode || stateValue === 'CUN';
  }

  function usesBogotaZones(stateValue) {
    // Placeholder vacío o Ninguno (CO-DC) → zonas de Bogotá.
    return !isCundinamarca(stateValue);
  }

  function getZoneOptionsForState(stateValue) {
    return usesBogotaZones(stateValue) ? bogotaZones : municipalities;
  }

  function getZoneModeForState(stateValue) {
    return usesBogotaZones(stateValue) ? 'bogota' : 'cun';
  }

  /**
   * Departamento: placeholder | Ninguno | Cundinamarca.
   */
  function restrictStateOptions(select) {
    if (!(select instanceof HTMLSelectElement)) {
      return;
    }

    var placeholderText = 'Selecciona un departamento';
    var noneText = 'Ninguno';
    var cunLabel = 'Cundinamarca';
    var needsRebuild = select.dataset.scBatteryStates !== '1';

    if (needsRebuild) {
      var cunOpt = Array.prototype.find.call(select.options, function (opt) {
        return opt.value === cunCode || opt.value === 'CUN';
      });
      if (cunOpt && cunOpt.textContent) {
        cunLabel = cunOpt.textContent;
      }

      select.innerHTML = '';

      var empty = document.createElement('option');
      empty.value = '';
      empty.textContent = placeholderText;
      select.appendChild(empty);

      var none = document.createElement('option');
      none.value = noneCode;
      none.textContent = noneText;
      select.appendChild(none);

      var cun = document.createElement('option');
      cun.value = cunCode;
      cun.textContent = cunLabel;
      select.appendChild(cun);

      select.dataset.scBatteryStates = '1';
    }

    // Default: sin departamento. Conservar Ninguno o Cundinamarca si el usuario eligió.
    if (!select.dataset.scBatteryUserPicked) {
      select.value = '';
    } else if (select.value === noneCode) {
      // Keep Ninguno.
    } else if (!isCundinamarca(select.value) && select.value !== '') {
      select.value = '';
    }
  }

  function bindStateChange(stateSelect, cityInput, citySelect, zoneSelect) {
    if (!stateSelect || stateSelect.dataset.scBatteryBound === '1') {
      return;
    }
    stateSelect.dataset.scBatteryBound = '1';

    stateSelect.addEventListener('change', function () {
      if (stateSelect.value) {
        stateSelect.dataset.scBatteryUserPicked = '1';
      } else {
        delete stateSelect.dataset.scBatteryUserPicked;
      }

      withPausedObserver(function () {
        updateZoneOptions(zoneSelect, stateSelect.value, '');
      });
      syncAddress(
        cityInput,
        citySelect ? citySelect.value : '',
        zoneSelect ? zoneSelect.value : '',
        stateSelect.value
      );
    });
  }

  function syncAddress(cityInput, citySelectValue, zoneValue, stateValue) {
    withPausedObserver(function () {
      var address2 = findAddress2Input(cityInput);
      var stateSelect = findStateSelect(cityInput);
      var state = typeof stateValue === 'string' ? stateValue : (stateSelect ? stateSelect.value : '');

      if (isCundinamarca(state) && zoneValue && isMunicipality(zoneValue)) {
        setNativeValue(cityInput, zoneValue);
        if (address2 && /^(?:Localidad|Zona)\s*:/i.test((address2.value || '').trim())) {
          setNativeValue(address2, '');
        }
        return;
      }

      // Placeholder o Ninguno → Bogotá + localidad in address_2.
      if (usesBogotaZones(state) && zoneValue && bogotaZones.indexOf(zoneValue) !== -1) {
        setNativeValue(cityInput, bogotaCity);
        if (citySelectValue !== bogotaCity) {
          // Keep UI city select in sync if present.
          var cityUi = document.getElementById((cityInput.id || 'shipping-city') + '-select');
          if (cityUi && cityUi.value !== bogotaCity) {
            cityUi.value = bogotaCity;
          }
        }
        if (address2) {
          setNativeValue(address2, formatZone(zoneValue));
        }
        return;
      }

      if (isBogota(citySelectValue)) {
        setNativeValue(cityInput, bogotaCity);
        if (address2) {
          var keepLocalidad =
            zoneValue && bogotaZones.indexOf(zoneValue) !== -1 ? formatZone(zoneValue) : '';
          setNativeValue(address2, keepLocalidad);
        }
        return;
      }

      if (!citySelectValue && !zoneValue) {
        setNativeValue(cityInput, '');
        if (address2 && /^(?:Localidad|Zona)\s*:/i.test((address2.value || '').trim())) {
          setNativeValue(address2, '');
        }
      }
    });
  }

  function applyRowItemStyles(el) {
    if (!el) {
      return;
    }
    el.style.flex = '1 1 calc(33.333% - 12px)';
    el.style.width = 'calc(33.333% - 12px)';
    el.style.maxWidth = 'calc(33.333% - 12px)';
    el.style.minWidth = '140px';
    el.style.boxSizing = 'border-box';
    el.dataset.scBatteryFullWidth = 'row';
  }

  /**
   * Same row: Ciudad | Departamento | Zona
   */
  function layoutBatteryAddressFields(cityInput) {
    var form = cityInput.closest('.wc-block-components-address-form');
    if (!form) {
      return;
    }

    var cityWrap =
      cityInput.closest('.sc-battery-city-field') ||
      cityInput.closest('.wc-block-components-address-form__city');
    var stateWrap = findStateWrap(cityInput);
    var zoneWrap = form.querySelector('.sc-battery-zone-field');

    if (!cityWrap || !stateWrap || !zoneWrap) {
      return;
    }

    applyRowItemStyles(cityWrap);
    applyRowItemStyles(stateWrap);
    applyRowItemStyles(zoneWrap);

    var needsReorder =
      cityWrap.nextElementSibling !== stateWrap ||
      stateWrap.nextElementSibling !== zoneWrap;

    if (!needsReorder) {
      return;
    }

    if (cityWrap.nextElementSibling !== stateWrap) {
      form.insertBefore(stateWrap, cityWrap.nextSibling);
    }
    if (stateWrap.nextElementSibling !== zoneWrap) {
      form.insertBefore(zoneWrap, stateWrap.nextSibling);
    }
  }

  function ensureZoneField(cityWrap, cityInput, citySelect) {
    var form = cityInput.closest('.wc-block-components-address-form');
    if (!form) {
      return null;
    }

    var zoneId = (cityInput.id || 'shipping-city') + '-zone';
    var existing = form.querySelector('#' + zoneId);
    if (existing) {
      return existing;
    }

    var stateSelect = findStateSelect(cityInput);
    var stateValue = stateSelect && stateSelect.dataset.scBatteryUserPicked ? stateSelect.value : '';

    var zoneWrap = document.createElement('div');
    zoneWrap.className = 'sc-battery-zone-field wc-block-components-address-form__sc-zone';

    var address2 = findAddress2Input(cityInput);
    var currentZone = parseZone(address2 ? address2.value : '');
    if (!currentZone && isMunicipality(cityInput.value)) {
      currentZone = cityInput.value;
    }

    var initialOptions = getZoneOptionsForState(stateValue);
    if (currentZone && initialOptions.indexOf(currentZone) === -1) {
      currentZone = '';
    }

    var zoneUi = createWcSelect(
      zoneId,
      cfg.zoneLabel || 'Zona',
      initialOptions,
      cfg.zonePlaceholder || 'Selecciona zona',
      currentZone
    );
    zoneUi.select.dataset.scBatteryZoneMode = getZoneModeForState(stateValue);
    zoneWrap.appendChild(zoneUi.root);

    var stateWrap = findStateWrap(cityInput);
    if (stateWrap && stateWrap.parentNode) {
      if (stateWrap.nextSibling) {
        stateWrap.parentNode.insertBefore(zoneWrap, stateWrap.nextSibling);
      } else {
        stateWrap.parentNode.appendChild(zoneWrap);
      }
    } else if (cityWrap.nextSibling) {
      cityWrap.parentNode.insertBefore(zoneWrap, cityWrap.nextSibling);
    } else {
      cityWrap.parentNode.appendChild(zoneWrap);
    }

    zoneUi.select.addEventListener('change', function () {
      var st = findStateSelect(cityInput);
      syncAddress(
        cityInput,
        citySelect ? citySelect.value : '',
        zoneUi.select.value,
        st ? st.value : ''
      );
    });

    return zoneUi.select;
  }

  function updateZoneOptions(zoneSelect, stateValue, preferredZone) {
    if (!zoneSelect) {
      return;
    }

    var options = getZoneOptionsForState(stateValue);
    var mode = getZoneModeForState(stateValue);

    if (zoneSelect.dataset.scBatteryZoneMode === mode) {
      if (preferredZone && options.indexOf(preferredZone) !== -1 && zoneSelect.value !== preferredZone) {
        zoneSelect.value = preferredZone;
      }
      return;
    }

    var current = preferredZone || '';
    if (current && options.indexOf(current) === -1) {
      current = '';
    }

    refillSelect(zoneSelect, options, cfg.zonePlaceholder || 'Selecciona zona', current);
    zoneSelect.dataset.scBatteryZoneMode = mode;
  }

  function enhanceCityInput(input) {
    if (!(input instanceof HTMLInputElement) || input.dataset.scBatteryEnhanced === '1') {
      return;
    }

    var isCity =
      input.id === 'shipping-city' ||
      input.id === 'billing-city' ||
      (typeof input.autocomplete === 'string' && input.autocomplete.indexOf('address-level2') !== -1) ||
      /(?:^|-)city$/i.test(input.id || '');

    if (!isCity) {
      return;
    }

    var wrap = input.closest('.wc-block-components-text-input') || input.parentNode;
    if (!wrap) {
      return;
    }

    input.dataset.scBatteryEnhanced = '1';
    input.style.display = 'none';
    input.setAttribute('aria-hidden', 'true');
    input.tabIndex = -1;

    Array.prototype.forEach.call(wrap.querySelectorAll('label'), function (label) {
      label.style.display = 'none';
      label.setAttribute('aria-hidden', 'true');
    });

    wrap.classList.remove('wc-block-components-text-input');
    wrap.classList.add('sc-battery-city-field');

    // Always start with empty city UI; do not preselect Bogotá.
    var selectId = (input.id || 'shipping-city') + '-select';
    var cityUi = createWcSelect(
      selectId,
      cfg.cityLabel || 'Ciudad',
      cities,
      cfg.cityPlaceholder || 'Selecciona ciudad',
      ''
    );
    wrap.appendChild(cityUi.root);

    var stateSelect = findStateSelect(input);
    if (stateSelect) {
      restrictStateOptions(stateSelect);
    }

    var zoneSelect = ensureZoneField(wrap, input, cityUi.select);
    bindStateChange(stateSelect, input, cityUi.select, zoneSelect);

    cityUi.select.addEventListener('change', function () {
      var st = findStateSelect(input);
      syncAddress(
        input,
        cityUi.select.value,
        zoneSelect ? zoneSelect.value : '',
        st ? st.value : ''
      );
    });

    withPausedObserver(function () {
      updateZoneOptions(zoneSelect, stateSelect && stateSelect.dataset.scBatteryUserPicked ? stateSelect.value : '', '');
      layoutBatteryAddressFields(input);
    });
  }

  function scan() {
    if (isMutating) {
      return;
    }

    withPausedObserver(function () {
      ensureNotice();

      document
        .querySelectorAll(
          'input#shipping-city, input#billing-city, .wc-block-components-address-form input[id$="-city"]'
        )
        .forEach(function (input) {
          enhanceCityInput(input);
          if (input.dataset.scBatteryEnhanced === '1') {
            layoutBatteryAddressFields(input);
          }
        });

      document
        .querySelectorAll(
          'select#shipping-state, select#billing-state, .wc-block-components-state-input select'
        )
        .forEach(restrictStateOptions);
    });
  }

  function scheduleScan() {
    if (isMutating) {
      return;
    }
    if (scanTimer) {
      clearTimeout(scanTimer);
    }
    scanTimer = setTimeout(function () {
      scanTimer = null;
      scan();
    }, 120);
  }

  function start() {
    scan();
    observer = new MutationObserver(function () {
      if (isMutating) {
        return;
      }
      scheduleScan();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
