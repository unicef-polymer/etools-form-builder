import {CSSResultArray, TemplateResult, html} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {fireEvent} from '../lib/utils/fire-custom-event';
import {clone, equals} from 'ramda';
import {IFormBuilderCard} from '../lib/types/form-builder.interfaces';
import {FormAbstractGroup} from './form-abstract-group';
import {GenericObject} from '../lib/types/global.types';
import {openDialog} from '../lib/utils/dialog';
import {getTranslation} from '../lib/utils/translate';
import '@unicef-polymer/etools-unicef/src/etools-collapse/etools-collapse';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import {buttonsStyles} from '@unicef-polymer/etools-unicef/src/styles/button-styles';
import {SharedStyles} from '../lib/styles/shared-styles';
import {pageLayoutStyles} from '../lib/styles/page-layout-styles';
import {elevationStyles} from '../lib/styles/elevation-styles';
import {CardStyles} from '../lib/styles/card-styles';
import {FlexLayoutClasses} from '../lib/styles/flex-layout-classes';
import {FormBuilderCardStyles} from '../lib/styles/form-builder-card.styles';

@customElement('form-card')
export class FormCard extends FormAbstractGroup implements IFormBuilderCard {
  @property() protected _value: GenericObject = {};
  /**
   * Show save button only if value was changed by user
   */
  @property() private showSaveButton = false;

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
  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      pageLayoutStyles,
      elevationStyles,
      CardStyles,
      FlexLayoutClasses,
      FormBuilderCardStyles,
      buttonsStyles
    ];
  }

  render(): TemplateResult {
    return html`
      <section class="elevation page-content card-container form-card" elevation="1">
        <div class="card-header">
          <div class="title">${this.groupStructure.title}</div>
          <div
            class="remove-group"
            ?hidden="${!this.groupStructure.repeatable}"
            @click="${() =>
              this.confirmRemove(this.groupStructure.title || getTranslation(this.language, 'THIS_GROUP'))}"
          >
            Remove
            ${!this.groupStructure.title || this.groupStructure.title.length > 15
              ? getTranslation(this.language, 'GROUP')
              : this.groupStructure.title}
            <etools-icon-button class="attachments-warning" name="delete"></etools-icon-button>
          </div>
        </div>
        ${super.render()}

        <etools-collapse ?opened="${this.showSaveButton}">
          <div class="layout horizontal end-justified card-buttons actions-container">
            <sl-button variant="primary" @click="${this.saveChanges}">
              ${getTranslation(this.language, 'SAVE')}
            </sl-button>
          </div>
        </etools-collapse>
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
      fireEvent(this, 'toast', {text: getTranslation(this.language, 'CHECK_FIELDS_TRY_AGAIN')});
      return;
    }
    fireEvent(this, 'value-changed', {value: this.value});
    this.showSaveButton = false;
  }

  confirmRemove(groupName: string): void {
    openDialog<{text: string}>({
      dialog: 'confirmation-popup',
      dialogData: {
        text: `${getTranslation(this.language, 'CONFIRM_DELETE')} ${groupName}`
      }
    }).then((response: GenericObject) => {
      if (response.confirmed) {
        fireEvent(this, 'remove-group');
      }
    });
  }
}
