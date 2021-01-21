/**
 * Form field elements
 */
import {TextField} from './single-fields/text-field';
import {NumberField} from './single-fields/number-field';
import {ScaleField} from './single-fields/scale-field';
import {FieldRendererComponent} from './field-renderer-component';
import {RepeatableTextField} from './repeatable-fields/repeatable-text-field';
import {RepeatableNumberField} from './repeatable-fields/repeatable-number-field';
import {RepeatableScaleField} from './repeatable-fields/repeatable-scale-field';
window.customElements.define('number-field', NumberField);
window.customElements.define('text-field', TextField);
window.customElements.define('scale-field', ScaleField);
window.customElements.define('field-renderer', FieldRendererComponent);
window.customElements.define('repeatable-text-field', RepeatableTextField);
window.customElements.define('repeatable-number-field', RepeatableNumberField);
window.customElements.define('repeatable-scale-field', RepeatableScaleField);
