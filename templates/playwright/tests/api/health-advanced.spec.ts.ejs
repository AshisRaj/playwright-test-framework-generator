import { expect, test } from '@fixtures';
import { APIResponse } from '@playwright/test';
import { validateApiResponse } from '@services';

test.describe('mocked Health API - Advanced', () => {
  test(
    'should succeed with retry on failure',
    { tag: ['@smoke', '@regression'] },
    async ({ apiService, apiSchemas }) => {
      const response: APIResponse = await apiService.get('/mock-health-retry', {
        retryCount: 2,
        retryDelayMs: 200,
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('OK');
      await validateApiResponse(apiSchemas.healthSchema, body);
    },
  );

  test(
    'should poll until healthy',
    { tag: ['@smoke', '@regression'] },
    async ({ apiService, apiSchemas }) => {
      const response: APIResponse = await apiService.get('/mock-health-poll', {
        polling: true,
        pollingIntervalMs: 100,
        pollingTimeoutMs: 2000,
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('OK');
      await validateApiResponse(apiSchemas.healthSchema, body);
    },
  );

  test(
    'should delay between retries and respect timeout',
    { tag: ['@smoke', '@regression'] },
    async ({ apiService, apiSchemas }) => {
      const response: APIResponse = await apiService.get('/mock-health-delay', {
        retryCount: 3,
        retryDelayMs: 500,
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('OK');
      await validateApiResponse(apiSchemas.healthSchema, body);
    },
  );
});
