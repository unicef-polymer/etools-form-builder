import '@unicef-polymer/etools-unicef/src/etools-upload/etools-upload';
import {RepeatableBaseField} from './repeatable-base-field';
import {
  AttachmentsHelper,
  OfflineSavedAttachment,
  StoredAttachment,
  UploadedAttachment,
  UploadFinishedDetails
} from '../../form-attachments-popup';
import {css, CSSResultArray, html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {fireEvent} from '../../lib/utils/fire-custom-event';
import {SharedStyles} from '../../lib/styles/shared-styles';
import {AttachmentsStyles} from '../../lib/styles/attachments.styles';
import {getTranslation} from '../../lib/utils/translate';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-upload/etools-upload-multi';

@customElement('repeatable-attachments-field')
export class RepeatableAttachmentField extends RepeatableBaseField<StoredAttachment> {
  get uploadUrl(): string {
    return AttachmentsHelper.uploadUrl!;
  }

  get jwtLocalStorageKey(): string {
    return AttachmentsHelper.jwtLocalStorageKey!;
  }

  computedPath: string[] = [];

  protected render(): TemplateResult {
    const values: (StoredAttachment | null)[] = this.getValues();
    return html`
      <div class="finding-container">
        <div class="question layout start"><slot>${this.questionTemplate()}</slot></div>
        <div class="question-control layout vertical center-justified start">
          ${values.map((value: StoredAttachment | null, index: number) =>
            value
              ? html`
                  <div class="layout horizontal file-container">
                    <!--        File name component          -->
                    <div class="filename-container file-selector__filename">
                      <etools-icon class="file-icon" name="attachment"></etools-icon>
                      <span class="filename" title="${value.filename}">${value.filename}</span>
                    </div>

                    <!--         Download Button         -->
                    <etools-button
                      class="neutral download-button file-selector__download"
                      variant="text"
                      ?hidden="${!value.url}"
                      @click="${() => this.downloadFile(value)}"
                    >
                      <etools-icon name="cloud-download" class="dw-icon" slot="prefix"></etools-icon>
                      ${getTranslation(this.language, 'DOWNLOAD')}
                    </etools-button>

                    <!--        Delete Button          -->
                    <etools-button
                      variant="danger"
                      class="file-selector__delete"
                      ?hidden="${this.isReadonly}"
                      @click="${() => this.removeControl(index)}"
                    >
                      ${getTranslation(this.language, 'DELETE')}
                    </etools-button>
                  </div>
                `
              : ''
          )}
          <!--     Upload button     -->
          <etools-upload-multi
            class="with-padding"
            activate-offline
            ?hidden="${this.isReadonly}"
            @upload-finished="${({detail}: CustomEvent) => this.attachmentsUploaded(detail)}"
            .endpointInfo="${{endpoint: this.uploadUrl, extraInfo: {composedPath: this.computedPath}}}"
            .jwtLocalStorageKey="${this.jwtLocalStorageKey}"
          >
          </etools-upload-multi>
          <div ?hidden="${!this.isReadonly || this.value?.length}">—</div>
        </div>
      </div>
    `;
  }

  protected controlTemplate(): TemplateResult {
    return html``;
  }

  protected customValidation(): string | null {
    return null;
  }

  protected attachmentsUploaded({success, error}: UploadFinishedDetails): void {
    success?.forEach((file: UploadedAttachment | OfflineSavedAttachment, index: number) => {
      const newIndex: number = (Number(this.editedValues?.length) || 0) + index;
      if (this.isUploadedAttachment(file)) {
        this.valueChanged(
          {
            url: file.file_link,
            attachment: file.id,
            filename: file.filename,
            file_type: null
          },
          newIndex
        );
      } else if (this.isOfflineSavedAttachment(file)) {
        this.valueChanged(
          {
            attachment: file.id,
            filename: file.filename,
            composedPath: [],
            file_type: null
          },
          newIndex
        );
      } else {
        console.warn('Missing fields in parsed attachment');
      }
    });

    if (error && error.length) {
      console.error(error);
      fireEvent(this, 'toast', {text: getTranslation(this.language, 'UPLOAD_ATTACHMENTS_FAILED')});
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
    return [
      ...RepeatableBaseField.styles,
      SharedStyles,
      AttachmentsStyles,
      css`
        .file-selector__type-dropdown {
          flex-basis: 25%;
          padding-left: 8px;
          padding-right: 8px;
        }

        .file-selector__filename {
          flex-basis: 35%;
        }

        .file-selector__download {
          flex-basis: 10%;
        }

        .file-selector__delete {
          flex-basis: 10%;
        }

        .file-selector-container.with-type-dropdown {
          flex-wrap: nowrap;
        }

        .popup-container {
          padding: 12px 12px 0;
        }

        .file-container {
          padding: 8px 0;
        }

        @media (max-width: 380px) {
          .file-selector-container.with-type-dropdown {
            justify-content: center;
          }

          .file-selector-container.with-type-dropdown etools-dropdown.type-dropdown {
            flex-basis: 90%;
          }

          .file-selector__filename {
            flex-basis: 90%;
          }

          .file-selector__download {
            flex-basis: 5%;
          }

          .file-selector__delete {
            flex-basis: 5%;
          }
        }

        @media (max-width: 600px) {
          etools-dropdown {
            padding: 0;
          }

          .file-selector-container.with-type-dropdown {
            border-bottom: 1px solid lightgrey;
            flex-wrap: wrap;
            padding-bottom: 10px;
          }
        }
      `
    ];
  }
}
