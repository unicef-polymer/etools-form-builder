import {css, html, CSSResultArray, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {InputStyles} from '../../lib/styles/input-styles';
import {RepeatableBaseField} from './repeatable-base-field';
import {AbstractFieldBaseClass} from '../abstract-field-base.class';

@customElement('repeatable-text-field')
export class RepeatableTextField extends RepeatableBaseField<string> {
  protected controlTemplate(value: string | null, index: number): TemplateResult {
    return html`
      ${InputStyles}
      <etools-textarea
        id="textarea"
        class="no-padding-left"
        no-label-float
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        .value="${value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value, index)}"
        ?readonly="${this.isReadonly}"
        ?invalid="${this.errorMessage[index]}"
        error-message="${this.errorMessage[index]}"
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
      ...AbstractFieldBaseClass.styles,
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
