import {css, html, CSSResultArray, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import {RepeatableBaseField} from './repeatable-base-field';
import {AbstractFieldBaseClass} from '../abstract-field-base.class';
import {getTranslation} from '../../lib/utils/translate';

@customElement('repeatable-number-field')
export class RepeatableNumberField extends RepeatableBaseField<number> {
  isInteger: boolean = false;
  protected controlTemplate(value: number | null, index: number): TemplateResult {
    return html`
      <etools-input
        class="no-padding-left"
        no-label-float
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        .value="${value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value, index)}"
        placeholder="&#8212;"
        ?invalid="${this.errorMessage[index]}"
        error-message="${this.errorMessage[index]}"
        ?readonly="${this.isReadonly}"
      >
      </etools-input>
    `;
  }

  protected valueChanged(newValue: number, index: number): void {
    const formatted: number = Number(newValue);
    const isNumber: boolean = !isNaN(formatted) && `${newValue}` !== '' && `${newValue}` !== 'null';
    super.valueChanged(isNumber ? formatted : newValue, index);
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
      ...AbstractFieldBaseClass.styles,
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
