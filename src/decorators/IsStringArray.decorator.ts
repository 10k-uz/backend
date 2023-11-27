import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isStringArray', async: false })
export class IsStringArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (!Array.isArray(value)) {
      return false;
    }

    return value.every((item) => typeof item === 'string');
  }
}

export function IsStringArray(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} should be string in the array`,
      },
      constraints: [],
      validator: IsStringArrayConstraint,
    });
  };
}
