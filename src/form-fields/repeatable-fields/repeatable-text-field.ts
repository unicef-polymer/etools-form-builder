import {css, CSSResultArray, html, TemplateResult} from 'lit-element';
import '@polymer/paper-input/paper-textarea';
import {InputStyles} from '../../lib/styles/input-styles';
import {RepeatableBaseField} from './repeatable-base-field';
import {AbstractFieldBaseClass} from '../abstract-field-base.class';

export class RepeatableTextField extends RepeatableBaseField<string> {
  protected controlTemplate(value: string | null, index: number): TemplateResult {
    return html`
      ${InputStyles}
      <paper-textarea
        id="textarea"
        class="no-padding-left form-control"
        no-label-float
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        .value="${value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value, index)}"
        ?disabled="${this.isReadonly}"
        ?invalid="${this.errorMessage[index]}"
        error-message="${this.errorMessage[index]}"
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
