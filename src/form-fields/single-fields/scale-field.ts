import {css, CSSResultArray, html, TemplateResult} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {BaseField} from './base-field';
import {repeat} from 'lit/directives/repeat.js';
import '@unicef-polymer/etools-unicef/src/etools-radio/etools-radio-group';

import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import {getTranslation} from '../../lib/utils/translate';

export type FieldOption = {
  value: any;
  label: string;
};

@customElement('scale-field')
export class ScaleField extends BaseField<string | number | null> {
  @property({type: Array}) options: (FieldOption | string | number)[] = [];
  protected controlTemplate(): TemplateResult {
    return html`
      <div class="container">
        <etools-radio-group
          class="radio-group"
          .value="${this.value}"
          @sl-change="${(e: any) => this.onSelect(e.target.value)}"
        >
          ${repeat(
            this.options,
            (option: FieldOption | string | number) => html`
              <sl-radio class="radio-button" value="${this.getValue(option)}">${this.getLabel(option)}</sl-radio>
            `
          )}
        </etools-radio-group>
        <etools-button
          class="neutral clear-button"
          variant="text"
          ?hidden="${this.isReadonly}"
          @click="${() => this.valueChanged(null)}"
        >
          <etools-icon name="clear" slot="prefix"></etools-icon>
          ${getTranslation(this.language, 'CLEAR')}
        </etools-button>
      </div>
      <div ?hidden="${!this.errorMessage}" class="error-text">${this.errorMessage}</div>
    `;
  }

  protected getLabel(option: FieldOption | string | number): unknown {
    return typeof option === 'object' ? option.label : option;
  }

  protected getValue(option: FieldOption | string | number): unknown {
    return typeof option === 'object' ? option.value : option;
  }

  protected onSelect(itemValue: string): void {
    if (itemValue !== this.value) {
      this.touched = true;
    }
    this.valueChanged(itemValue);
  }

  protected customValidation(): string | null {
    return null;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      ...BaseField.styles,
      css`
        .container {
          position: relative;
          min-height: 48px;
          display: flex;
          align-items: center;
          flex-direction: row;
        }

        .radio-group {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        :host([is-readonly]) etools-radio-group {
          pointer-events: none;
          opacity: 0.55;
        }

        @media (max-width: 1080px) {
          .container {
            flex-direction: column;
            align-items: flex-start;
          }
          .radio-group {
            flex-direction: column;
          }
          .radio-button {
            padding-left: 3px;
          }
          .clear-button {
            margin: 0;
            padding-left: 0;
          }
        }
      `
    ];
  }
}
