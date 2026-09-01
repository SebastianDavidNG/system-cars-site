(function(wp) {
  'use strict';
  /* empty css              */
const { useBlockProps: useBlockProps$2, InspectorControls, RichText: RichText$2 } = wp.blockEditor;
const { PanelBody, TextControl, TextareaControl, ColorPalette, BaseControl } = wp.components;
const { createElement: createElement$2, Fragment } = wp.element;
const THEME_COLORS$2 = {
  primary: "#ff0000",
  secondary: "#002060",
  tertiary: "#232225",
  white: "#ffffff",
  black: "#000000",
  light: "#f5f5f5",
  transparent: "transparent"
};
const THEME_PALETTE = [
  { name: "Primary", slug: "primary", color: THEME_COLORS$2.primary },
  { name: "Secondary", slug: "secondary", color: THEME_COLORS$2.secondary },
  { name: "Tertiary", slug: "tertiary", color: THEME_COLORS$2.tertiary },
  { name: "White", slug: "white", color: THEME_COLORS$2.white },
  { name: "Black", slug: "black", color: THEME_COLORS$2.black }
];
const BACKGROUND_PALETTE = [
  { name: "White", slug: "white", color: THEME_COLORS$2.white },
  { name: "Gris claro", slug: "light", color: THEME_COLORS$2.light },
  { name: "Primary", slug: "primary", color: THEME_COLORS$2.primary },
  { name: "Secondary", slug: "secondary", color: THEME_COLORS$2.secondary },
  { name: "Tertiary", slug: "tertiary", color: THEME_COLORS$2.tertiary },
  { name: "Black", slug: "black", color: THEME_COLORS$2.black },
  { name: "Transparente", slug: "transparent", color: "rgba(0,0,0,0)" }
];
function resolveColor$2(slug, fallback) {
  if (slug === "transparent") {
    return "transparent";
  }
  return THEME_COLORS$2[slug] || THEME_COLORS$2[fallback] || fallback;
}
function getColorStyles$2(attributes) {
  return {
    "--sc-contact-subtitle-color": resolveColor$2(attributes.subtitleColor, "tertiary"),
    "--sc-contact-title-color": resolveColor$2(attributes.titleColor, "black"),
    "--sc-contact-title-accent-color": resolveColor$2(attributes.titleAccentColor, "primary"),
    "--sc-contact-text-color": resolveColor$2(attributes.textColor, "tertiary"),
    "--sc-contact-bg-color": resolveColor$2(attributes.backgroundColor, "white")
  };
}
function ThemeColorControl({ label, value, onChange, help, colors }) {
  var _a;
  const palette = colors || THEME_PALETTE;
  const current = value === "transparent" ? "rgba(0,0,0,0)" : resolveColor$2(value, ((_a = palette[0]) == null ? void 0 : _a.slug) || "tertiary");
  return createElement$2(
    BaseControl,
    { label, help },
    createElement$2(ColorPalette, {
      colors: palette,
      value: current,
      disableCustomColors: true,
      clearable: false,
      onChange: (color) => {
        const match = palette.find((item) => item.color === color);
        onChange(match ? match.slug : value);
      }
    })
  );
}
function ContactInfoPreview({ attributes, setAttributes }) {
  const { subtitle, title, titleAccent, description, address, phone, email } = attributes;
  return createElement$2(
    "div",
    { className: "sc-contact__info" },
    createElement$2(RichText$2, {
      tagName: "p",
      className: "sc-contact__subtitle",
      value: subtitle,
      onChange: (value) => setAttributes({ subtitle: value }),
      placeholder: "Contáctenos"
    }),
    createElement$2(
      "h2",
      { className: "sc-contact__title" },
      createElement$2(RichText$2, {
        tagName: "span",
        className: "sc-contact__title-main",
        value: title,
        onChange: (value) => setAttributes({ title: value }),
        placeholder: "¿Tienes preguntas?",
        allowedFormats: []
      }),
      createElement$2(RichText$2, {
        tagName: "span",
        className: "sc-contact__title-accent",
        value: titleAccent,
        onChange: (value) => setAttributes({ titleAccent: value }),
        placeholder: "¡Escríbenos!",
        allowedFormats: []
      })
    ),
    createElement$2(RichText$2, {
      tagName: "p",
      className: "sc-contact__description",
      value: description,
      onChange: (value) => setAttributes({ description: value }),
      placeholder: "Descripción..."
    }),
    createElement$2(
      "ul",
      { className: "sc-contact__details" },
      createElement$2(
        "li",
        { className: "sc-contact__detail sc-contact__detail--address" },
        createElement$2("i", { className: "fa-solid fa-location-dot", "aria-hidden": "true" }),
        createElement$2(RichText$2, {
          tagName: "span",
          value: address,
          onChange: (value) => setAttributes({ address: value }),
          placeholder: "Dirección"
        })
      ),
      createElement$2(
        "li",
        { className: "sc-contact__detail sc-contact__detail--phone" },
        createElement$2("i", { className: "fa-solid fa-phone", "aria-hidden": "true" }),
        createElement$2(RichText$2, {
          tagName: "span",
          value: phone,
          onChange: (value) => setAttributes({ phone: value }),
          placeholder: "Teléfono"
        })
      ),
      createElement$2(
        "li",
        { className: "sc-contact__detail sc-contact__detail--email" },
        createElement$2("i", { className: "fa-solid fa-envelope", "aria-hidden": "true" }),
        createElement$2(RichText$2, {
          tagName: "span",
          value: email,
          onChange: (value) => setAttributes({ email: value }),
          placeholder: "Email"
        })
      )
    )
  );
}
function FormPreview({ attributes }) {
  const { buttonText, privacyText } = attributes;
  return createElement$2(
    "div",
    { className: "sc-contact__form-wrap" },
    createElement$2(
      "form",
      { className: "sc-contact__form", onSubmit: (e) => e.preventDefault() },
      createElement$2(
        "div",
        { className: "sc-contact__field" },
        createElement$2("input", {
          type: "text",
          className: "sc-contact__input",
          placeholder: "Nombre *",
          disabled: true
        })
      ),
      createElement$2(
        "div",
        { className: "sc-contact__field" },
        createElement$2("input", {
          type: "email",
          className: "sc-contact__input",
          placeholder: "Email *",
          disabled: true
        })
      ),
      createElement$2(
        "div",
        { className: "sc-contact__field" },
        createElement$2("input", {
          type: "tel",
          className: "sc-contact__input",
          placeholder: "Teléfono",
          disabled: true
        })
      ),
      createElement$2(
        "div",
        { className: "sc-contact__field" },
        createElement$2("textarea", {
          className: "sc-contact__textarea",
          placeholder: "Mensaje *",
          rows: 5,
          disabled: true
        })
      ),
      createElement$2(
        "label",
        { className: "sc-contact__privacy" },
        createElement$2("input", { type: "checkbox", disabled: true }),
        createElement$2("span", null, privacyText || "Acepto la política de privacidad del sitio.")
      ),
      createElement$2(
        "button",
        { type: "button", className: "sc-contact__submit", disabled: true },
        buttonText || "Enviar mensaje"
      )
    )
  );
}
function Edit({ attributes, setAttributes }) {
  const {
    recipientEmail,
    emailSubject,
    buttonText,
    privacyText,
    successMessage,
    errorMessage,
    phoneLink,
    subtitleColor,
    titleColor,
    titleAccentColor,
    textColor,
    backgroundColor
  } = attributes;
  const blockProps = useBlockProps$2({
    className: "sc-contact",
    style: getColorStyles$2(attributes)
  });
  return createElement$2(
    Fragment,
    null,
    createElement$2(
      InspectorControls,
      null,
      createElement$2(
        PanelBody,
        { title: "Colores (igual que What We Do)", initialOpen: true },
        createElement$2(ThemeColorControl, {
          label: "Subtítulo",
          value: subtitleColor || "tertiary",
          onChange: (value) => setAttributes({ subtitleColor: value })
        }),
        createElement$2(ThemeColorControl, {
          label: "Título (ej. ¿Tienes preguntas?)",
          value: titleColor || "black",
          onChange: (value) => setAttributes({ titleColor: value })
        }),
        createElement$2(ThemeColorControl, {
          label: "Acento del título (ej. ¡Escríbenos!)",
          help: "Color de la segunda línea del título.",
          value: titleAccentColor || "primary",
          onChange: (value) => setAttributes({ titleAccentColor: value })
        }),
        createElement$2(ThemeColorControl, {
          label: "Texto / detalles",
          value: textColor || "tertiary",
          onChange: (value) => setAttributes({ textColor: value })
        }),
        createElement$2(ThemeColorControl, {
          label: "Fondo de la sección",
          value: backgroundColor || "white",
          onChange: (value) => setAttributes({ backgroundColor: value }),
          colors: BACKGROUND_PALETTE
        })
      ),
      createElement$2(
        PanelBody,
        { title: "Envío del formulario", initialOpen: false },
        createElement$2(TextControl, {
          label: "Correo de destino",
          help: "Los mensajes del formulario llegarán a este correo.",
          type: "email",
          value: recipientEmail,
          onChange: (value) => setAttributes({ recipientEmail: value })
        }),
        createElement$2(TextControl, {
          label: "Asunto del correo",
          value: emailSubject,
          onChange: (value) => setAttributes({ emailSubject: value })
        }),
        createElement$2(TextControl, {
          label: "Texto del botón",
          value: buttonText,
          onChange: (value) => setAttributes({ buttonText: value })
        }),
        createElement$2(TextareaControl, {
          label: "Texto de privacidad",
          value: privacyText,
          onChange: (value) => setAttributes({ privacyText: value })
        }),
        createElement$2(TextControl, {
          label: "Mensaje de éxito",
          value: successMessage,
          onChange: (value) => setAttributes({ successMessage: value })
        }),
        createElement$2(TextControl, {
          label: "Mensaje de error",
          value: errorMessage,
          onChange: (value) => setAttributes({ errorMessage: value })
        })
      ),
      createElement$2(
        PanelBody,
        { title: "Enlaces de contacto", initialOpen: false },
        createElement$2(TextControl, {
          label: "Link del teléfono (tel:)",
          value: phoneLink,
          onChange: (value) => setAttributes({ phoneLink: value })
        })
      )
    ),
    createElement$2(
      "div",
      blockProps,
      createElement$2(
        "div",
        { className: "sc-contact__inner" },
        createElement$2(ContactInfoPreview, { attributes, setAttributes }),
        createElement$2(FormPreview, { attributes })
      )
    )
  );
}
const { useBlockProps: useBlockProps$1, RichText: RichText$1 } = wp.blockEditor;
const { createElement: createElement$1 } = wp.element;
const THEME_COLORS$1 = {
  primary: "#ff0000",
  secondary: "#002060",
  tertiary: "#232225",
  white: "#ffffff",
  black: "#000000",
  light: "#f5f5f5",
  transparent: "transparent"
};
function resolveColor$1(slug, fallback) {
  if (slug === "transparent") {
    return "transparent";
  }
  return THEME_COLORS$1[slug] || THEME_COLORS$1[fallback] || fallback;
}
function getColorStyles$1(attributes) {
  return {
    "--sc-contact-subtitle-color": resolveColor$1(attributes.subtitleColor, "tertiary"),
    "--sc-contact-title-color": resolveColor$1(attributes.titleColor, "black"),
    "--sc-contact-title-accent-color": resolveColor$1(attributes.titleAccentColor, "primary"),
    "--sc-contact-text-color": resolveColor$1(attributes.textColor, "tertiary"),
    "--sc-contact-bg-color": resolveColor$1(attributes.backgroundColor, "white")
  };
}
function Save({ attributes }) {
  const {
    subtitle,
    title,
    titleAccent,
    description,
    address,
    phone,
    phoneLink,
    email,
    recipientEmail,
    emailSubject,
    buttonText,
    privacyText,
    successMessage,
    errorMessage
  } = attributes;
  const blockProps = useBlockProps$1.save({
    className: "sc-contact",
    style: getColorStyles$1(attributes)
  });
  const mailTo = email ? `mailto:${email}` : void 0;
  const telHref = phoneLink || (phone ? `tel:${phone.replace(/\s+/g, "")}` : void 0);
  const hasTitle = Boolean(title || titleAccent);
  return createElement$1(
    "div",
    blockProps,
    createElement$1(
      "div",
      { className: "sc-contact__inner" },
      createElement$1(
        "div",
        { className: "sc-contact__info" },
        subtitle ? createElement$1(RichText$1.Content, {
          tagName: "p",
          className: "sc-contact__subtitle",
          value: subtitle
        }) : null,
        hasTitle ? createElement$1(
          "h2",
          { className: "sc-contact__title" },
          title ? createElement$1(RichText$1.Content, {
            tagName: "span",
            className: "sc-contact__title-main",
            value: title
          }) : null,
          titleAccent ? createElement$1(RichText$1.Content, {
            tagName: "span",
            className: "sc-contact__title-accent",
            value: titleAccent
          }) : null
        ) : null,
        description ? createElement$1(RichText$1.Content, {
          tagName: "p",
          className: "sc-contact__description",
          value: description
        }) : null,
        createElement$1(
          "ul",
          { className: "sc-contact__details" },
          address ? createElement$1(
            "li",
            { className: "sc-contact__detail sc-contact__detail--address" },
            createElement$1("i", {
              className: "fa-solid fa-location-dot",
              "aria-hidden": "true"
            }),
            createElement$1(RichText$1.Content, { tagName: "span", value: address })
          ) : null,
          phone ? createElement$1(
            "li",
            { className: "sc-contact__detail sc-contact__detail--phone" },
            createElement$1("i", {
              className: "fa-solid fa-phone",
              "aria-hidden": "true"
            }),
            telHref ? createElement$1("a", { href: telHref }, phone) : createElement$1("span", null, phone)
          ) : null,
          email ? createElement$1(
            "li",
            { className: "sc-contact__detail sc-contact__detail--email" },
            createElement$1("i", {
              className: "fa-solid fa-envelope",
              "aria-hidden": "true"
            }),
            createElement$1("a", { href: mailTo }, email)
          ) : null
        )
      ),
      createElement$1(
        "div",
        { className: "sc-contact__form-wrap" },
        createElement$1(
          "form",
          {
            className: "sc-contact__form",
            noValidate: true,
            "data-recipient": recipientEmail || "",
            "data-subject": emailSubject || "Formulario desde la web",
            "data-success": successMessage || "",
            "data-error": errorMessage || ""
          },
          createElement$1("input", {
            type: "text",
            name: "sc_hp",
            className: "sc-contact__honeypot",
            tabIndex: -1,
            autoComplete: "off",
            "aria-hidden": "true"
          }),
          createElement$1(
            "div",
            { className: "sc-contact__field" },
            createElement$1("label", { className: "screen-reader-text", htmlFor: "sc-contact-name" }, "Nombre"),
            createElement$1("input", {
              id: "sc-contact-name",
              type: "text",
              name: "name",
              className: "sc-contact__input",
              placeholder: "Nombre *",
              required: true,
              autoComplete: "name"
            })
          ),
          createElement$1(
            "div",
            { className: "sc-contact__field" },
            createElement$1("label", { className: "screen-reader-text", htmlFor: "sc-contact-email" }, "Email"),
            createElement$1("input", {
              id: "sc-contact-email",
              type: "email",
              name: "email",
              className: "sc-contact__input",
              placeholder: "Email *",
              required: true,
              autoComplete: "email"
            })
          ),
          createElement$1(
            "div",
            { className: "sc-contact__field" },
            createElement$1("label", { className: "screen-reader-text", htmlFor: "sc-contact-phone" }, "Teléfono"),
            createElement$1("input", {
              id: "sc-contact-phone",
              type: "tel",
              name: "phone",
              className: "sc-contact__input",
              placeholder: "Teléfono",
              autoComplete: "tel"
            })
          ),
          createElement$1(
            "div",
            { className: "sc-contact__field" },
            createElement$1("label", { className: "screen-reader-text", htmlFor: "sc-contact-message" }, "Mensaje"),
            createElement$1("textarea", {
              id: "sc-contact-message",
              name: "message",
              className: "sc-contact__textarea",
              placeholder: "Mensaje *",
              rows: 5,
              required: true
            })
          ),
          createElement$1(
            "label",
            { className: "sc-contact__privacy" },
            createElement$1("input", {
              type: "checkbox",
              name: "privacy",
              required: true
            }),
            createElement$1("span", null, privacyText || "Acepto la política de privacidad del sitio.")
          ),
          createElement$1(
            "div",
            {
              className: "sc-contact__feedback",
              role: "status",
              "aria-live": "polite",
              hidden: true
            }
          ),
          createElement$1(
            "button",
            { type: "submit", className: "sc-contact__submit" },
            buttonText || "Enviar mensaje"
          )
        )
      )
    )
  );
}
const { registerBlockType } = wp.blocks;
const { createElement } = wp.element;
const { useBlockProps, RichText } = wp.blockEditor;
const THEME_COLORS = {
  primary: "#ff0000",
  secondary: "#002060",
  tertiary: "#232225",
  white: "#ffffff",
  black: "#000000",
  light: "#f5f5f5",
  transparent: "transparent"
};
function resolveColor(slug, fallback) {
  if (slug === "transparent") {
    return "transparent";
  }
  return THEME_COLORS[slug] || THEME_COLORS[fallback] || fallback;
}
function getColorStyles(attributes) {
  return {
    "--sc-contact-subtitle-color": resolveColor(attributes.subtitleColor, "tertiary"),
    "--sc-contact-title-color": resolveColor(attributes.titleColor, "black"),
    "--sc-contact-title-accent-color": resolveColor(attributes.titleAccentColor, "primary"),
    "--sc-contact-text-color": resolveColor(attributes.textColor, "tertiary"),
    "--sc-contact-bg-color": resolveColor(attributes.backgroundColor, "white")
  };
}
function splitLegacyTitle(title) {
  const raw = title || "";
  const strongMatch = raw.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
  const accent = strongMatch ? strongMatch[1].replace(/<[^>]+>/g, "").trim() : "";
  const main = raw.replace(/<strong[^>]*>[\s\S]*?<\/strong>/gi, "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return {
    title: main || "¿Tienes preguntas?",
    titleAccent: accent || "¡Escríbenos!"
  };
}
function buildForm(attributes) {
  const {
    recipientEmail,
    emailSubject,
    buttonText,
    privacyText,
    successMessage,
    errorMessage
  } = attributes;
  return createElement(
    "div",
    { className: "sc-contact__form-wrap" },
    createElement(
      "form",
      {
        className: "sc-contact__form",
        noValidate: true,
        "data-recipient": recipientEmail || "",
        "data-subject": emailSubject || "Formulario desde la web",
        "data-success": successMessage || "",
        "data-error": errorMessage || ""
      },
      createElement("input", {
        type: "text",
        name: "sc_hp",
        className: "sc-contact__honeypot",
        tabIndex: -1,
        autoComplete: "off",
        "aria-hidden": "true"
      }),
      createElement(
        "div",
        { className: "sc-contact__field" },
        createElement("label", { className: "screen-reader-text", htmlFor: "sc-contact-name" }, "Nombre"),
        createElement("input", {
          id: "sc-contact-name",
          type: "text",
          name: "name",
          className: "sc-contact__input",
          placeholder: "Nombre *",
          required: true,
          autoComplete: "name"
        })
      ),
      createElement(
        "div",
        { className: "sc-contact__field" },
        createElement("label", { className: "screen-reader-text", htmlFor: "sc-contact-email" }, "Email"),
        createElement("input", {
          id: "sc-contact-email",
          type: "email",
          name: "email",
          className: "sc-contact__input",
          placeholder: "Email *",
          required: true,
          autoComplete: "email"
        })
      ),
      createElement(
        "div",
        { className: "sc-contact__field" },
        createElement("label", { className: "screen-reader-text", htmlFor: "sc-contact-phone" }, "Teléfono"),
        createElement("input", {
          id: "sc-contact-phone",
          type: "tel",
          name: "phone",
          className: "sc-contact__input",
          placeholder: "Teléfono",
          autoComplete: "tel"
        })
      ),
      createElement(
        "div",
        { className: "sc-contact__field" },
        createElement("label", { className: "screen-reader-text", htmlFor: "sc-contact-message" }, "Mensaje"),
        createElement("textarea", {
          id: "sc-contact-message",
          name: "message",
          className: "sc-contact__textarea",
          placeholder: "Mensaje *",
          rows: 5,
          required: true
        })
      ),
      createElement(
        "label",
        { className: "sc-contact__privacy" },
        createElement("input", {
          type: "checkbox",
          name: "privacy",
          required: true
        }),
        createElement("span", null, privacyText || "Acepto la política de privacidad del sitio.")
      ),
      createElement(
        "div",
        {
          className: "sc-contact__feedback",
          role: "status",
          "aria-live": "polite",
          hidden: true
        }
      ),
      createElement(
        "button",
        { type: "submit", className: "sc-contact__submit" },
        buttonText || "Enviar mensaje"
      )
    )
  );
}
function buildInfoLegacySingleTitle(attributes) {
  const { subtitle, title, description, address, phone, phoneLink, email } = attributes;
  const mailTo = email ? `mailto:${email}` : void 0;
  const telHref = phoneLink || (phone ? `tel:${String(phone).replace(/\s+/g, "")}` : void 0);
  return createElement(
    "div",
    { className: "sc-contact__info" },
    subtitle ? createElement(RichText.Content, {
      tagName: "p",
      className: "sc-contact__subtitle",
      value: subtitle
    }) : null,
    title ? createElement(RichText.Content, {
      tagName: "h2",
      className: "sc-contact__title",
      value: title
    }) : null,
    description ? createElement(RichText.Content, {
      tagName: "p",
      className: "sc-contact__description",
      value: description
    }) : null,
    createElement(
      "ul",
      { className: "sc-contact__details" },
      address ? createElement(
        "li",
        { className: "sc-contact__detail sc-contact__detail--address" },
        createElement("i", {
          className: "fa-solid fa-location-dot",
          "aria-hidden": "true"
        }),
        createElement(RichText.Content, { tagName: "span", value: address })
      ) : null,
      phone ? createElement(
        "li",
        { className: "sc-contact__detail sc-contact__detail--phone" },
        createElement("i", {
          className: "fa-solid fa-phone",
          "aria-hidden": "true"
        }),
        telHref ? createElement("a", { href: telHref }, phone) : createElement("span", null, phone)
      ) : null,
      email ? createElement(
        "li",
        { className: "sc-contact__detail sc-contact__detail--email" },
        createElement("i", {
          className: "fa-solid fa-envelope",
          "aria-hidden": "true"
        }),
        createElement("a", { href: mailTo }, email)
      ) : null
    )
  );
}
const sharedLegacyAttrs = {
  subtitle: { type: "string" },
  title: { type: "string" },
  description: { type: "string" },
  address: { type: "string" },
  phone: { type: "string" },
  phoneLink: { type: "string" },
  email: { type: "string" },
  recipientEmail: { type: "string" },
  emailSubject: { type: "string" },
  buttonText: { type: "string" },
  privacyText: { type: "string" },
  successMessage: { type: "string" },
  errorMessage: { type: "string" }
};
registerBlockType("system-cars/contact", {
  edit: Edit,
  save: Save,
  deprecated: [
    // v1.1 — colors + single combined title
    {
      attributes: {
        ...sharedLegacyAttrs,
        subtitleColor: { type: "string", default: "tertiary" },
        titleColor: { type: "string", default: "black" },
        titleAccentColor: { type: "string", default: "primary" },
        textColor: { type: "string", default: "tertiary" },
        backgroundColor: { type: "string", default: "white" }
      },
      migrate(attributes) {
        return {
          ...attributes,
          ...splitLegacyTitle(attributes.title)
        };
      },
      save({ attributes }) {
        const blockProps = useBlockProps.save({
          className: "sc-contact",
          style: getColorStyles(attributes)
        });
        return createElement(
          "div",
          blockProps,
          createElement(
            "div",
            { className: "sc-contact__inner" },
            buildInfoLegacySingleTitle(attributes),
            buildForm(attributes)
          )
        );
      }
    },
    // v1.0 — no color styles, single title
    {
      attributes: sharedLegacyAttrs,
      migrate(attributes) {
        return {
          ...attributes,
          ...splitLegacyTitle(attributes.title),
          subtitleColor: "tertiary",
          titleColor: "black",
          titleAccentColor: "primary",
          textColor: "tertiary",
          backgroundColor: "white"
        };
      },
      save({ attributes }) {
        const blockProps = useBlockProps.save({
          className: "sc-contact"
        });
        return createElement(
          "div",
          blockProps,
          createElement(
            "div",
            { className: "sc-contact__inner" },
            buildInfoLegacySingleTitle(attributes),
            buildForm(attributes)
          )
        );
      }
    }
  ]
});

})(window.wp || {});