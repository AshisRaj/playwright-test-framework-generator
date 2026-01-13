import { expect, test } from '@fixtures';
import { validateSoapResponse } from '@services';

test(
  'validation should fail for empty CapitalCity',
  { tag: ['@negative', '@regression'] },
  async ({ soapSchemas }) => {
    await expect(validateSoapResponse(soapSchemas.capitalCitySchema, '')).rejects.toThrow();
  },
);

test(
  'validation should fail for numeric country name',
  { tag: ['@negative', '@regression'] },
  async ({ soapSchemas }) => {
    await expect(validateSoapResponse(soapSchemas.countryNameSchema, 123)).rejects.toThrow();
  },
);

test(
  'validation should fail for NumberToWords numeric response',
  { tag: ['@negative', '@regression'] },
  async ({ soapSchemas }) => {
    await expect(validateSoapResponse(soapSchemas.numberToWordsSchema, 100)).rejects.toThrow();
  },
);

test(
  'validation should fail for NumberToDollars missing dollar keyword',
  { tag: ['@negative', '@regression'] },
  async ({ soapSchemas }) => {
    await expect(validateSoapResponse(soapSchemas.numberToDollarsSchema, '100')).rejects.toThrow();
  },
);
