import {html, TemplateResult} from 'lit-element';
// language=HTML
export const InputStyles: TemplateResult = html`
  <style>
    etools-dropdown,
    etools-dropdown-multi,
    paper-input,
    paper-textarea,
    paper-dropdown-menu,
    etools-currency-amount-input,
    datepicker-lite {
      outline: none !important;
      padding: 0 12px;
      color: var(--gray-dark, rgba(0, 0, 0, 0.87));
      box-sizing: border-box;

      --paper-input-container-input-color: var(--gray-dark, rgba(0, 0, 0, 0.87));
      --esmm-placeholder-color: var(--gray-dark, rgba(0, 0, 0, 0.87));
      --esmm-multi-placeholder-color: var(--gray-dark, rgba(0, 0, 0, 0.87));

      --paper-input-container-focus-color: var(--primary-color, #0099ff);

      --paper-input-container-label: {
        color: var(--gray-50, rgba(0, 0, 0, 0.5));
      }

      --paper-input-container-invalid-color: var(--module-error, #ea4022);

      --paper-input-char-counter: {
        color: var(--gray-light, rgba(0, 0, 0, 0.38));
      }

      --paper-input-container-label-floating: {
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        -o-transform: none;
        transform: none;
        top: -21px;
        width: 100%;
        font-size: 12px;
      }

      --etools-currency-container-label-floating: {
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        -o-transform: none;
        transform: none;
        top: -21px;
        width: 100%;
        font-size: 12px;
      }

      --paper-input-container-shared-input-style: {
        font-size: 16px;
        width: 100%;
      }

      --paper-input-prefix: {
        margin-right: 10px;
        color: var(--gray-mid, rgba(0, 0, 0, 0.54));
      }

      --paper-input-error: {
        overflow: hidden;
      }

      --iron-autogrow-textarea: {
        padding: 0;
      }
    }

    etools-dropdown-multi[disabled],
    etools-dropdown[disabled],
    paper-textarea[disabled],
    paper-dropdown-menu[disabled],
    paper-input[disabled],
    datepicker-lite[disabled] {
      --paper-input-container-focus-color: var(
        --paper-input-container-label_-_color,
        var(--paper-input-container-color, var(--secondary-text-color))
      );
      --paper-input-container: {
        opacity: 1 !important;
      }
      --paper-input-container-underline: {
        border-bottom: 1px dashed;
        display: block !important;
      }
      --paper-input-container-underline-focus: {
        display: none;
      }
    }

    etools-dropdown-multi[readonly],
    etools-dropdown[readonly],
    paper-textarea[readonly],
    paper-dropdown-menu[readonly],
    paper-input[readonly],
    datepicker-lite[readonly] {
      --paper-input-container-focus-color: var(
        --paper-input-container-label_-_color,
        var(--paper-input-container-color, var(--secondary-text-color))
      );
      --paper-input-container: {
        opacity: 1 !important;
      }
      --paper-input-container-underline: {
        border-bottom: none !important;
        display: none !important;
      }
      --paper-input-container-underline-focus: {
        display: none;
      }
      --paper-input-container-underline-disabled: {
        display: none;
      }
    }

    etools-dropdown-multi.required:not([disabled]),
    etools-dropdown-multi[required]:not([disabled]),
    etools-dropdown-multi[required].readonly-required,
    etools-dropdown.required:not([disabled]),
    etools-dropdown[required]:not([disabled]),
    etools-dropdown[required].readonly-required,
    paper-dropdown-menu.required:not([disabled]),
    paper-dropdown-menu[required]:not([disabled]),
    paper-dropdown-menu[required].readonly-required,
    paper-textarea.required:not([disabled]),
    paper-textarea[required]:not([disabled]),
    paper-textarea[required].readonly-required,
    paper-input.required:not([disabled]),
    paper-input[required].readonly-required,
    paper-input[required]:not([disabled]) {
      --paper-input-container-label: {
        background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221235%22%20height%3D%221175%22%3E%3Cpath%20fill%3D%22%23de0000%22%20d%3D%22M0%2C449h1235l-999%2C726%20382-1175%20382%2C1175z%22%2F%3E%3C%2Fsvg%3E')
          no-repeat 98% 14%/7px;
        width: auto !important;
        max-width: max-content;
        right: auto;
        padding-right: 15px;
        color: var(--gray-50, rgba(0, 0, 0, 0.5));
      }
    }
  </style>
`;
