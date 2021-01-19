import {html, property, TemplateResult} from 'lit-element';
import {AbstractFieldBaseClass} from '../abstract-field-base.class';
import {fireEvent} from '../../lib/utils/fire-custom-event';

export abstract class RepeatableBaseField<T> extends AbstractFieldBaseClass<T[]> {
  set errorMessage(messages: (string | null)[]) {
    this._errorMessage = messages || [];
  }
  get errorMessage(): (string | null)[] {
    return this.isReadonly ? [] : this._errorMessage;
  }

  @property() protected _errorMessage: (string | null)[] = [];
  @property() private editedValues: (T | null)[] | null = null;

  protected render(): TemplateResult {
    const values: (T | null)[] = this.getValues();
    return html`
      <div class="finding-container">
        <div class="question layout start"><slot>${this.questionTemplate()}</slot></div>
        <div class="question-control layout vertical end">
          ${values.map(
            (value: T | null, index: number) =>
              html`<div class="layout horizontal center full-width">
                ${this.controlTemplate(value, index)}
                <iron-icon
                  icon="close"
                  ?hidden="${this.isReadonly || values.length < 2}"
                  @click="${() => this.removeControl(index)}"
                ></iron-icon>
              </div>`
          )}
          <paper-button class="add-button" ?hidden="${this.isReadonly}" @click="${() => this.addNewField()}">
            Add
          </paper-button>
        </div>
      </div>
    `;
  }

  protected questionTemplate(): TemplateResult {
    return html`<span class="question-text">${this.questionText}</span>`;
  }

  protected valueChanged(newValue: T, index: number): void {
    if (!this.isReadonly) {
      this.validateField(newValue, index);
    } else {
      this._errorMessage = [];
    }
    if (this.editedValues && newValue !== this.editedValues[index]) {
      this.editedValues[index] = newValue;
      this.value = this.editedValues.filter((value: T | null) => Boolean(value)) as T[];
      fireEvent(this, 'value-changed', {value: this.value});
    }
  }

  protected validateField(value: T, index: number): void {
    let errorMessage: string | null;
    if (this.required && !value && value !== null) {
      errorMessage = 'This field is required!';
    } else {
      errorMessage = this.metaValidation(value);
    }
    const oldError: string | null = (this._errorMessage || [])[index] || null;
    if (oldError !== errorMessage) {
      const errors: (string | null)[] = this.editedValues!.map(
        (_: T | null, index: number) => (this._errorMessage && this._errorMessage[index]) || null
      );
      errors.splice(index, 1, errorMessage as string);
      const newErrors: (string | null)[] | null = errors.some((error: string | null) => error !== null) ? errors : null;
      fireEvent(this, 'error-changed', {error: newErrors});
      this._errorMessage = errors;
      this.requestUpdate();
    }
  }

  protected addNewField(): void {
    this.editedValues = [...this.editedValues!, null];
  }

  protected removeControl(index: number): void {
    this.editedValues!.splice(index, 1);
    this.value = this.editedValues!.filter((value: T | null) => Boolean(value)) as T[];
    fireEvent(this, 'value-changed', {value: this.value});
    this.requestUpdate();
  }

  private getValues(): (T | null)[] {
    if (this.isReadonly) {
      this.editedValues = Array.isArray(this.value) && this.value.length ? this.value : [null];
    } else if (!this.editedValues) {
      this.editedValues = Array.isArray(this.value) && this.value.length ? this.value : [null];
    }

    return this.editedValues || [null];
  }

  protected abstract controlTemplate(value: T | null, index: number): TemplateResult;
}
