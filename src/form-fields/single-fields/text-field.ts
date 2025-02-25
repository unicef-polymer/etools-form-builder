import {css, CSSResultArray, html, PropertyValues, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {BaseField} from './base-field';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '../../rich-editor/rich-text';

@customElement('text-field')
export class TextField extends BaseField<string> {
  @property() protected originalValue: string | null = null;

  protected controlTemplate(): TemplateResult {
    return this.showRichEditor
      ? html`<div class="finding-container no-padding-left">
          <rich-text
            .value="${this.originalValue}"
            ?readonly="${this.isReadonly}"
            @editor-changed="${({detail}: CustomEvent) => {
              if (detail.value !== this.value) {
                this.valueChanged(detail.value);
              }
            }}"
          ></rich-text>
        </div>`
      : html`
          <etools-textarea
            id="otherInfo"
            class="no-padding-left"
            no-label-float
            placeholder="${this.isReadonly ? '—' : this.placeholder}"
            .value="${this.value}"
            @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
            @focus="${() => (this.touched = true)}"
            ?readonly="${this.isReadonly}"
            ?invalid="${this.errorMessage}"
            name="${this.name}"
            error-message="${this.errorMessage}"
          >
          </etools-textarea>
        `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('readonly-changed', this.handleReadonlyChange.bind(this) as any);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('readonly-changed', this.handleReadonlyChange.bind(this) as any);
  }

  handleReadonlyChange(_e: CustomEvent): void {
    // for rich editor need to reset the value here because of the logic below
    if (this.showRichEditor && this.originalValue !== this.value) {
      this.originalValue = this.value;
    }
  }

  updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    // set control value only at the beginning with a proxy param (originalValue),
    // avoid requestUpdate when .value change because will move carret
    if (changedProperties.has('value') && this.originalValue === null) {
      this.originalValue = this.value;
    }
  }

  protected customValidation(): string | null {
    return null;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      ...BaseField.styles,
      css`
        :host(.wide) etools-textarea {
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
