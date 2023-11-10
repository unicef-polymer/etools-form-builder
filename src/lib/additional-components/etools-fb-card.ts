import {css, CSSResultArray, html, LitElement, TemplateResult} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-collapse/etools-collapse';
import {CardStyles} from '../styles/card-styles';
import {elevationStyles} from '../styles/elevation-styles';
import {FlexLayoutClasses} from '../styles/flex-layout-classes';
import {fireEvent} from '../utils/fire-custom-event';
import {getTranslation} from '../utils/translate';

@customElement('etools-fb-card')
export class EtoolsFbCard extends LitElement {
  @property({attribute: 'card-title'})
  cardTitle!: string;

  @property({type: Boolean, attribute: 'is-editable'})
  isEditable: boolean = false;

  @property({type: Boolean, attribute: 'is-collapsible'})
  isCollapsible: boolean = false;

  @property({type: Boolean, attribute: 'hide-edit-button'})
  hideEditButton: boolean = false;

  @property({type: Boolean}) collapsed: boolean = false;
  @property({type: Boolean}) edit: boolean = false;
  @property() language!: string;

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      elevationStyles,
      CardStyles,
      FlexLayoutClasses,
      css`
        :host {
          display: block;
        }

        .card-container {
          background-color: var(--primary-background-color);
        }

        .card-title-box[is-collapsible] {
          padding-left: 17px;
          padding-right: 25px;
        }

        .card-content {
          padding: 0;
        }

        .card-buttons {
          padding: 12px 24px;
        }

        .save-button {
          color: var(--primary-background-color);
          background-color: var(--primary-color);
        }

        .edit-button {
          color: var(--gray-mid);
        }

        .edit-button[edit] {
          color: var(--primary-color);
        }

        .flex-header {
          display: flex;
          align-items: center;
          padding-top: auto;
          flex-wrap: nowrap;
        }
        .flex-header__collapse {
          flex-basis: auto;
        }
        .flex-header__title {
          font-size: 18px;
          flex-basis: auto;
          flex-grow: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .flex-header__actions {
          order: 1;
          width: auto;
          display: flex;
          flex-basis: auto;
        }
        .flex-header__postfix {
          order: 3;
        }
        .flex-header__edit {
          order: 2;
        }
        @media (max-width: 380px) {
          .card-title-box[is-collapsible] {
            padding-left: 0;
            padding-right: 0;
          }
          .flex-header {
            align-items: baseline;
            padding-top: 10px;
            flex-wrap: wrap;
          }
          .flex-header__collapse {
            flex-basis: 20%;
          }
          .flex-header__title {
            flex-basis: 60%;
            overflow: unset;
            white-space: unset;
            text-overflow: unset;
          }
          .flex-header__actions {
            order: 2;
            width: 100%;
            border-top: 1px solid lightgrey;
            justify-content: flex-end;
          }
          .flex-header__postfix {
            order: 3;
          }
          .flex-header__edit {
            order: 1;
            flex-basis: 20%;
          }
        }
      `
    ];
  }

  constructor() {
    super();

    if (!this.language) {
      this.language = window.localStorage.defaultLanguage || 'en';
    }
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  save(): void {
    fireEvent(this, 'save');
  }

  cancel(): void {
    this.edit = false;
    fireEvent(this, 'cancel');
  }

  startEdit(): void {
    this.collapsed = false;
    if (this.edit) {
      return;
    }
    this.edit = true;
    fireEvent(this, 'start-edit');
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
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

  // language=HTML
  protected render(): TemplateResult {
    return html`
      <div class="elevation card-container" elevation="1">
        <header class="card-title-box with-bottom-line flex-header" ?is-collapsible="${this.isCollapsible}">
          ${this.isCollapsible
            ? html`
                <sl-button
                  variant="primary"
                  size="small"
                  class="flex-header__collapse"
                  @click="${() => this.toggleCollapse()}"
                >
                  <etools-icon name="${this.collapsed ? 'expand-more' : 'expand-less'}"></etools-icon>
                </sl-button>
              `
            : ''}
          <div class="flex-header__title">${this.cardTitle}</div>
          <div class="flex-header__actions"><slot name="actions"></slot></div>
          <div class="layout horizontal center flex-header__edit">
            ${this.isEditable
              ? html`
                  <sl-button
                    slot="trigger"
                    variant="primary"
                    size="small"
                    ?hidden="${this.hideEditButton}"
                    class="edit-button"
                    @click="${() => this.startEdit()}"
                  >
                    <etools-icon name="create"></etools-icon>
                  </sl-button>
                `
              : ''}
          </div>
          <div class="flex-header__postfix"><slot name="postfix"></slot></div>
        </header>
        <etools-collapse ?opened="${!this.collapsed}">
          <section class="card-content-block">
            <slot name="content"></slot>

            ${this.isEditable && this.edit
              ? html`
                  <div class="layout horizontal end-justified card-buttons">
                    <sl-button variant="neutral" @click="${this.cancel}">
                      ${getTranslation(this.language, 'CANCEL')}
                    </sl-button>

                    <sl-button variant="primary" class="save-button" @click="${this.save}">
                      ${getTranslation(this.language, 'SAVE')}
                    </sl-button>
                  </div>
                `
              : ''}
          </section>
        </etools-collapse>
      </div>
    `;
  }
}
