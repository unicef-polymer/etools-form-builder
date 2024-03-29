import {css, CSSResultArray, customElement, html, TemplateResult} from 'lit-element';
import {BaseField} from './base-field';
import '@polymer/paper-toggle-button';
import {InputStyles} from '../../lib/styles/input-styles';
import {PaperToggleButtonElement} from '@polymer/paper-toggle-button/paper-toggle-button';

@customElement('boolean-field')
export class BooleanField extends BaseField<boolean> {
  protected controlTemplate(): TemplateResult {
    return html`
      ${InputStyles}
      <paper-toggle-button
        class="no-padding-left"
        ?checked="${this.value}"
        @iron-change="${(event: CustomEvent) =>
          this.valueChanged((event.currentTarget as PaperToggleButtonElement).checked as boolean)}"
        ?readonly="${this.isReadonly}"
      >
      </paper-toggle-button>

      <div ?hidden="${!this.errorMessage}" class="error-text">${this.errorMessage}</div>
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
        :host(.wide) paper-textarea {
          padding-left: 0;
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
