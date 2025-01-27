import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-unicef/src/etools-upload/etools-upload-multi';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import {deleteFileFromDexie} from '@unicef-polymer/etools-unicef/src/etools-upload/offline/dexie-operations';
import {css, html, CSSResultArray, LitElement, TemplateResult} from 'lit';
import {property, query, customElement} from 'lit/decorators.js';
import {GenericObject} from '../lib/types/global.types';
import {BlueprintMetadata} from '../lib/types/form-builder.types';
import {clone, equals} from 'ramda';
import {fireEvent} from '../lib/utils/fire-custom-event';
import {SharedStyles} from '../lib/styles/shared-styles';
import {AttachmentsStyles} from '../lib/styles/attachments.styles';
import {AttachmentsHelper} from './form-attachments-popup.helper';
import {getTranslation} from '../lib/utils/translate';
import {DialogStyles} from '../lib/styles/dialog.styles';

export type FormBuilderAttachmentsPopupData = {
  attachments: StoredAttachment[];
  metadata: BlueprintMetadata;
  title: string;
  readonly?: boolean;
  computedPath: string[];
  errors: GenericObject[];
};

export type StoredAttachment = {
  attachment: string | number;
  filename: string;
  file_type: number | null;
  url?: string;
  composedPath?: string[];
};

export type UploadedAttachment = {
  id: number;
  object_link: string;
  file_type: string;
  file_link: string;
  filename: string;
  uploaded_by: string;
  created: string;
  attachment: number;
};

export type OfflineSavedAttachment = {
  id: string;
  filetype: string;
  filename: string;
  extraInfo: string[];
  unsynced: boolean;
};

export type UploadFinishedDetails = {
  success: (UploadedAttachment | OfflineSavedAttachment)[];
  error: any[];
};

export type SingleUploadFinishedDetails = {
  success: UploadedAttachment | OfflineSavedAttachment;
  error: any[];
};

@customElement('form-attachments-popup')
export class FormAttachmentsPopup extends LitElement {
  @property() dialogOpened = true;
  @property() saveBtnClicked = false;
  @property() attachments: StoredAttachment[] = [];
  @property() metadata!: BlueprintMetadata;
  @property() language!: string;
  @query('#link') link!: HTMLLinkElement;
  readonly = false;
  popupTitle = '';
  computedPath: string[] = [];
  errors: GenericObject = [];

  /**
   * Array of offline saved fileIds that was remove from popup.
   * We need to remove them from IDB but only after confirm button click
   */
  private filesForRemove: string[] = [];
  private originalAttachments: StoredAttachment[] = [];

  set dialogData({attachments, title, metadata, readonly, computedPath, errors}: FormBuilderAttachmentsPopupData) {
    this.popupTitle = title;
    this.attachments = clone(attachments) || [];
    this.originalAttachments = clone(attachments) || [];
    this.metadata = clone(metadata);
    this.readonly = Boolean(readonly);
    this.computedPath = computedPath;
    this.errors = clone(errors) || [];
  }

  get uploadUrl(): string {
    return AttachmentsHelper.uploadUrl!;
  }

  get jwtLocalStorageKey(): string {
    return AttachmentsHelper.jwtLocalStorageKey!;
  }

