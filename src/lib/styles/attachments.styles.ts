import {css, CSSResult} from 'lit';

// language=CSS
export const AttachmentsStyles: CSSResult = css`
  .file-selector-container {
    display: flex;
    flex-flow: row;
    align-items: center;
    padding: 8px 0;
  }
  .filename-container {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--secondary-text-color, rgba(0, 0, 0, 0.54));
    margin: 0 14px 0 0;
    min-width: 145px;
    overflow-wrap: break-word;
    font-size: var(--etools-font-size-16, 16px);
  }
  :host([is-readonly]) .filename-container {
    border-bottom-color: transparent;
  }
  .filename {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .file-icon {
    width: 24px;
    flex: none;
    color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
  }
  .upload-button,
  .download-button {
    color: var(--primary-color);
    min-width: 130px;
  }
  .change-button {
    color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
  }
  etools-icon {
    margin-right: 8px;
  }
  .file-selector-container.with-type-dropdown {
    padding: 0;
  }
  .file-selector-container.with-type-dropdown etools-dropdown.type-dropdown {
    flex: none;
    width: 209px;
  }
  .file-selector-container.with-type-dropdown .filename-container {
    height: 32px;
    box-sizing: border-box;
    margin: 22px 8px;
    border-bottom: 1px solid var(--gray-20);
  }
  .file-selector-container.with-type-dropdown .delete-button,
  .file-selector-container.with-type-dropdown .download-button {
    margin-top: 15px;
  }
  etools-upload-multi.with-padding {
    padding: 12px 9px 12px 0;
    box-sizing: border-box;
  }
`;
