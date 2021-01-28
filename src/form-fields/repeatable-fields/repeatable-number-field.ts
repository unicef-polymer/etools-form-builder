import {css, CSSResultArray, html, TemplateResult} from 'lit-element';
import '@polymer/paper-input/paper-input';
import {InputStyles} from '../../lib/styles/input-styles';
import {RepeatableBaseField} from './repeatable-base-field';
import {AbstractFieldBaseClass} from '../abstract-field-base.class';

export class RepeatableNumberField extends RepeatableBaseField<number> {
  isInteger: boolean = false;
  protected controlTemplate(value: number | null, index: number): TemplateResult {
    return html`
      ${InputStyles}
      <paper-input
        class="without-border no-padding-left form-control"
        no-label-float
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        .value="${value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value, index)}"
        placeholder="&#8212;"
        ?invalid="${this.errorMessage[index]}"
        error-message="${this.errorMessage[index]}"
        ?disabled="${this.isReadonly}"
      >
      </paper-input>
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
      return 'Must be a number';
    }
    const integerValidation: boolean = !this.isInteger || value - Math.floor(value) === 0;
    return integerValidation ? null : 'Must be an integer';
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
