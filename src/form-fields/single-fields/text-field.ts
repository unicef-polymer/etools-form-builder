import {css, CSSResultArray, html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {BaseField} from './base-field';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';

@customElement('text-field')
export class TextField extends BaseField<string> {
  protected controlTemplate(): TemplateResult {
    return html`
      <etools-textarea
        id="otherInfo"
        class="no-padding-left"
        no-label-float
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        .value="${this.value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
        @focus="${() => (this.touched = true)}"
        ?readonly="${this.isReadonly}"
        ?invalid="${this.errorMessage}"
        name="${this.name}"
        error-message="${this.errorMessage}"
      >
      </etools-textarea>
    `;
  }

  protected customValidation(): string | null {
    return null;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      ...BaseField.styles,
      css`
        :host(.wide) etools-textarea {
          padding-left: 0;
        }
        etools-textarea[name='overall']::part(form-control-input)::after {
            border-bottom: 0;
        }
        etools-textarea[name='overall']:not([readonly])::part(textarea) {
            background-color: white;
            border: solid 1px #000000;
        }
        @media (max-width: 380px) {
          .no-padding-left {
            padding-left: 0;
          }
        }
      `
    ];
  }
}
