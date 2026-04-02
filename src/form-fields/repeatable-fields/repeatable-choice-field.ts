import {css, html, CSSResultArray, TemplateResult} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-checkbox/etools-checkbox';

import {RepeatableBaseField} from './repeatable-base-field';
import {getTranslation} from '../../lib/utils/translate';
import {AbstractFieldBaseClass} from '../abstract-field-base.class';
import {FieldOption} from '..';

@customElement('repeatable-choice-field')
export class RepeatableChoiceField extends RepeatableBaseField<(string | number)[] | null> {
  @property({type: Array}) options: (FieldOption | string | number)[] = [];
  @property({type: Array}) values: any[] = [];

  protected controlTemplate(value: (string | number)[] | null, index: number): TemplateResult {
    return html`
      <div class="container">
        <div class="checkbox-group">
          ${repeat(this.options, (option: FieldOption | string | number) => {
            const val = this.getValue(option) as any;
            const checked = Array.isArray(value) && value.includes(val);
            return html`
              <etools-checkbox
                class="checkbox"
                value="${val}"
                ?checked="${checked}"
                ?disabled="${this.isReadonly || this.getDisabled(option)}"
                @sl-change="${(e: any) => this.onToggle(val, e.target.checked, index)}"
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
          @click="${() => this.valueChanged([], index)}"
        >
          <etools-icon name="clear" slot="prefix"></etools-icon>
          ${getTranslation(this.language, 'CLEAR')}
        </etools-button>
      </div>
    `;
  }

  protected onToggle(itemValue: string | number, checked: boolean, index: number): void {
    let current = Array.isArray(this.values[index]) ? [...(this.values[index] as (string | number)[])] : [];

    if (checked) {
      if (!current.includes(itemValue)) {
        current.push(itemValue);
      }
    } else {
      current = current.filter((v) => v !== itemValue);
    }

    this.valueChanged(current, index);
  }

  protected getLabel(option: FieldOption | string | number): unknown {
    return typeof option === 'object' ? option.label : option;
  }

  protected getValue(option: FieldOption | string | number): unknown {
    return typeof option === 'object' ? option.value : option;
  }

  protected getDisabled(option: FieldOption | string | number): unknown {
    return typeof option === 'object' ? option.disabled : false;
  }

  protected customValidation(): string | null {
    return null;
  }

  static get styles(): CSSResultArray {
    return [
      ...AbstractFieldBaseClass.styles,
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
