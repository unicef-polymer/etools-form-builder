import {css, html, CSSResultArray, TemplateResult} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import {buttonsStyles} from '@unicef-polymer/etools-unicef/src/styles/button-styles';
import {InputStyles} from '../../lib/styles/input-styles';
import {RepeatableBaseField} from './repeatable-base-field';
import {getTranslation} from '../../lib/utils/translate';
import {AbstractFieldBaseClass} from '../abstract-field-base.class';
import {FieldOption} from '..';

@customElement('repeatable-scale-field')
export class RepeatableScaleField extends RepeatableBaseField<string | number | null> {
  @property({type: Array}) options: (FieldOption | string | number)[] = [];
  protected controlTemplate(value: string | null, index: number): TemplateResult {
    return html`
      ${InputStyles}
      <div class="container">
        <sl-radio-group
          class="radio-group"
          .value="${value}"
          @sl-change="${(e: any) => this.onSelect(e.target.value, index)}"
        >
          ${repeat(
            this.options,
            (option: FieldOption | string | number) => html`
              <sl-radio class="radio-button" value="${this.getValue(option)}"> ${this.getLabel(option)} </sl-radio>
            `
          )}
        </sl-radio-group>
        <sl-button
          variant="primary"
          ?hidden="${this.isReadonly}"
          @click="${() => this.valueChanged(null, index)}"
          class="clear-button"
        >
          <etools-icon name="clear" slot="prefix"></etools-icon>
          ${getTranslation(this.language, 'CLEAR')}
        </sl-button>
      </div>
    `;
  }

  protected onSelect(itemValue: string, index: number): void {
    this.valueChanged(itemValue, index);
  }

  protected getLabel(option: FieldOption | string | number): unknown {
    return typeof option === 'object' ? option.label : option;
  }

  protected getValue(option: FieldOption | string | number): unknown {
    return typeof option === 'object' ? option.value : option;
  }

  protected customValidation(): string | null {
    return null;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      ...AbstractFieldBaseClass.styles,
      buttonsStyles,
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

        :host([is-readonly]) paper-radio-group {
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
