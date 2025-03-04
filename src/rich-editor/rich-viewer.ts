import {html, css, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {fireEvent} from '../lib/utils/fire-custom-event';

@customElement('rich-viewer')
export class RichViewer extends LitElement {
  static styles = css`
    article {
      width: calc(100% - 24px);
      padding: 12px;
      height: auto;
      min-height: 60px;
    }

    article[contenteditable='true'] {
      border: none;
      outline: none;
    }
    article[contenteditable='false'] {
      background-color: #ffffff;
    }
    blockquote {
      margin-inline-start: 8px;
      margin-inline-end: 8px;
    }
  `;

  @query('#content') content!: HTMLDivElement;
  @property({type: Boolean, reflect: true}) readonly = false;
  @property({type: String}) value = '';
  @property({type: Object, hasChanged: () => true}) node!: Element;

  render() {
    return html`<article
      id="content"
      contenteditable="${this.readonly ? 'false' : 'true'}"
      .innerHTML="${this.value}"
      @input=${() => this.updateSelection()}
    ></article>`;
  }

  updateSelection() {
    if (this.readonly) {
      return;
    }
    // @ts-ignore
    const shadowSelection = this.shadowRoot?.getSelection
      ? // @ts-ignore
        this.shadowRoot!.getSelection()
      : null;
    const selection = shadowSelection || document.getSelection() || window.getSelection();
    fireEvent(this, 'selection', {selection: selection, html: this.content?.innerHTML});
  }

  firstUpdated() {
    document.execCommand('defaultParagraphSeparator', false, 'br');
    document.addEventListener('selectionchange', () => {
      this.updateSelection();
    });
    window.addEventListener('selectionchange', () => {
      this.updateSelection();
    });
    document.addEventListener('keydown', () => {
      this.updateSelection();
    });
  }
}
