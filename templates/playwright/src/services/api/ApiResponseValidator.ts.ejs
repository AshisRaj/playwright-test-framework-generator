import { getApiSchemaValidator } from '@services';
import { logger } from '@utils';

export async function validateApiResponse(
  schemaOrPath: Record<string, unknown> | string,
  data: unknown,
) {
  const validate = await getApiSchemaValidator(schemaOrPath as unknown as string | object);
  const valid = validate(data);
  if (!valid) {
    logger.error('Response schema validation failed', validate.errors);
    throw new Error(`Response schema validation failed: ${JSON.stringify(validate.errors)}`);
  }
  return true;
}
