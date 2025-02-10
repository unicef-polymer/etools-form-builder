import {css, html, LitElement} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';

@customElement('rich-action')
export class RichAction extends LitElement {
  static styles = css`
    section {
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-inline-end: 4px;
    }
    section * {
      margin: 2px;
    }
    etools-icon-button {
      cursor: pointer;
      width: 12px;
      padding: 2px 4px;
    }
    etools-dropdown {
      min-width: 140px;
      margin-block-end: 24px;
    }
  `;

  @property({type: String}) command = '';
  @property({type: String}) value?: string;
  @property({type: String}) icon = 'info';
  @property({type: Boolean}) active = false;
  @property({type: String}) color = '#000000';
  @property({type: Array}) values: Option[] = [];

  render() {
    const hasItems = this.values.length > 0;
    return html`<section style="color:${this.color}">
      ${hasItems
        ? html` <etools-dropdown
            option-label="name"
            option-value="value"
            .options="${this.values}"
            .selected="${this.values[0].value}"
            dynamic-align
            hide-search
            trigger-value-change-event
            @etools-selected-item-changed="${({detail}: CustomEvent) => {
              if (detail === undefined || detail.selectedItem === null) {
                return;
              }
              const selectedValue = detail.selectedItem.value;
              if (selectedValue === '--') {
                editorCommand('removeFormat', undefined);
              } else {
                editorCommand(this.command, selectedValue);
              }
            }}"
          >
          </etools-dropdown>`
        : html`<etools-icon-button
            ?active="${this.active}"
            name="${this.icon}"
            @click=${() => {
              if (this.command) {
                editorCommand(this.command, this.value);
              } else {
                this.dispatchEvent(
                  new Event('action', {
                    bubbles: true,
                    composed: true
                  })
                );
              }
            }}
          ></etools-icon-button>`}
      <div><slot></slot></div>
    </section>`;
  }
}

interface Option {
  name: string;
  value: string;
}

export function editorCommand(command: string, value?: string) {
  document.execCommand(command, true, value);
}
