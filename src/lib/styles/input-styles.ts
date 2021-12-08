import {html, TemplateResult} from 'lit-element';
// language=HTML
export const InputStyles: TemplateResult = html`
  <style>
    etools-dropdown.form-control,
    etools-dropdown-multi.form-control,
    paper-input.form-control,
    paper-textarea.form-control,
    paper-dropdown-menu.form-control,
    etools-currency-amount-input.form-control,
    datepicker-lite.form-control {
      outline: none !important;
      padding: 0 12px;
      color: var(--gray-mid, rgba(0, 0, 0, 0.54));
      box-sizing: border-box;
      --esmm-placeholder-color: var(--gray-20, rgba(0, 0, 0, 0.2));
      --esmm-multi-placeholder-color: var(--gray-20, rgba(0, 0, 0, 0.2));
      --paper-input-container-color: rgba(0, 0, 0, 0.2);
      --paper-input-container-focus-color: var(--primary-color, #0099ff);
      --paper-input-container-input: {
        font-size: 16px;
        color: var(--gray-dark, rgba(0, 0, 0, 0.87));
      }
      --paper-input-container-label: {
        color: var(--gray-50, rgba(0, 0, 0, 0.5));
      }

      --paper-input-container-invalid-color: var(--module-error, #ea4022);

      --paper-input-container-disabled: {
        color: var(--gray-light, rgba(0, 0, 0, 0.38));
        opacity: 1;
      }
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
      --paper-input-container-underline: {
        border-color: rgba(0, 0, 0, 0.2) !important;
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

      --iron-autogrow-textarea-placeholder: {
        color: var(--gray-20, rgba(0, 0, 0, 0.2)) !important;
      }
      --iron-autogrow-textarea: {
        padding: 0;
      }
    }

    paper-input-container.form-control,
    etools-dropdown-multi[disabled].disabled-as-readonly.form-control,
    etools-dropdown[disabled].disabled-as-readonly.form-control,
    paper-textarea[disabled].disabled-as-readonly.form-control,
    paper-dropdown-menu[disabled].disabled-as-readonly.form-control,
    paper-input[disabled].disabled-as-readonly.form-control,
    datepicker-lite[disabled].disabled-as-readonly.form-control {
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
      --paper-input-container-color: rgba(0, 0, 0, 0.2) !important;
    }

    etools-dropdown-multi[disabled].without-border.form-control,
    etools-dropdown[disabled].without-border.form-control,
    paper-textarea[disabled].without-border.form-control,
    paper-input[disabled].without-border.form-control,
    datepicker-lite[disabled].without-border.form-control {
      --paper-input-container-label: {
        color: var(--gray-50, rgba(0, 0, 0, 0.5)) !important;
      }
      --esmm-placeholder-color: rgba(0, 0, 0, 0.16) !important;
      --esmm-multi-placeholder-color: rgba(0, 0, 0, 0.16) !important;
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
      --iron-autogrow-textarea-placeholder: {
        color: var(--gray-mid-dark, rgba(0, 0, 0, 0.7)) !important;
      }
      --paper-input-container-color: var(--gray-mid-dark, rgba(0, 0, 0, 0.7));
    }

    etools-dropdown-multi.required:not([disabled]).form-control,
    etools-dropdown-multi[required]:not([disabled]).form-control,
    etools-dropdown-multi[required].readonly-required.form-control,
    etools-dropdown.required:not([disabled]).form-control,
    etools-dropdown[required]:not([disabled]).form-control,
    etools-dropdown[required].readonly-required.form-control,
    paper-dropdown-menu.required:not([disabled]).form-control,
    paper-dropdown-menu[required]:not([disabled]).form-control,
    paper-dropdown-menu[required].readonly-required.form-control,
    paper-textarea.required:not([disabled]).form-control,
    paper-textarea[required]:not([disabled]).form-control,
    paper-textarea[required].readonly-required.form-control,
    paper-input.required:not([disabled]).form-control,
    paper-input[required].readonly-required.form-control,
    paper-input[required]:not([disabled]).form-control {
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
