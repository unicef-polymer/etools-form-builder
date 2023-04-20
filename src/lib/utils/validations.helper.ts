import {getTranslation} from './translate';

export enum Validations {
  MAX_LENGTH = 'max_length',
  REGEX = 'regex',
  LOWER_THAN = 'lt',
  GREATER_THAN = 'gt'
}

export type MaxLengthValidation = {
  name: Validations.MAX_LENGTH;
  [Validations.MAX_LENGTH]: number;
};

export type RegexValidation = {
  name: Validations.REGEX;
  [Validations.REGEX]: string;
};

export type GreaterValidation = {
  name: Validations.GREATER_THAN;
  threshold: number;
  allow_equality: boolean;
};

export type LowerValidation = {
  name: Validations.LOWER_THAN;
  threshold: number;
  allow_equality: boolean;
};

export type FieldValidator = MaxLengthValidation | RegexValidation | GreaterValidation | LowerValidation;

export function validate(validators: FieldValidator[], value: any, language: string): string | null {
  let message: string | null = null;
  for (const validator of validators) {
    message = checkValidation(validator, value, language);
    if (message) {
      break;
    }
  }
  return message;
}

function checkValidation(validation: FieldValidator, value: number | string | null, language: string): string | null {
  switch (validation.name) {
    case Validations.MAX_LENGTH:
      const maxLength: number = Number(validation[Validations.MAX_LENGTH]) + 1;
      return String(value).length < maxLength
        ? null
        : getTranslation(language, 'TEXT_MUST_BE_LESS_CHARS').replace('{0}', String(maxLength));
    case Validations.REGEX:
      const regex: RegExp = new RegExp(`^${validation[Validations.REGEX]}$`);
      return regex.test(String(value)) ? null : getTranslation(language, 'DOES_NOT_MATCH_PATTERN');
    case Validations.GREATER_THAN:
      const greaterThan: number = Number(validation.threshold) - Number(validation.allow_equality);
      return Number(value) > greaterThan
        ? null
        : getTranslation(language, 'NUMBER_MUST_BE_GREATER_THAN').replace('{0}', String(greaterThan));
    case Validations.LOWER_THAN:
      const lowerThan: number = Number(validation.threshold) + Number(validation.allow_equality);
      return Number(value) < lowerThan
        ? null
        : getTranslation(language, 'NUMBER_MUST_BE_LOWER_THAN').replace('{0}', String(lowerThan));
    default:
      return null;
  }
}
