import '@unicef-polymer/etools-upload/etools-upload';
import {BaseField} from './base-field';
import {
  AttachmentsHelper,
  OfflineSavedAttachment,
  SingleUploadFinishedDetails,
  StoredAttachment,
  UploadedAttachment
} from '../../form-attachments-popup';
import {TemplateResult, html, CSSResultArray, customElement} from 'lit-element';
import {fireEvent} from '../../lib/utils/fire-custom-event';
import {SharedStyles} from '../../lib/styles/shared-styles';
import {AttachmentsStyles} from '../../lib/styles/attachments.styles';

@customElement('attachments-field')
export class AttachmentField extends BaseField<StoredAttachment | null> {
  get uploadUrl(): string {
    return AttachmentsHelper.uploadUrl!;
  }

  get jwtLocalStorageKey(): string {
    return AttachmentsHelper.jwtLocalStorageKey!;
  }

  computedPath: string[] = [];

  protected controlTemplate(): TemplateResult {
    return html`
      <!--     Upload button     -->
      <etools-upload
        class="with-padding"
        activate-offline
        .uploadedFileInfo="${this.value}"
        ?readonly="${this.isReadonly}"
        @upload-finished="${({detail}: CustomEvent) => this.attachmentsUploaded(detail)}"
        @delete-file="${() => this.valueChanged(null)}"
        .endpointInfo="${{endpoint: this.uploadUrl, extraInfo: {composedPath: this.computedPath}}}"
        .jwtLocalStorageKey="${this.jwtLocalStorageKey}"
      >
      </etools-upload>
    `;
  }

  protected customValidation(): string | null {
    return null;
  }

  protected attachmentsUploaded({success, error}: SingleUploadFinishedDetails): void {
    if (this.isUploadedAttachment(success)) {
      this.valueChanged({
        url: success.file_link,
        attachment: success.id,
        filename: success.filename,
        file_type: null
      });
    } else if (this.isOfflineSavedAttachment(success)) {
      this.valueChanged({
        attachment: success.id,
        filename: success.filename,
        composedPath: [],
        file_type: null
      });
    } else {
      console.warn('Missing fields in parsed attachment');
      this.valueChanged(null);
    }

    if (error && error.length) {
      console.error(error);
      fireEvent(this, 'toast', {text: 'Can not upload attachments. Please try again later'});
    }
  }

  protected downloadFile(attachment: StoredAttachment | null): void {
    if (!attachment?.url) {
      return;
    }
    const link: HTMLAnchorElement = document.createElement('a');
    link.target = '_blank';
    link.href = attachment.url;
    link.click();
    window.URL.revokeObjectURL(attachment.url);
  }

  private isUploadedAttachment(
    attachment: UploadedAttachment | OfflineSavedAttachment
  ): attachment is UploadedAttachment {
    return (
      attachment.hasOwnProperty('filename') &&
      attachment.hasOwnProperty('id') &&
      attachment.hasOwnProperty('file_link') &&
      !attachment.hasOwnProperty('unsynced')
    );
  }

  private isOfflineSavedAttachment(
    attachment: UploadedAttachment | OfflineSavedAttachment
  ): attachment is OfflineSavedAttachment {
    return (
      attachment.hasOwnProperty('filename') && attachment.hasOwnProperty('id') && attachment.hasOwnProperty('unsynced')
    );
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [...BaseField.styles, SharedStyles, AttachmentsStyles];
  }
}
