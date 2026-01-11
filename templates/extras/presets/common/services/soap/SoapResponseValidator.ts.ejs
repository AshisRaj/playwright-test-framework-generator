import { logger } from '@utils';
import { getSoapSchemaValidator } from './SoapSchemaRegistry';

export async function validateSoapResponse(
  schemaOrPath: Record<string, unknown> | string,
  data: unknown,
): Promise<true> {
  const validate = await getSoapSchemaValidator(schemaOrPath as unknown as string | object);
  const valid = validate(data);
  if (!valid) {
    logger.error('SOAP response schema validation failed', validate.errors);
    throw new Error(`SOAP response schema validation failed: ${JSON.stringify(validate.errors)}`);
  }
  return true;
}
