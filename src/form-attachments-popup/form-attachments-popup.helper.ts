export class FormAttachmentsPopupHelper {
  get isInitialized(): boolean {
    return Boolean(this.uploadUrl);
  }
  uploadUrl: string | null = null;
  jwtLocalStorageKey?: string;

  initialize(uploadUrl: string, jwtLocalStorageKey?: string): void {
    this.uploadUrl = uploadUrl;
    this.jwtLocalStorageKey = jwtLocalStorageKey;
  }
}

const AttachmentsHelper: FormAttachmentsPopupHelper = new FormAttachmentsPopupHelper();
export {AttachmentsHelper};
