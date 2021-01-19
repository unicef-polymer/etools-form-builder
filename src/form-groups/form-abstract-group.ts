import {LitElement, property, TemplateResult, html, CSSResultArray, css} from 'lit-element';
import '../form-fields/single-fields/text-field';
import '../form-fields/single-fields/number-field';
import '../form-fields/single-fields/scale-field';
import '../form-fields/single-fields/wide-field';
import '@polymer/paper-input/paper-textarea';
import {SharedStyles} from '../lib/styles/shared-styles';
import {pageLayoutStyles} from '../lib/styles/page-layout-styles';
import {elevationStyles} from '../lib/styles/elevation-styles';
import {CardStyles} from '../lib/styles/card-styles';
import {FlexLayoutClasses} from '../lib/styles/flex-layout-classes';
import {FormBuilderCardStyles} from '..';
import {fireEvent} from '../lib/utils/fire-custom-event';
import {IFormBuilderAbstractGroup} from '../lib/types/form-builder.interfaces';
import {BlueprintField, BlueprintGroup, BlueprintMetadata} from '../lib/types/form-builder.types';
import {GenericObject} from '../lib/types/global.types';
import {clone} from 'ramda';

export enum FieldTypes {
  FILE_TYPE = 'file',
  TEXT_TYPE = 'text',
  NUMBER_TYPE = 'number',
  BOOL_TYPE = 'bool',
  SCALE_TYPE = 'likert_scale',
  NUMBER_INTEGER_TYPE = 'number-integer',
  NUMBER_FLOAT_TYPE = 'number-float'
}

export enum StructureTypes {
  WIDE = 'wide',
  ADDITIONAL = 'additional',
  CARD = 'card',
  ABSTRACT = 'abstract',
  COLLAPSED = 'collapse',
  ATTACHMENTS_BUTTON = 'floating_attachments'
}

export class FormAbstractGroup extends LitElement implements IFormBuilderAbstractGroup {
  @property({type: Object}) groupStructure!: BlueprintGroup;
  @property({type: Object}) metadata!: BlueprintMetadata;
  @property({type: String}) parentGroupName: string = '';
  @property({type: Boolean, attribute: 'readonly', reflect: true}) readonly: boolean = true;
  @property() protected _errors: GenericObject = {};
  @property() protected _value: GenericObject = {};
  computedPath: string[] = [];

  /**
   * Make value property immutable
   * @param value
   */
  set value(value: GenericObject) {
    this._value = this.groupStructure.name === 'root' ? clone(value) : value;
  }
  get value(): GenericObject {
    return this._value;
  }

  /**
   * Setter for handling error.
   * Normally we wouldn't have errors as string or string[] for FormGroups.
   * In cases they appear - show toast with error text and reset it.
   * Otherwise it will be impossible to clear that error from field elements
   * @param errors
   */
  set errors(errors: GenericObject | string[] | null) {
    if (Array.isArray(errors)) {
      fireEvent(this, 'toast', {text: errors[0]});
      fireEvent(this, 'error-changed', {error: null});
    } else if (errors) {
      this._errors = errors;
    }
  }

  render(): TemplateResult {
    if (!this.groupStructure || !this.metadata) {
      return html``;
    }

    return html`
      ${this.groupStructure.children.map((child: BlueprintGroup | BlueprintField) => this.renderChild(child))}
    `;
  }

  renderChild(child: BlueprintGroup | BlueprintField): TemplateResult {
    const type: string = child.type;
    switch (child.type) {
      case 'field':
        return this.renderField(child);
      case 'group':
        return this.renderGroup(child);
      default:
        console.warn(`FormBuilderGroup: Unknown group type ${type}. Please, specify rendering method`);
        return html``;
    }
  }

