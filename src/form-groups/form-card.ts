import {TemplateResult, html, property} from 'lit-element';
import {fireEvent} from '../lib/utils/fire-custom-event';
import {clone, equals} from 'ramda';
import {IFormBuilderCard} from '../lib/types/form-builder.interfaces';
import {FormAbstractGroup} from './form-abstract-group';
import {GenericObject} from '../lib/types/global.types';
import '@polymer/iron-collapse';
import {openDialog} from '../lib/utils/dialog';

export class FormCard extends FormAbstractGroup implements IFormBuilderCard {
  @property() protected _value: GenericObject = {};
  /**
   * Show save button only if value was changed by user
   */
  @property() private showSaveButton: boolean = false;

  /**
   * Overrides value property. Saves originalValue.
   * We need to update inner _value only if it wasn't change
   * @param value
   */
  set value(value: GenericObject) {
    if (!this.showSaveButton) {
      this._value = clone(value);
    }
    this.originalValue = value;
  }
  get value(): GenericObject {
    return this._value;
  }
  protected originalValue: GenericObject = {};

  /**
   * Extends parent render method,
   * adds card-container html wrapper and dynamic save button
   */
  render(): TemplateResult {
    return html`
      <section class="elevation page-content card-container form-card" elevation="1">
        <div
          class="remove-group"
          ?hidden="${!this.groupStructure.repeatable}"
          @click="${() => this.confirmRemove(this.groupStructure.title || 'this group')}"
        >
          Remove ${this.groupStructure.title}
          <paper-icon-button icon="delete" class="attachments-warning"></paper-icon-button>
        </div>
        ${super.render()}

        <iron-collapse ?opened="${this.showSaveButton}">
          <div class="layout horizontal end-justified card-buttons actions-container">
            <paper-button class="save-button" @tap="${() => this.saveChanges()}">Save</paper-button>
          </div>
        </iron-collapse>
      </section>
    `;
  }

  /**
   * Updates value property, stops event propagation.
   * We need to fire value-changed event only after save button click
   */
  valueChanged(event: CustomEvent, name: string): void {
    if (!this._value) {
      this._value = {};
    }
    this._value[name] = event.detail.value;
    event.stopPropagation();
    this.showSaveButton = !equals(this.value, this.originalValue);
  }

  saveChanges(): void {
    if (Object.keys(this._errors).length) {
      fireEvent(this, 'toast', {text: 'Please check all fields and try again'});
      return;
    }
    fireEvent(this, 'value-changed', {value: this.value});
    this.showSaveButton = false;
  }

  confirmRemove(groupName: string): void {
    openDialog<{text: string}>({
      dialog: 'confirmation-popup',
      dialogData: {
        text: `Are you sure you want to delete ${groupName}`
      }
    }).then((response: GenericObject) => {
      if (response.confirmed) {
        fireEvent(this, 'remove-group');
      }
    });
  }
}
