import {css, CSSResultArray, html, TemplateResult} from 'lit-element';
import {BaseField} from './base-field';
import '@polymer/paper-input/paper-textarea';
import {InputStyles} from '../../lib/styles/input-styles';

export class TextField extends BaseField<string> {
  protected controlTemplate(): TemplateResult {
    return html`
      ${InputStyles}
      <paper-textarea
        id="textarea"
        class="no-padding-left form-control"
        no-label-float
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        .value="${this.value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
        placeholder="&#8212;"
        ?disabled="${this.isReadonly}"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
      >
      </paper-textarea>
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
        @media (max-width: 380px) {
          .no-padding-left {
            padding-left: 0;
          }
        }
      `
    ];
  }
}