  renderField(blueprintField: BlueprintField): TemplateResult {
    return html`
      <field-renderer
        .field="${blueprintField}"
        ?readonly="${this.readonly}"
        .value="${this.value && this.value[blueprintField.name]}"
        .validators="${blueprintField.validations.map((validation: string) => this.metadata.validations[validation])}"
        .errorMessage="${this.getErrorMessage(blueprintField.name)}"
        .options="${this.metadata.options[blueprintField.options_key || '']?.values || []}"
        @value-changed="${(event: CustomEvent) => this.valueChanged(event, blueprintField.name)}"
        @error-changed="${(event: CustomEvent) => this.errorChanged(event, blueprintField.name)}"
      ></field-renderer>
    `;
  }

  renderGroup(groupStructure: BlueprintGroup): TemplateResult {
    const isAbstract: boolean = groupStructure.styling.includes(StructureTypes.ABSTRACT);
    const isCard: boolean = groupStructure.styling.includes(StructureTypes.CARD);
    const isCollapsed: boolean = groupStructure.styling.includes(StructureTypes.COLLAPSED);
    if (isAbstract) {
      return html`
        <form-abstract-group
          .groupStructure="${groupStructure}"
          .value="${this.value && this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .computedPath="${this.computedPath.concat(
            this.groupStructure.name === 'root' ? [] : [this.groupStructure.name]
          )}"
          .readonly="${this.readonly}"
          .errors="${this._errors[groupStructure.name] || null}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name)}"
          @error-changed="${(event: CustomEvent) => this.errorChanged(event, groupStructure.name)}"
        ></form-abstract-group>
      `;
    } else if (isCard && isCollapsed) {
      return html`
        <form-collapsed-card
          .groupStructure="${groupStructure}"
          .value="${this.value && this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .computedPath="${this.computedPath.concat(
            this.groupStructure.name === 'root' ? [] : [this.groupStructure.name]
          )}"
          .readonly="${this.readonly}"
          .errors="${this._errors[groupStructure.name] || null}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name)}"
          @error-changed="${(event: CustomEvent) => this.errorChanged(event, groupStructure.name)}"
        ></form-collapsed-card>
      `;
    } else if (isCard) {
      return html`
        <form-card
          .groupStructure="${groupStructure}"
          .value="${this.value && this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .computedPath="${this.computedPath.concat(
            this.groupStructure.name === 'root' ? [] : [this.groupStructure.name]
          )}"
          .readonly="${this.readonly}"
          .errors="${this._errors[groupStructure.name] || null}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name)}"
          @error-changed="${(event: CustomEvent) => this.errorChanged(event, groupStructure.name)}"
        ></form-card>
      `;
    } else {
      console.warn(`FormBuilderGroup: Unknown group type: ${groupStructure.styling}`);
      return html``;
    }
  }

  valueChanged(event: CustomEvent, name: string): void {
    if (!this.value) {
      this.value = {};
    }
    this.value[name] = event.detail.value;
    event.stopPropagation();
    fireEvent(this, 'value-changed', {value: this.value});
    this.requestUpdate();
  }

  errorChanged(event: CustomEvent, name: string): void {
    const errorMessage: string | null = event.detail.error;
    if (errorMessage) {
      this._errors[name] = errorMessage;
    } else {
      delete this._errors[name];
    }
    event.stopPropagation();
    const errors: GenericObject | null = Object.keys(this._errors).length ? this._errors : null;
    fireEvent(this, 'error-changed', {error: errors});
  }

  protected getErrorMessage(fieldName: string): string | null {
    const error: string | [string] = this._errors && this._errors[fieldName];
    return Array.isArray(error) ? error[0] : error || null;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      SharedStyles,
      pageLayoutStyles,
      elevationStyles,
      CardStyles,
      FlexLayoutClasses,
      FormBuilderCardStyles,
      css`
        .save-button {
          margin-top: 8px;
          color: var(--primary-background-color);
          background-color: var(--primary-color);
        }

        .information-source {
          padding: 0.5% 2% 0.5% 1%;
        }

        .additional-field {
          padding-top: 15px;
          padding-bottom: 20px;
          background-color: var(--secondary-background-color);
        }

        .actions-container {
          padding: 0 25px 5px 45px;
          box-sizing: border-box;
        }

        .card-container.form-card {
          padding: 12px 0 15px;
        }

        .attachments-warning {
          color: red;
        }
      `
    ];
  }
}
