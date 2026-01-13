import { expect, test } from '@fixtures';
import { validateSoapResponse } from '@services';
import { logger } from '@utils';

test(
  'sOAP Calculator Add',
  { tag: ['@smoke', '@regression'] },
  async ({ soapService, soapData, soapSchemas }) => {
    let result: { status: number; rawBody?: string; parsed?: number };

    await test.step('Call calculator.add SOAP operation', async () => {
      result = await soapService.call<number>(soapData.calculator.add);
    });

    await test.step('Verify add result', async () => {
      expect(result.status).toBe(200);
      expect(result.parsed).toBe(5);
    });

    await test.step('Validate add result schema', async () => {
      await validateSoapResponse(soapSchemas.calculatorSchema, result.parsed);
    });
  },
);

test(
  'sOAP Calculator Subtract',
  { tag: ['@smoke', '@regression'] },
  async ({ soapService, soapData, soapSchemas }) => {
    let result: { status: number; rawBody?: string; parsed?: number };

    await test.step('Call calculator.subtract SOAP operation', async () => {
      result = await soapService.call<number>(soapData.calculator.subtract);
    });

    await test.step('Log and verify subtract result', async () => {
      logger.info('Raw SOAP Response:', result.rawBody);
      logger.info('Parsed Result:', result.parsed);

      expect(result.status).toBe(200);
      expect(result.parsed).toBe(6);
    });

    await test.step('Validate subtract result schema', async () => {
      await validateSoapResponse(soapSchemas.calculatorSchema, result.parsed);
    });
  },
);

test(
  'sOAP Calculator Multiply',
  { tag: ['@smoke', '@regression'] },
  async ({ soapService, soapData, soapSchemas }) => {
    let result: { status: number; rawBody?: string; parsed?: number };

    await test.step('Call calculator.multiply SOAP operation', async () => {
      result = await soapService.call<number>(soapData.calculator.multiply);
    });

    await test.step('Log and verify multiply result', async () => {
      logger.info('Raw SOAP Response:', result.rawBody);
      logger.info('Parsed Result:', result.parsed);

      expect(result.status).toBe(200);
      expect(result.parsed).toBe(42);
    });

    await test.step('Validate multiply result schema', async () => {
      await validateSoapResponse(soapSchemas.calculatorSchema, result.parsed);
    });
  },
);

test(
  'sOAP Calculator Divide',
  { tag: ['@smoke', '@regression'] },
  async ({ soapService, soapData, soapSchemas }) => {
    let result: { status: number; rawBody?: string; parsed?: number };

    await test.step('Call calculator.divide SOAP operation', async () => {
      result = await soapService.call<number>(soapData.calculator.divide);
    });

    await test.step('Log and verify divide result', async () => {
      expect(result.status).toBe(200);
      expect(result.parsed).toBe(5);
    });

    await test.step('Validate divide result schema', async () => {
      await validateSoapResponse(soapSchemas.calculatorSchema, result.parsed);
    });
  },
);
