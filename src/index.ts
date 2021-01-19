/**
 * Styles
 */
export * from './lib/styles/form-builder-card.styles';
import './lib/styles/input-styles';

/**
 * Form group elements
 */
import './form-groups/custom-elements.define';
/**
 * Form field elements
 */
import './form-fields/custom-elements.define';
export * from './form-fields/single-fields/base-field';

/**
 * Attachments Popup
 */
import {FormAttachmentsPopup} from './form-attachments-popup';
window.customElements.define('form-attachments-popup', FormAttachmentsPopup);
