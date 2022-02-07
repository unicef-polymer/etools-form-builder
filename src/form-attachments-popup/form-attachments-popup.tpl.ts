import {FormAttachmentsPopup} from './form-attachments-popup';
import {html, TemplateResult} from 'lit-html';
import '@unicef-polymer/etools-upload/etools-upload-multi';
import '@unicef-polymer/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@polymer/paper-button/paper-button';
import '@polymer/iron-icons/iron-icons';
import {GenericObject} from '../lib/types/global.types';
import {InputStyles} from '../lib/styles/input-styles';
import {DialogStyles} from '../lib/styles/dialog.styles';

export function template(this: FormAttachmentsPopup): TemplateResult {
  return html`
    ${InputStyles} ${DialogStyles}
    <etools-dialog
      id="form-attachments-dialog"
      size="md"
      no-padding
      keep-dialog-open
      ?opened="${this.dialogOpened}"
      .okBtnText="Save"
      .hideConfirmBtn="${this.readonly}"
      dialog-title="${this.popupTitle}"
      @close="${this.onClose}"
      @confirm-btn-clicked="${() => this.saveChanges()}"
    >
      <!--  Link is used to download attachments  -->
      <a id="link" target="_blank" hidden></a>

      <div class="popup-container">
        ${this.attachments?.map(
          (attachment: GenericObject, index: number) => html`
            <div class="file-selector-container with-type-dropdown">
              <!--        Type select Dropdown        -->
              <etools-dropdown
                class="type-dropdown file-selector__type-dropdown"
                .selected="${attachment.file_type}"
                @etools-selected-item-changed="${({detail}: CustomEvent) =>
                  this.changeFileType(attachment, detail.selectedItem?.value, index)}"
                trigger-value-change-event
                label="Document Type"
                placeholder="Select Document Type"
                required
                ?readonly="${this.readonly}"
                hide-search
                .options="${this.metadata?.options.target_attachments_file_types?.values}"
                option-label="label"
                option-value="value"
                ?invalid="${this.checkFileType(index)}"
                .errorMessage="${this.retrieveErrorMessage(index)}"
                allow-outside-scroll
                dynamic-align
              ></etools-dropdown>

              <!--        File name component          -->
              <div class="filename-container file-selector__filename">
                <iron-icon class="file-icon" icon="attachment"></iron-icon>
                <span class="filename" title="${attachment.filename}">${attachment.filename}</span>
              </div>

              <!--         Download Button         -->
              <paper-button
                ?hidden="${!attachment.url}"
                class="download-button file-selector__download"
                @tap="${() => this.downloadFile(attachment)}"
              >
                <iron-icon icon="cloud-download" class="dw-icon"></iron-icon>
                Download
              </paper-button>

              <!--        Delete Button          -->
              <paper-button
                class="delete-button file-selector__delete"
                ?hidden="${this.readonly}"
                @tap="${() => this.deleteAttachment(index)}"
              >
                Delete
              </paper-button>
            </div>
          `
        )}

        <!--     Upload button     -->
        <etools-upload-multi
          class="with-padding"
          activate-offline
          ?hidden="${this.readonly}"
          @upload-finished="${({detail}: CustomEvent) => this.attachmentsUploaded(detail)}"
          .endpointInfo="${{endpoint: this.uploadUrl, extraInfo: {composedPath: this.computedPath}}}"
          .jwtLocalStorageKey="${this.jwtLocalStorageKey}"
        >
        </etools-upload-multi>
      </div>
    </etools-dialog>
  `;
}
