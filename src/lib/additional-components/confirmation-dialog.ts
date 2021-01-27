import {LitElement, property, html, CSSResultArray, css} from 'lit-element';
import {fireEvent} from '../utils/fire-custom-event';

export class ConfirmationDialog extends LitElement {
  @property() dialogOpened: boolean = true;
  @property() text: string = '';

  set dialogData({text}: {text: string}) {
    this.text = text;
  }

  render(): unknown {
    return html`
      <etools-dialog
        id="confirmation-dialog"
        size="md"
        no-padding
        keep-dialog-open
        ?opened="${this.dialogOpened}"
        theme="confirmation"
        dialog-title="Are you"
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
