import {FieldValidator} from '../utils/validations.helper';
import {GenericObject} from './global.types';

/** JSON file from backend */
export type ChecklistFormJson = {
  blueprint: {
    code: string;
    metadata: BlueprintMetadata;
    structure: BlueprintGroup;
    title: string;
  };
  value: GenericObject;
};
/** --------- */

export type BlueprintGroup = {
  type: 'group';
  extra: GenericObject;
  styling: string[];
  name: string;
  repeatable: boolean;
  required: boolean;
  title: string | null;
  children: (BlueprintGroup | BlueprintField | Information)[];
};

export type BlueprintField = {
  type: 'field';
  extra: GenericObject;
  styling: string[];
  name: string;
  repeatable: boolean;
  required: boolean;
  input_type: 'text' | 'likert_scale' | 'bool' | 'number' | 'number-integer' | 'number-float'; // add more
  label: string;
  validations: string[];
  help_text: string;
  placeholder: string;
  default_value: null;
  options_key: null;
};

export type Information = {
  type: 'information';
  extra: GenericObject;
  styling: string[];
  text: string;
};

/** Metadata for blueprint structure */
export type BlueprintMetadata = {
  options: GenericObject<BlueprintMetadataOptions>;
  validations: GenericObject<FieldValidator>;
  offline_enabled: boolean;
  allow_multiple_responses: boolean;
};

export type BlueprintMetadataOptions = {
  option_type: string;
  values: BlueprintMetadataOption[];
};

export type BlueprintMetadataOption = {value: string; label: string};
