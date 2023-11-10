import {css, html, CSSResultArray, LitElement} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {fireEvent} from '../utils/fire-custom-event';
import {getTranslation} from '../utils/translate';

@customElement('confirmation-popup')
export class ConfirmationDialog extends LitElement {
  @property() dialogOpened: boolean = true;
  @property() language!: string;
  text: string = '';
  dialogTitle: string = '';
  hideConfirmBtn: boolean = false;

  set dialogData({
    text,
    dialogTitle = 'Are you',
    hideConfirmBtn = false
  }: {
    text: string;
    dialogTitle: string;
    hideConfirmBtn: boolean;
  }) {
    this.text = text;
    this.dialogTitle = dialogTitle;
    this.hideConfirmBtn = hideConfirmBtn;
    this.requestUpdate();
  }

  constructor() {
    super();

    if (!this.language) {
      this.language = window.localStorage.defaultLanguage || 'en';
    }
  }

  render(): unknown {
    return html`
      <etools-dialog
        id="confirmation-dialog"
        size="md"
        no-padding
        keep-dialog-open
        ?hide-confirm-btn="${this.hideConfirmBtn}"
        cancel-btn-text="${getTranslation(this.language, this.hideConfirmBtn ? 'OK' : 'CANCEL')}"
        ?opened="${this.dialogOpened}"
        theme="confirmation"
        dialog-title="${this.dialogTitle}"
        @close="${this.onClose}"
        @confirm-btn-clicked="${() => this.confirm()}"
      >
        <div class="confirmation-message">${this.text}</div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }

  confirm(): void {
    fireEvent(this, 'response', {confirmed: true});
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      css`
        .confirmation-message {
          padding-left: 24px;
        }
      `
    ];
  }
}
