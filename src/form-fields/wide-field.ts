import {html, TemplateResult, property, CSSResultArray} from 'lit-element';
import '@polymer/paper-input/paper-textarea';
import {InputStyles} from '../lib/styles/input-styles';
import {BaseField} from './single-fields/base-field';

export class WideField extends BaseField<string> {
  @property() label: string = '';
  @property() placeholder: string = '';
  protected render(): TemplateResult {
    return html`
      ${InputStyles}
      <paper-textarea
        class="wide-input"
        always-float-label
        .value="${this.value}"
        label="${this.label}"
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        ?required="${this.required}"
        ?readonly="${this.isReadonly}"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
      >
      </paper-textarea>
    `;
  }

  protected controlTemplate(): TemplateResult {
    return html``;
  }

  protected customValidation(): string | null {
    return null;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [...BaseField.styles];
  }
}
