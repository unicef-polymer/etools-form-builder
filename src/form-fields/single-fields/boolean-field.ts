import {css, html, CSSResultArray, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {BaseField} from './base-field';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import {SlSwitch} from '@shoelace-style/shoelace';

@customElement('boolean-field')
export class BooleanField extends BaseField<boolean> {
  protected controlTemplate(): TemplateResult {
    return html`
      <sl-switch
        class="no-padding-left"
        ?checked="${this.value}"
        @sl-change="${(e: CustomEvent) => this.valueChanged((e.target as SlSwitch).checked)}"
        ?disabled="${this.isReadonly}"
      >
      </sl-switch>

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
        @media (max-width: 380px) {
          .no-padding-left {
            padding-left: 0;
          }
        }
      `
    ];
  }
}
