import { BadRequestException } from '@nestjs/common';

export class MissingArgumentsException extends BadRequestException {
  constructor(...missingArgs: string[]) {
    super(missingArgs, `Missing arguments are required!`);
  }
}
