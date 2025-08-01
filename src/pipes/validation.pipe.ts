/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from 'src/common/bases/api-response';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    const formatErrors = this.formatErrors(errors);

    if (errors.length > 0) {
      const response = ApiResponse.error(
        formatErrors,
        'Failed',
        HttpStatus.BAD_REQUEST,
      );
      throw new HttpException(response, HttpStatus.BAD_REQUEST);
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]) {
    const result = {};
    errors.forEach((err) => {
      if (err.constraints) {
        result[err.property] = Object.values(err.constraints);
      }
    });
    return result;
  }
}
