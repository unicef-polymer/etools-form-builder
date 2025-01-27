import {css, html, CSSResultArray, LitElement, TemplateResult} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {BlueprintField} from '../lib/types/form-builder.types';
import {FieldValidator} from '../lib/utils/validations.helper';
import {FieldOption} from './single-fields/scale-field';
import {FlexLayoutClasses} from '../lib/styles/flex-layout-classes';
import {FieldTypes, StructureTypes} from '../form-groups';
import {FormBuilderCardStyles} from '../lib/styles/form-builder-card.styles';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import {getTranslation} from '../lib/utils/translate';

@customElement('field-renderer')
export class FieldRendererComponent extends LitElement {
  @property() field!: BlueprintField;
  @property() value: any;
  @property() language!: string;
  @property() errorMessage: string | null = null;
  @property() validations: FieldValidator[] = [];
  @property({type: Boolean, attribute: 'readonly'}) readonly = false;
  @property({type: Array}) options: (FieldOption | string | number)[] = [];
  computedPath: string[] = [];
  defaultValue: any;

  render(): TemplateResult {
    if (!this.field) {
      return html``;
    }

    return this.renderField(this.field);
  }

  renderField(blueprintField: BlueprintField): TemplateResult {
    const additionalClass: string = blueprintField.styling.includes(StructureTypes.ADDITIONAL)
      ? `additional-field ${blueprintField.name} `
      : `${blueprintField.name} `;

    const wideClass: string = blueprintField.styling.includes(StructureTypes.WIDE) ? 'wide-field-container ' : '';
    const mandatoryClass: string = blueprintField.styling.includes(StructureTypes.MANDATORY_WARNING)
      ? 'mandatory_warning '
      : '';
    return html`
      <div class="${`${additionalClass}${wideClass}${mandatoryClass}finding-container`}">
        ${blueprintField.repeatable
          ? this.renderRepeatableField(blueprintField, !!mandatoryClass)
          : this.renderStandardField(blueprintField, !!mandatoryClass)}
      </div>
    `;
  }

  renderStandardField(
    {input_type, label, help_text, required, placeholder, styling, name}: BlueprintField,
    isMandatory = false
  ): TemplateResult {
    const isWide: boolean = styling.includes(StructureTypes.WIDE);
    switch (input_type) {
      case FieldTypes.TEXT_TYPE:
        return html`
          <text-field
            class="${isWide ? 'wide' : ''}"
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .name="${name}"
            .value="${this.value}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
            .defaultValue="${this.field?.default_value}"
          >
            ${this.renderFieldLabel(label, help_text, isMandatory)}
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
            .name="${name}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
            .isInteger="${Boolean(input_type === FieldTypes.NUMBER_INTEGER_TYPE)}"
            .defaultValue="${this.field?.default_value}"
          >
            ${this.renderFieldLabel(label, help_text, isMandatory)}
          </number-field>
        `;
      case FieldTypes.BOOL_TYPE:
        return html`
          <boolean-field
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .value="${this.value}"
            .name="${name}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
            .defaultValue="${this.field?.default_value}"
          >
            ${this.renderFieldLabel(label, help_text, isMandatory)}
          </boolean-field>
        `;
      case FieldTypes.SCALE_TYPE:
        return html`
          <scale-field
            .options="${this.options}"
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .value="${this.value}"
            .name="${name}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
            .defaultValue="${this.field?.default_value}"
          >
            ${this.renderFieldLabel(label, help_text, isMandatory)}
          </scale-field>
        `;
      case FieldTypes.FILE_TYPE:
        return html`
          <attachments-field
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .value="${this.value}"
            .name="${name}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
            .computedPath="${this.computedPath}"
          >
            ${this.renderFieldLabel(label, help_text, isMandatory)}
          </attachments-field>
        `;
      default:
        console.warn(`FormBuilderGroup: Unknown field type: ${input_type}`);
        return html``;
    }
  }

  renderTooltip(isMandatory: boolean) {
    return isMandatory
      ? html` <sl-tooltip placement="top" content="${getTranslation(this.language, 'PLEASE_ANSWER')}">
          <etools-icon id="users-icon" name="info-outline"></etools-icon>
        </sl-tooltip>`
      : ``;
  }

  renderRepeatableField(
    {input_type, label, help_text, required, placeholder, styling}: BlueprintField,
    isMandatory = false
  ): TemplateResult {
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
            .defaultValue="${this.field?.default_value}"
          >
            ${this.renderFieldLabel(label, help_text, isMandatory)}
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
            .defaultValue="${this.field?.default_value}"
          >
            ${this.renderFieldLabel(label, help_text, isMandatory)}
          </repeatable-number-field>
        `;
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
            .defaultValue="${this.field?.default_value}"
          >
            ${this.renderFieldLabel(label, help_text, isMandatory)}
          </repeatable-scale-field>
        `;
      case FieldTypes.FILE_TYPE:
        return html`
          <repeatable-attachments-field
            ?is-readonly="${this.readonly}"
            ?required="${required}"
            .placeholder="${placeholder}"
            .value="${this.value}"
            .validators="${this.validations}"
            .errorMessage="${this.errorMessage}"
            .computedPath="${this.computedPath}"
          >
            ${this.renderFieldLabel(label, help_text, isMandatory)}
          </repeatable-attachments-field>
        `;
      default:
        console.warn(`FormBuilderGroup: Unknown field type: ${input_type}`);
        return html``;
    }
  }

  renderFieldLabel(label: string, helperText: string, isMandatory = false): TemplateResult {
    return html`
      <div class="layout vertical question-container">
        <div class="question-text">${this.renderTooltip(isMandatory)}${label}</div>
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
        .mandatory_warning etools-icon {
          --etools-icon-fill-color: #f59e0b !important;
        }
        :host(:not([readonly])) {
          .overall {
            background-color: #ffffff;
            border-style: inset;
            border-width: 0 1px 1px 1px;
            border-color: var(--dark-divider-color);
          }
        }
        @media print {
          :host {
            break-inside: avoid;
          }
        }
      `
    ];
  }
}
