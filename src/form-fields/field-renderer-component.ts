import {html, LitElement, property, TemplateResult} from 'lit-element';
import {BlueprintField} from '../lib/types/form-builder.types';
import {FieldTypes, StructureTypes} from '../form-groups';
import {FieldValidator} from '../lib/utils/validations.helper';
import {FieldOption} from './single-fields/scale-field';

export class FieldRendererComponent extends LitElement {
  @property() field!: BlueprintField;
  @property() value: any;
  @property() errorMessage: string | null = null;
  @property() validations: FieldValidator[] = [];
  @property({type: Boolean, attribute: 'readonly', reflect: true}) readonly: boolean = true;
  @property({type: Array}) options: FieldOption[] = [];

  render(): TemplateResult {
    if (!this.field) {
      return html``;
    }

    return this.renderField(this.field);
  }

  renderField(blueprintField: BlueprintField): TemplateResult {
    const isWide: boolean = blueprintField.styling.includes(StructureTypes.WIDE);
    const isAdditional: boolean = blueprintField.styling.includes(StructureTypes.ADDITIONAL);
    if (isWide) {
      return html`
        <div class="${isAdditional ? 'additional-field' : ''}">${this.renderWideField(blueprintField)}</div>
      `;
    } else {
      return html`
        <div class="${isAdditional ? 'additional-field finding-container' : 'finding-container'}">
          ${blueprintField.repeatable
            ? this.renderRepeatableField(blueprintField)
            : this.renderStandardField(blueprintField)}
        </div>
      `;
    }
  }

  renderWideField({label, placeholder, required}: BlueprintField): TemplateResult {
    return html`
      <wide-field
        ?is-readonly="${this.readonly}"
        ?required="${required}"
        .value="${this.value}"
        label="${label}"
        placeholder="${placeholder}"
        .validators="${this.validations}"
        .errorMessage="${this.errorMessage}"
      ></wide-field>
    `;
  }

  renderStandardField({input_type, label, help_text, required, placeholder}: BlueprintField): TemplateResult {
    switch (input_type) {
      case FieldTypes.TEXT_TYPE:
        return html`
          <text-field
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

  renderRepeatableField({input_type, label, help_text, required, placeholder}: BlueprintField): TemplateResult {
    switch (input_type) {
      case FieldTypes.TEXT_TYPE:
        return html`
          <repeatable-text-field
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
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .value="${this.value}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </repeatable-number-field>
        `;
      case FieldTypes.BOOL_TYPE:
      case FieldTypes.SCALE_TYPE:
        return html`
          <repeatable-scale-field
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
}
