import {css, CSSResultArray, html, LitElement, property, TemplateResult} from 'lit-element';
import {BlueprintField} from '../lib/types/form-builder.types';
import {FieldTypes, StructureTypes} from '../form-groups';
import {FieldValidator} from '../lib/utils/validations.helper';
import {FieldOption} from './single-fields/scale-field';
import {FlexLayoutClasses} from '../lib/styles/flex-layout-classes';
import {FormBuilderCardStyles} from '..';

export class FieldRendererComponent extends LitElement {
  @property() field!: BlueprintField;
  @property() value: any;
  @property() errorMessage: string | null = null;
  @property() validations: FieldValidator[] = [];
  @property({type: Boolean, attribute: 'readonly'}) readonly: boolean = false;
  @property({type: Array}) options: (FieldOption | string | number)[] = [];

  render(): TemplateResult {
    if (!this.field) {
      return html``;
    }

    return this.renderField(this.field);
  }

  renderField(blueprintField: BlueprintField): TemplateResult {
    const additionalClass: string = blueprintField.styling.includes(StructureTypes.ADDITIONAL)
      ? 'additional-field '
      : '';
    const wideClass: string = blueprintField.styling.includes(StructureTypes.WIDE) ? 'wide-field-container ' : '';
    return html`
      <div class="${`${additionalClass}${wideClass}finding-container`}">
        ${blueprintField.repeatable
          ? this.renderRepeatableField(blueprintField)
          : this.renderStandardField(blueprintField)}
      </div>
    `;
  }

  renderStandardField({input_type, label, help_text, required, placeholder, styling}: BlueprintField): TemplateResult {
    const isWide: boolean = styling.includes(StructureTypes.WIDE);
    switch (input_type) {
      case FieldTypes.TEXT_TYPE:
        return html`
          <text-field
            class="${isWide ? 'wide' : ''}"
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .value="${this.value}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </text-field>
        `;
      case FieldTypes.NUMBER_TYPE:
      case FieldTypes.NUMBER_FLOAT_TYPE:
      case FieldTypes.NUMBER_INTEGER_TYPE:
        return html`
          <number-field
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .value="${this.value}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
            .isInteger="${Boolean(input_type === FieldTypes.NUMBER_INTEGER_TYPE)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </number-field>
        `;
      case FieldTypes.BOOL_TYPE:
      case FieldTypes.SCALE_TYPE:
        return html`
          <scale-field
            .options="${this.options}"
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .value="${this.value}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </scale-field>
        `;
      default:
        console.warn(`FormBuilderGroup: Unknown field type: ${input_type}`);
        return html``;
    }
  }

  renderRepeatableField({
    input_type,
    label,
    help_text,
    required,
    placeholder,
    styling
  }: BlueprintField): TemplateResult {
    const isWide: boolean = styling.includes(StructureTypes.WIDE);
    switch (input_type) {
      case FieldTypes.TEXT_TYPE:
        return html`
          <repeatable-text-field
            class="${isWide ? 'wide' : ''}"
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .value="${this.value}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </repeatable-text-field>
        `;
      case FieldTypes.NUMBER_TYPE:
      case FieldTypes.NUMBER_FLOAT_TYPE:
      case FieldTypes.NUMBER_INTEGER_TYPE:
        return html`
          <repeatable-number-field
            class="${isWide ? 'wide' : ''}"
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .value="${this.value}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
            .isInteger="${Boolean(input_type === FieldTypes.NUMBER_INTEGER_TYPE)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </repeatable-number-field>
        `;
      case FieldTypes.BOOL_TYPE:
      case FieldTypes.SCALE_TYPE:
        return html`
          <repeatable-scale-field
            class="${isWide ? 'wide' : ''}"
            .options="${this.options}"
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .value="${this.value}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </repeatable-scale-field>
        `;
      default:
        console.warn(`FormBuilderGroup: Unknown field type: ${input_type}`);
        return html``;
    }
  }

  renderFieldLabel(label: string, helperText: string): TemplateResult {
    return html`
      <div class="layout vertical question-container">
        <div class="question-text">${label}</div>
        <div class="question-details">${helperText}</div>
      </div>
    `;
  }
  static get styles(): CSSResultArray {
    // language=CSS
    return [
      FlexLayoutClasses,
      FormBuilderCardStyles,
      css`
        .additional-field {
          padding-top: 15px;
          padding-bottom: 20px;
          background-color: var(--secondary-background-color);
        }
        .wide-field-container {
          padding-bottom: 10px;
        }
        .wide-field-container .question-container {
          min-height: 0;
          padding: 7px 0 0;
        }
        .wide-field-container .question-text {
          color: var(--secondary-text-color);
          font-weight: 400;
        }
      `
    ];
  }
}
