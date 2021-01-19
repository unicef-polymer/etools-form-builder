import {css, CSSResultArray, html, TemplateResult} from 'lit-element';
import {BaseField} from './base-field';
import '@polymer/paper-input/paper-input';
import {InputStyles} from '../../lib/styles/input-styles';

export class NumberField extends BaseField<number> {
  protected controlTemplate(): TemplateResult {
    return html`
      ${InputStyles}
      <paper-input
        class="without-border no-padding-left form-control"
        no-label-float
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        .value="${this.value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
        placeholder="&#8212;"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
        ?disabled="${this.isReadonly}"
      >
      </paper-input>
    `;
  }

  protected valueChanged(newValue: number): void {
    const formatted: number = Number(newValue);
    const isNumber: boolean = !isNaN(formatted) && `${newValue}` !== '' && `${newValue}` !== 'null';
    super.valueChanged(isNumber ? formatted : newValue);
  }

  protected customValidation(value: number): string | null {
    return value && isNaN(value) ? 'Must be a number' : null;
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
