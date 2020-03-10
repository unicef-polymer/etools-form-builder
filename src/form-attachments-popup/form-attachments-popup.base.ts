import {css, CSSResultArray, LitElement, property, query, TemplateResult} from 'lit-element';
import {GenericObject} from '../lib/types/global.types';
import {BlueprintMetadata} from '../lib/types/form-builder.types';
import {clone} from 'ramda';
import {template} from './form-attachments-popup.tpl';
import {fireEvent} from '../lib/utils/fire-custom-event';
import {SharedStyles} from '../lib/styles/shared-styles';
import {AttachmentsStyles} from '../lib/styles/attachments.styles';
import {AttachmentFromEtoolsUpload, AttachmentsHelper} from './form-attachments-popup.helper';

export type FormBuilderAttachmentsPopupData = {
  attachments: StoredAttachment[];
  metadata: BlueprintMetadata;
  title: string;
  readonly?: boolean;
  computedPath: string[];
};

export type StoredAttachment = {
  url?: string;
  attachment?: number;
  hash?: string;
  filename: string;
  file_type: number | null;
};

export class FormAttachmentsPopup extends LitElement {
  @property() dialogOpened: boolean = true;
  @property() saveBtnClicked: boolean = false;
  @property() attachments: StoredAttachment[] = [];
  @property() metadata!: BlueprintMetadata;
  readonly: boolean = false;
  popupTitle: string = '';
  computedPath: string[] = [];

  @query('#link') link!: HTMLLinkElement;

  set dialogData({attachments, title, metadata, readonly, computedPath}: FormBuilderAttachmentsPopupData) {
    this.popupTitle = title;
    this.attachments = clone(attachments) || [];
    this.metadata = clone(metadata);
    this.readonly = Boolean(readonly);
    this.computedPath = computedPath;
  }

  get uploadUrl(): string {
    return AttachmentsHelper.uploadUrl!;
  }

  constructor() {
    super();
    if (!AttachmentsHelper.isInitialized) {
      throw new Error('Please initialize attachments popup before use');
    }
  }

  render(): TemplateResult | void {
    return template.call(this);
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }

  saveChanges(): void {
    const fileTypeNotSelected: boolean = this.attachments.some((attachment: GenericObject) => !attachment.file_type);
    if (fileTypeNotSelected) {
      return;
    }

    fireEvent(this, 'response', {confirmed: true, attachments: this.attachments});
  }
  protected downloadFile(attachment: GenericObject): void {
    const url: string = attachment.url;
    this.link.href = url;
    this.link.click();
    window.URL.revokeObjectURL(url);
  }

  protected changeFileType(attachment: GenericObject, newType: number | null): void {
    if (newType && attachment.file_type !== newType) {
      attachment.file_type = newType;
      this.performUpdate();
    }
  }

  protected attachmentsUploaded(attachments: {success: string[]; error: string[]}): void {
    try {
      const parsedAttachments: StoredAttachment[] = attachments.success
        .map((data: any) => (typeof data === 'string' ? JSON.parse(data) : data))
        .map((data: AttachmentFromEtoolsUpload) => {
          const {file_link, attachment, filename} = data;
          if (!file_link || !attachment || !filename) {
            console.warn('Missing fields in parsed attachment');
            return null;
          } else {
            return {
              url: file_link,
              attachment,
              filename,
              file_type: null
            } as StoredAttachment;
          }
        })
        .filter<StoredAttachment>((attachment: StoredAttachment | null): attachment is StoredAttachment =>
          Boolean(attachment)
        );
      this.attachments = [...this.attachments, ...parsedAttachments];
    } catch (e) {
      console.error(e);
      fireEvent(this, 'toast', {text: 'Can not upload attachments. Please try again later'});
    }
  }

  protected deleteAttachment(index: number): void {
    this.attachments.splice(index, 1);
    this.performUpdate();
  }

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      AttachmentsStyles,
      css`
        .file-selector__type-dropdown {
          flex-basis: 25%;
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
