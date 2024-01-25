import {css, html, CSSResultArray, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {BaseField} from './base-field';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import {InputStyles} from '../../lib/styles/input-styles';
import {getTranslation} from '../../lib/utils/translate';

@customElement('number-field')
export class NumberField extends BaseField<number> {
  isInteger: boolean = false;
  protected controlTemplate(): TemplateResult {
    return html`
      ${InputStyles}
      <etools-input
        class="no-padding-left"
        no-label-float
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        .value="${this.value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
        @focus="${() => (this.touched = true)}"
        placeholder="&#8212;"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
        ?readonly="${this.isReadonly}"
      >
      </etools-input>
    `;
  }

  protected valueChanged(newValue: number): void {
    const formatted: number = Number(newValue);
    const isNumber: boolean = !isNaN(formatted) && `${newValue}` !== '' && `${newValue}` !== 'null';
    super.valueChanged(isNumber ? formatted : newValue);
  }

  protected customValidation(value: number): string | null {
    if (!value) {
      return null;
    }
    if (isNaN(value)) {
      return getTranslation(this.language, 'MUST_BE_NUMBER');
    }
    const integerValidation: boolean = !this.isInteger || value - Math.floor(value) === 0;
    return integerValidation ? null : getTranslation(this.language, 'MUST_BE_INTEGER');
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
