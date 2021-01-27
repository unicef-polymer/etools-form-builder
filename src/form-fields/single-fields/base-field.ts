import {property, TemplateResult} from 'lit-element';
import {fireEvent} from '../../lib/utils/fire-custom-event';
import {AbstractFieldBaseClass} from '../abstract-field-base.class';

export abstract class BaseField<T> extends AbstractFieldBaseClass<T> {
  set errorMessage(message: string | null) {
    this._errorMessage = message;
  }
  get errorMessage(): string | null {
    return this.isReadonly ? null : this._errorMessage;
  }

  @property() protected _errorMessage: string | null = null;

  protected valueChanged(newValue: T): void {
    if (!this.isReadonly && newValue !== this.value && this.touched) {
      this.validateField(newValue);
    } else if (this.isReadonly || !this.touched) {
      this._errorMessage = null;
    }
    if (newValue !== this.value) {
      this.value = newValue;
      fireEvent(this, 'value-changed', {value: newValue});
    }
  }

  protected validateField(value: T): void {
    let errorMessage: string | null;
    if (this.required && !value && typeof value !== 'number') {
      errorMessage = 'This field is required!';
    } else {
      errorMessage = this.metaValidation(value);
    }
    if (this._errorMessage !== errorMessage) {
      fireEvent(this, 'error-changed', {error: errorMessage});
      this._errorMessage = errorMessage;
      this.requestUpdate();
    }
  }

  protected abstract controlTemplate(): TemplateResult;
}
