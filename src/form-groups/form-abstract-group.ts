import {css, CSSResultArray, html, LitElement, TemplateResult} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import '../form-fields/single-fields/text-field';
import '../form-fields/single-fields/number-field';
import '../form-fields/single-fields/scale-field';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';

import {SharedStyles} from '../lib/styles/shared-styles';
import {pageLayoutStyles} from '../lib/styles/page-layout-styles';
import {elevationStyles} from '../lib/styles/elevation-styles';
import {CardStyles} from '../lib/styles/card-styles';
import {FlexLayoutClasses} from '../lib/styles/flex-layout-classes';
import {fireEvent} from '../lib/utils/fire-custom-event';
import {IFormBuilderAbstractGroup} from '../lib/types/form-builder.interfaces';
import {BlueprintField, BlueprintGroup, BlueprintMetadata, Information} from '../lib/types/form-builder.types';
import {GenericObject} from '../lib/types/global.types';
import {clone} from 'ramda';
import {live} from 'lit/directives/live.js';
import {openDialog} from '../lib/utils/dialog';
import {FormBuilderCardStyles} from '../lib/styles/form-builder-card.styles';
import {getTranslation} from '../lib/utils/translate';

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

@customElement('form-abstract-group')
export class FormAbstractGroup extends LitElement implements IFormBuilderAbstractGroup {
  @property({type: Object}) groupStructure!: BlueprintGroup;
  @property({type: Object}) metadata!: BlueprintMetadata;
  @property({type: String}) parentGroupName = '';
  @property({type: Boolean}) collapsed = false;
  @property() language!: string;
  @property({type: Boolean, attribute: 'readonly'}) readonly = false;
  @property() protected _errors: GenericObject = {};
  @property() protected _value: GenericObject = {};
  computedPath: string[] = [];

