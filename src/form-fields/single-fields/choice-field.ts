import {css, CSSResultArray, html, TemplateResult} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {BaseField} from './base-field';
import {repeat} from 'lit/directives/repeat.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-checkbox/etools-checkbox';
import {getTranslation} from '../../lib/utils/translate';

export type ChoiceFieldOption = {
  value: any;
  label: string;
  disabled?: boolean;
};

@customElement('choice-field')
export class ChoiceField extends BaseField<(string | number)[] | null> {
  @property({type: Array}) options: (ChoiceFieldOption | string | number)[] = [];

  protected controlTemplate(): TemplateResult {
    return html`
      <div class="container">
        <div class="checkbox-group">
          ${repeat(this.options, (option: ChoiceFieldOption | string | number) => {
            const val = this.getValue(option) as any;
            const checked = Array.isArray(this.value) && this.value.includes(val);
            return html`
              <etools-checkbox
                class="checkbox"
                value="${val}"
                ?checked="${checked}"
                ?disabled="${this.isReadonly || this.getDisabled(option)}"
                @sl-change="${(e: any) => this.onToggle(val, e.target.checked)}"
              >
                ${this.getLabel(option)}
              </etools-checkbox>
            `;
          })}
        </div>

        <etools-button
          class="neutral clear-button"
          variant="text"
          ?hidden="${this.isReadonly}"
          @click="${() => this.valueChanged([])}"
        >
          <etools-icon name="clear" slot="prefix"></etools-icon>
          ${getTranslation(this.language, 'CLEAR')}
        </etools-button>
      </div>

      <div ?hidden="${!this.errorMessage}" class="error-text">${this.errorMessage}</div>
    `;
  }

  protected getLabel(option: ChoiceFieldOption | string | number): unknown {
    return typeof option === 'object' ? option.label : option;
  }

  protected getValue(option: ChoiceFieldOption | string | number): unknown {
    return typeof option === 'object' ? option.value : option;
  }

  protected getDisabled(option: ChoiceFieldOption | string | number): unknown {
    return typeof option === 'object' ? option.disabled : false;
  }

  protected onToggle(itemValue: string | number, checked: boolean): void {
    this.touched = true;
    let newValue = Array.isArray(this.value) ? [...this.value] : [];

    if (checked) {
      if (!newValue.includes(itemValue)) {
        newValue.push(itemValue);
      }
    } else {
      newValue = newValue.filter((v) => v !== itemValue);
    }

    this.valueChanged(newValue);
  }

  protected customValidation(): string | null {
    return null;
  }

  static get styles(): CSSResultArray {
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

        .checkbox-group {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        :host([is-readonly]) .checkbox-group {
          pointer-events: none;
          opacity: 0.55;
        }

        @media (max-width: 1080px) {
          .container {
            flex-direction: column;
            align-items: flex-start;
          }
          .checkbox-group {
            flex-direction: column;
          }
          .checkbox {
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
