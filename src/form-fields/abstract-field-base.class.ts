import {css, CSSResultArray, html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {FieldValidator, validate} from '../lib/utils/validations.helper';
import {FlexLayoutClasses} from '../lib/styles/flex-layout-classes';

/**
 * Class that contains common properties and methods for single and repeatable fields
 */
export abstract class AbstractFieldBaseClass<T> extends LitElement {
  @property({type: String}) questionText = '';
  @property() language!: string;
  @property({type: Boolean, attribute: 'is-readonly'}) set isReadonly(readonly: boolean) {
    this._readonly = readonly;
    this.setDefaultValue(readonly, this._defaultValue);
    this.requestUpdate();
  }
  get isReadonly(): boolean {
    return this._readonly;
  }
  @property({type: Boolean, attribute: 'required'}) required = false;
  @property() placeholder = '';
  @property() name = '';
  @property() value: T | null = null;
  validators: FieldValidator[] = [];
  touched = false;
  set defaultValue(value: any) {
    this._defaultValue = value;
    this.setDefaultValue(this._readonly, value);
    this.requestUpdate();
  }
  private _defaultValue: any;
  private _readonly = false;

  constructor() {
    super();

    if (!this.language) {
      this.language = (window as any).EtoolsLanguage || 'en';
    }
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('language-changed', this.handleLanguageChange.bind(this) as any);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('language-changed', this.handleLanguageChange.bind(this) as any);
  }

  handleLanguageChange(e: CustomEvent): void {
    this.language = e.detail.language;
  }

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
    const message: string | null = validate(this.validators, value, this.language);
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

        .full-width {
          width: 100%;
        }

        .question-text {
          font-weight: 500;
          font-size: var(--etools-font-size-13, 13px);
          color: var(--primary-text-color);
        }

        etools-icon[name='close'] {
          cursor: pointer;
        }

        .error-text {
          color: var(--error-color);
          font-size: var(--etools-font-size-12, 12px);
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

        @media print {
          .question-control {
            align-items: start;
          }

          :host(text-field) .question-control {
            min-height: 150px;
          }

          .question-control .container etools-radio-group {
            flex-direction: column;
            opacity: 1 !important;
          }

          .finding-container {
            flex-direction: column;
          }
        }
      `
    ];
  }
}
