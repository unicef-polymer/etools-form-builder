import {CSSResultArray, LitElement, property, css, html, TemplateResult} from 'lit-element';
import {FieldValidator, validate} from '../lib/utils/validations.helper';
import {FlexLayoutClasses} from '../lib/styles/flex-layout-classes';

/**
 * Class that contains common properties and methods for single and repeatable fields
 */
export abstract class AbstractFieldBaseClass<T> extends LitElement {
  @property({type: String}) questionText: string = '';
  @property({type: Boolean, attribute: 'is-readonly'}) set isReadonly(readonly: boolean) {
    this._readonly = readonly;
    this.setDefaultValue(readonly, this._defaultValue);
    this.requestUpdate();
  }
  get isReadonly(): boolean {
    return this._readonly;
  }
  @property({type: Boolean, attribute: 'required'}) required: boolean = false;
  @property() placeholder: string = '';
  @property() value: T | null = null;
  validators: FieldValidator[] = [];
  touched: boolean = false;
  set defaultValue(value: any) {
    this._defaultValue = value;
    this.setDefaultValue(this._readonly, value);
    this.requestUpdate();
  }
  private _defaultValue: any;
  private _readonly: boolean = false;

  protected render(): TemplateResult {
    return html`
      <div class="finding-container">
        <div class="question"><slot>${this.questionTemplate()}</slot></div>
        <div class="question-control">${this.controlTemplate()}</div>
      </div>
    `;
  }

  protected questionTemplate(): TemplateResult {
    return html`<span class="question-text">${this.questionText}</span>`;
  }

  protected metaValidation(value: unknown): string | null {
    const message: string | null = validate(this.validators, value);
    return message ? message : this.customValidation(value);
  }

  private setDefaultValue(readonly: boolean, defaultValue: any): void {
    if (readonly || (!defaultValue && defaultValue !== 0) || this.value !== undefined) {
      return;
    }
    this.getUpdateComplete().then(() => {
      if (defaultValue === this._defaultValue && readonly === this._readonly && this.value === undefined) {
        this.setValue(defaultValue);
        this.validateField(defaultValue);
      }
    });
  }

  protected abstract valueChanged(...args: any): void;

  protected abstract customValidation(value: unknown): string | null;

  protected abstract controlTemplate(...args: any): TemplateResult;

  protected abstract setValue(value: T): void;

  protected abstract validateField(value: T): void;

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      FlexLayoutClasses,
      css`
        :host {
          display: block;
          width: 100%;
          padding: 0 25px 0 45px;
          box-sizing: border-box;
        }

        .finding-container {
          width: 100%;
          display: flex;
        }
        .flex-wrapping {
          flex-wrap: wrap;
        }

        :host(.wide) .finding-container {
          flex-direction: column;
        }

        :host(.wide) .question {
          margin-bottom: -8px;
          min-height: 0;
        }

        .question-control,
        .question {
          min-width: 0;
          min-height: 57px;
          display: flex;
          align-items: center;
        }
        .question {
          flex: 2;
        }
        .question-control {
          flex: 3;
        }
        .add-button {
          padding: 3px;
          margin: 10px;
          background: transparent;
          color: var(--primary-color);
          border: 1px solid;
        }

        .full-width,
        paper-input,
        paper-textarea {
          width: 100%;
        }

        .question-text {
          font-weight: 500;
          font-size: 13px;
          color: var(--primary-text-color);
        }

        paper-input,
        paper-textarea {
          outline: none !important;
        }
        paper-input[required],
        paper-textarea[required] {
          --paper-input-container-label_-_background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221235%22%20height%3D%221175%22%3E%3Cpath%20fill%3D%22%23de0000%22%20d%3D%22M0%2C449h1235l-999%2C726%20382-1175%20382%2C1175z%22%2F%3E%3C%2Fsvg%3E')
            no-repeat 98% 14%/7px;
          --paper-input-container-label_-_max-width: max-content;
          --paper-input-container-label_-_padding-right: 15px;
        }

        iron-icon[icon='close'] {
          cursor: pointer;
        }

        .error-text {
          color: var(--error-color);
          font-size: 12px;
        }

        @media (max-width: 1080px) {
          :host {
            padding: 0 15px;
          }
          .finding-container {
            flex-direction: column;
          }
          .question,
          .question-control {
            flex: 0 1 auto;
          }
        }
      `
    ];
  }
}
