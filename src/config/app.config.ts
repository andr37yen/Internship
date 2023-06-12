import { registerAs } from '@nestjs/config';
import type { IServerConfig } from './interfaces';
import Joi from 'joi';

export default registerAs('app', (): IServerConfig => {
  const values = {
    port: Number(process.env.PORT),
  };

  const schema = Joi.object<IServerConfig>({
    port: Joi.number().integer().default(5555),
  });

  const { error } = schema.validate(values, { abortEarly: false });

  if (error) {
    throw new Error(`Validation failed - ${error.message}`);
  }

  return values;
});