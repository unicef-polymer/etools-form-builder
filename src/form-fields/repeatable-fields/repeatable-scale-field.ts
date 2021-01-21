import {html, TemplateResult, property, CSSResultArray, css} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import '@polymer/paper-radio-group/paper-radio-group';
import '@polymer/paper-radio-button/paper-radio-button';
import {PaperRadioButtonElement} from '@polymer/paper-radio-button/paper-radio-button';
import {InputStyles} from '../../lib/styles/input-styles';
import {RepeatableBaseField} from './repeatable-base-field';
import {AbstractFieldBaseClass} from '../abstract-field-base.class';
import {FieldOption} from '..';

export class RepeatableScaleField extends RepeatableBaseField<string | null> {
  @property({type: Array}) options: FieldOption[] = [];
  protected controlTemplate(value: string | null, index: number): TemplateResult {
    return html`
      ${InputStyles}
      <div class="container">
        <paper-radio-group
          class="radio-group"
          selected="${value}"
          @iron-select="${({detail}: CustomEvent) => this.onSelect(detail.item, index)}"
        >
          ${repeat(
            this.options,
            (option: FieldOption) => html`
              <paper-radio-button class="radio-button" name="${option.value}"> ${option.label} </paper-radio-button>
            `
          )}
        </paper-radio-group>

        <paper-button
          ?hidden="${this.isReadonly}"
          @click="${() => this.valueChanged(null, index)}"
          class="clear-button"
        >
          <iron-icon icon="clear"></iron-icon>Clear
        </paper-button>
      </div>
    `;
  }

  protected onSelect(item: PaperRadioButtonElement, index: number): void {
    const newValue: string = item.get('name');
    this.valueChanged(newValue, index);
  }

  protected customValidation(): string | null {
    return null;
  }

  static get styles(): CSSResultArray {
    // language=CSS
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