  constructor() {
    super();
    if (!AttachmentsHelper.isInitialized) {
      throw new Error('Please initialize attachments popup before use');
    }
    if (!this.language) {
      this.language = (window as any).EtoolsLanguage || 'en';
    }
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

  render(): TemplateResult | void {
    return html`
      ${DialogStyles}
      <style>
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
                <etools-button
                  variant="text"
                  ?hidden="${!attachment.url}"
                  class="download-button file-selector__download"
                  @click="${() => this.downloadFile(attachment)}"
                >
                  <etools-icon name="cloud-download" class="dw-icon" slot="prefix"></etools-icon>
                  ${getTranslation(this.language, 'DOWNLOAD')}
                </etools-button>

                <!--        Delete Button          -->
                <etools-button
                  variant="text"
                  class="danger delete-button file-selector__delete"
                  ?hidden="${this.readonly}"
                  @click="${() => this.deleteAttachment(index)}"
                >
                  ${getTranslation(this.language, 'DELETE')}
                </etools-button>
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

  /**
   * on Cancel button click
   * Remove offline saved attachments from IDB if they are missing in originalAttachments
   */
  onClose(): void {
    this.attachments.forEach(({url, attachment}: StoredAttachment) => {
      const existsInOriginal: boolean = this.originalAttachments
        .map((item: StoredAttachment) => item.attachment || [])
        .includes(attachment);
      if (!existsInOriginal && !url) {
        deleteFileFromDexie(attachment as string);
      }
    });
    fireEvent(this, 'response', {confirmed: false});
  }

  async saveChanges(): Promise<void> {
    let fileTypeNotSelected = false;
    this.attachments.forEach((attachment: GenericObject, index: number) => {
      if (!attachment.file_type) {
        fileTypeNotSelected = true;
        this.errors[index] = {file_type: [getTranslation(this.language, 'REQUIRED_FIELD')]};
      } else {
        this.errors[index] = [];
      }
    });
    this.requestUpdate();
    if (fileTypeNotSelected) {
      return;
    }

    if (this.filesForRemove.length) {
      for (const fileId of this.filesForRemove) {
        await deleteFileFromDexie(fileId);
      }
    }

    /**
     * Don't confirm popup if no changes was made
     */
    if (!equals(this.attachments, this.originalAttachments)) {
      fireEvent(this, 'response', {confirmed: true, attachments: this.attachments});
    } else {
      fireEvent(this, 'response', {confirmed: false});
    }
  }

  checkFileType(index: number): boolean {
    return this.errors[index]?.file_type;
  }

  retrieveErrorMessage(index: number): string {
    return this.errors[index] && this.errors[index].file_type ? this.errors[index].file_type[0] : '';
  }

  protected downloadFile(attachment: GenericObject): void {
    const url: string = attachment.url;
    this.link.href = url;
    this.link.click();
    window.URL.revokeObjectURL(url);
  }

  protected changeFileType(attachment: GenericObject, newType: number | null, index: number): void {
    if (newType && attachment.file_type !== newType) {
      attachment.file_type = newType;
      this.errors[index] = [];
      this.requestUpdate();
    }
  }

  protected attachmentsUploaded({success, error}: UploadFinishedDetails): void {
    const parsedAttachments: StoredAttachment[] = success
      .map((attachment: UploadedAttachment | OfflineSavedAttachment) => {
        if (this.isUploadedAttachment(attachment)) {
          return {
            url: attachment.file_link,
            attachment: attachment.id,
            filename: attachment.filename,
            file_type: null
          } as StoredAttachment;
        } else if (this.isOfflineSavedAttachment(attachment)) {
          return {
            attachment: attachment.id,
            filename: attachment.filename,
            composedPath: this.computedPath,
            file_type: null
          } as StoredAttachment;
        } else {
          console.warn('Missing fields in parsed attachment');
          return null;
        }
      })
      .filter<StoredAttachment>((attachment: StoredAttachment | null): attachment is StoredAttachment =>
        Boolean(attachment)
      );
    this.attachments = [...this.attachments, ...parsedAttachments];

    if (error && error.length) {
      console.error(error);
      fireEvent(this, 'toast', {text: getTranslation(this.language, 'UPLOAD_ATTACHMENTS_FAILED')});
    }
  }

  protected deleteAttachment(index: number): void {
    const [attachment] = this.attachments.splice(index, 1);
    if (!attachment.hasOwnProperty('url')) {
      /**
       * prepare attachment for remove from IDB after Popup confirm
       */
      this.filesForRemove.push(attachment.attachment as string);
    }
    this.attachments = [...this.attachments];
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
