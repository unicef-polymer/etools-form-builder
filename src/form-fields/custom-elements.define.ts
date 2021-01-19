/**
 * Form field elements
 */
import {TextField} from './single-fields/text-field';
import {NumberField} from './single-fields/number-field';
import {ScaleField} from './single-fields/scale-field';
import {WideField} from './single-fields/wide-field';
import {FieldRendererComponent} from './field-renderer-component';
import {RepeatableTextField} from './repeatable-fields/repeatable-text-field';
window.customElements.define('number-field', NumberField);
window.customElements.define('text-field', TextField);
window.customElements.define('scale-field', ScaleField);
window.customElements.define('wide-field', WideField);
window.customElements.define('field-renderer', FieldRendererComponent);
window.customElements.define('repeatable-text-field', RepeatableTextField);
