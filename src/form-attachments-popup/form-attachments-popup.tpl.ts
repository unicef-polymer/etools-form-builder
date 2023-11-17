import {FormAttachmentsPopup} from './form-attachments-popup';
import {html, TemplateResult} from 'lit';
import {GenericObject} from '../lib/types/global.types';
import {InputStyles} from '../lib/styles/input-styles';
import {DialogStyles} from '../lib/styles/dialog.styles';
import {getTranslation} from '../lib/utils/translate';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import '@unicef-polymer/etools-unicef/src/etools-upload/etools-upload-multi';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import {buttonsStyles} from '@unicef-polymer/etools-unicef/src/styles/button-styles';

export function template(this: FormAttachmentsPopup): TemplateResult {
  return html`
    ${InputStyles} ${DialogStyles}
    <style>
      ${buttonsStyles},
      etools-icon[name='error-outline'] {
        color: var(--etools-upload-danger-color, #ea4022);
      }
    </style>
    <etools-dialog
      id="form-attachments-dialog"
      size="md"
      no-padding
      keep-dialog-open
      ?opened="${this.dialogOpened}"
      .okBtnText="${getTranslation(this.language, 'SAVE')}"
      .cancelBtnText="${getTranslation(this.language, 'CANCEL')}"
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
                label="${getTranslation(this.language, 'DOCUMENT_TYPE')}"
                placeholder="${getTranslation(this.language, 'SELECT_DOCUMENT_TYPE')}"
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
                <etools-icon class="file-icon" name="attachment"></etools-icon>
                <span class="filename" title="${attachment.filename}">${attachment.filename}</span>
              </div>

              <!--         Download Button         -->
              <sl-button
                variant="text"
                ?hidden="${!attachment.url}"
                class="download-button file-selector__download"
                @click="${() => this.downloadFile(attachment)}"
              >
                <etools-icon name="cloud-download" class="dw-icon" slot="prefix"></etools-icon>
                ${getTranslation(this.language, 'DOWNLOAD')}
              </sl-button>

              <!--        Delete Button          -->
              <sl-button
                variant="text"
                class="danger file-selector__delete"
                ?hidden="${this.readonly}"
                @click="${() => this.deleteAttachment(index)}"
              >
                ${getTranslation(this.language, 'DELETE')}
              </sl-button>
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