  /**
   * Make value property immutable
   * @param value
   */
  set value(value: GenericObject) {
    this._value = this.groupStructure.name === 'root' ? clone(value) : value;
    if (this.groupStructure.name === 'root') {
      const res: {count: number} = this.countCollapsePanels(this.groupStructure, {count: 0});
      // if more than 2 collapse panels, show them collapsed by default
      this.collapsed = res.count > 2;
    }
  }
  get value(): GenericObject {
    return this._value;
  }
  isReadonly() {
    return this.readonly;
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

  constructor() {
    super();

    if (!this.language) {
      this.language = window.localStorage.defaultLanguage || 'en';
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

  countCollapsePanels(
    groupStructure: BlueprintGroup | BlueprintField | Information,
    res: {count: number}
  ): {count: number} {
    if (groupStructure.type === 'group' && groupStructure.children) {
      groupStructure.children.forEach((child: BlueprintGroup | BlueprintField | Information) =>
        this.countCollapsePanels(child, res)
      );
    }
    const isAbstract: boolean = groupStructure.styling.includes(StructureTypes.ABSTRACT);
    const isCard: boolean = groupStructure.styling.includes(StructureTypes.CARD);
    const isCollapsed: boolean = groupStructure.styling.includes(StructureTypes.COLLAPSED);
    if (!isAbstract && isCard && isCollapsed) {
      res.count++;
    }
    return res;
  }

  handleLanguageChange(e: CustomEvent): void {
    this.language = e.detail.language;
  }

  render(): TemplateResult {
    if (!this.groupStructure || !this.metadata) {
      return html``;
    }

    return html`
      ${this.groupStructure.children.map((child: BlueprintGroup | BlueprintField | Information) =>
        this.renderChild(child)
      )}
    `;
  }

  renderChild(child: BlueprintGroup | BlueprintField | Information): TemplateResult | TemplateResult[] {
    const type: string = child.type;
    switch (child.type) {
      case 'field':
        return this.renderField(child);
      case 'group':
        return this.renderGroup(child);
      case 'information':
        return this.renderInformation(child);
      default:
        console.warn(`FormBuilderGroup: Unknown group type ${type}. Please, specify rendering method`);
        return html``;
    }
  }

  renderField(blueprintField: BlueprintField): TemplateResult {
    return html`
      <field-renderer
        .field="${blueprintField}"
        ?readonly="${live(this.isReadonly())}"
        .value="${this.value && this.value[blueprintField.name]}"
        .validations="${blueprintField.validations.map((validation: string) => this.metadata.validations[validation])}"
        .errorMessage="${this.getErrorMessage(blueprintField.name)}"
        .options="${this.metadata.options[blueprintField.options_key || '']?.values || []}"
        .computedPath="${this.computedPath.concat(
          this.groupStructure.name === 'root' ? [blueprintField.name] : [this.groupStructure.name, blueprintField.name]
        )}"
        @value-changed="${(event: CustomEvent) => this.valueChanged(event, blueprintField.name)}"
        @error-changed="${(event: CustomEvent) => this.errorChanged(event, blueprintField.name)}"
      ></field-renderer>
    `;
  }

  renderInformation(information: Information): TemplateResult {
    return html`<section class="elevation page-content" elevation="1">${information.text}</section>`;
  }

  renderGroup(groupStructure: BlueprintGroup): TemplateResult | TemplateResult[] {
    if (!groupStructure.repeatable) {
      return this.getGroupTemplate(groupStructure);
    }
    const value: GenericObject[] = (this.value && this.value[groupStructure.name]) || [{}];
    return html`
      ${value.map((_: GenericObject, index: number) => this.getGroupTemplate(groupStructure, index))}
      <etools-button
        variant="primary"
        class="add-group save-button"
        @click="${() => this.addGroup(groupStructure.name)}"
      >
        ${getTranslation(this.language, 'ADD')}
        ${!groupStructure.title || groupStructure.title.length > 15
          ? getTranslation(this.language, 'GROUP')
          : groupStructure.title}
      </etools-button>
    `;
  }

  getGroupTemplate(groupStructure: BlueprintGroup, index?: number): TemplateResult {
    const isAbstract: boolean = groupStructure.styling.includes(StructureTypes.ABSTRACT);
    const isCard: boolean = groupStructure.styling.includes(StructureTypes.CARD);
    const isCollapsed: boolean = groupStructure.styling.includes(StructureTypes.COLLAPSED);
    let value: GenericObject | GenericObject[] = this.value && this.value[groupStructure.name];
    if (typeof index === 'number') {
      value = value && (value as GenericObject[])[index];
    }
    let errors: GenericObject | GenericObject[] = this._errors[groupStructure.name];
    if (typeof index === 'number') {
      errors = errors && (errors as GenericObject[])[index];
    }
    if (isAbstract) {
      return html`
        <form-abstract-group
          .groupStructure="${groupStructure}"
          .value="${value}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .collapsed="${this.collapsed}"
          .computedPath="${this.computedPath.concat(
            this.groupStructure.name === 'root' ? [] : [this.groupStructure.name]
          )}"
          .readonly="${this.isReadonly()}"
          .errors="${errors || null}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name, index)}"
          @error-changed="${(event: CustomEvent) => this.errorChanged(event, groupStructure.name, index)}"
        ></form-abstract-group>
      `;
    } else if (isCard && isCollapsed) {
      return html`
        <form-collapsed-card
          .groupStructure="${groupStructure}"
          .value="${value}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .collapsed="${this.collapsed}"
          .computedPath="${this.computedPath.concat(
            this.groupStructure.name === 'root' ? [] : [this.groupStructure.name]
          )}"
          .readonly="${this.isReadonly()}"
          .errors="${errors || null}"
          @remove-group="${() => this.removeGroup(groupStructure, index)}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name, index)}"
          @error-changed="${(event: CustomEvent) => this.errorChanged(event, groupStructure.name, index)}"
        ></form-collapsed-card>
      `;
    } else if (isCard) {
      return html`
        <form-card
          .groupStructure="${groupStructure}"
          .value="${value}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .computedPath="${this.computedPath.concat(
            this.groupStructure.name === 'root' ? [] : [this.groupStructure.name]
          )}"
          .readonly="${this.isReadonly()}"
          .errors="${errors || null}"
          @remove-group="${() => this.removeGroup(groupStructure, index)}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name, index)}"
          @error-changed="${(event: CustomEvent) => this.errorChanged(event, groupStructure.name, index)}"
        ></form-card>
      `;
    } else {
      console.warn(`FormBuilderGroup: Unknown group type: ${groupStructure.styling}`);
      return html``;
    }
  }

  valueChanged(event: CustomEvent, name: string, index?: number): void {
    if (!this.value) {
      this.value = {};
    }
    if (typeof index === 'number') {
      const value: GenericObject[] = this.value[name] || [];
      value[index] = event.detail.value;
      this.value[name] = value;
    } else {
      this.value[name] = event.detail.value;
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    fireEvent(this, 'value-changed', {value: this.value});
    this.requestUpdate();
  }

  errorChanged(event: CustomEvent, name: string, index?: number): void {
    const errorMessage: string | null = event.detail.error;
    if (typeof index === 'number') {
      const errors: (string | null)[] =
        this._errors[name] || (this.value && new Array(this.value[name].length).fill(null)) || [];
      errors.splice(index, 1, errorMessage);
      const hasErrors: boolean = errors.some((error: null | string) => error !== null);
      this._errors[name] = hasErrors ? errors : null;
    } else if (errorMessage) {
      this._errors[name] = errorMessage;
    } else {
      delete this._errors[name];
    }
    event.stopPropagation();
    const errors: GenericObject | null = Object.keys(this._errors).length ? this._errors : null;
    fireEvent(this, 'error-changed', {error: errors});
  }

  addGroup(name: string): void {
    const value: GenericObject[] = this.value[name] || [];
    value.push({});
    this.valueChanged({detail: {value}} as CustomEvent, name);
  }

  removeGroup(group: BlueprintGroup, index?: number): void {
    if (typeof index !== 'number') {
      return;
    }
    const value: GenericObject[] = (this.value && this.value[group.name]) || [];
    if (group.required && value.length < 2) {
      openDialog<{
        text: string;
        dialogTitle: string;
        hideConfirmBtn: boolean;
      }>({
        dialog: 'confirmation-popup',
        dialogData: {
          text: getTranslation(this.language, 'GROUP_REQUIRED'),
          hideConfirmBtn: true,
          dialogTitle: ''
        }
      });
      return;
    }
    value.splice(index, 1);
    this.valueChanged({detail: {value}} as CustomEvent, group.name);
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
        :host {
          display: flex;
          flex-direction: column;
        }
        .add-group {
          align-self: flex-end;
          margin-right: 23px;
          margin-top: 20px;
          box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12),
            0 2px 4px -1px rgba(0, 0, 0, 0.4);
        }
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .card-header .remove-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 10px 8px;
          cursor: pointer;
          width: min-content;
          white-space: nowrap;
        }
        .card-header .title {
          padding: 0 24px 8px;
          font-size: 18px;
          font-weight: bold;
        }
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
        etools-icon-button[name='close'] {
          cursor: pointer;
          color: var(--primary-text-color);
        }
      `
    ];
  }
}
