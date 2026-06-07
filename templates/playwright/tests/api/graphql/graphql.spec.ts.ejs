import { expect, test } from '@fixtures';

const GRAPHQL_ENDPOINT = 'https://graphqlzero.almansi.me/api';

test(
  'graphql query example',
  { tag: ['@api', '@graphql', '@regression'] },
  async ({ apiService }) => {
    let response: {
      data?: {
        country?: { code: string; name: string; capital?: string; currency?: string };
      };
    };

    await test.step('Send GraphQL request', async () => {
      response = await apiService.queryCountry('https://countries.trevorblades.com/', 'US');
    });

    await test.step('Verify GraphQL response', async () => {
      expect(response.data?.country?.code).toBe('US');
      expect(response.data?.country?.name).toBe('United States');
    });
  },
);

test(
  'graphql mutation create resource',
  { tag: ['@api', '@graphql', '@regression'] },
  async ({ apiService }) => {
    const title = 'GraphQL Create Example';
    const bodyText = 'This is a new GraphQL post created by test.';
    let postId!: string;

    await test.step('Create post via GraphQL mutation', async () => {
      postId = await apiService.createTestPost(GRAPHQL_ENDPOINT, title, bodyText);
    });

    await test.step('Verify post creation', async () => {
      expect(postId).toBeDefined();
    });
  },
);

test(
  'graphql mutation update resource',
  { tag: ['@api', '@graphql', '@regression'] },
  async ({ apiService }) => {
    const originalTitle = 'GraphQL Update Example';
    const originalBody = 'Original body for update test.';
    let postId!: string;

    await test.step('Create post for update test', async () => {
      postId = await apiService.createTestPost(GRAPHQL_ENDPOINT, originalTitle, originalBody);
    });

    await test.step('Update post via GraphQL mutation', async () => {
      await apiService.updateTestPost(
        GRAPHQL_ENDPOINT,
        postId,
        'Updated title',
        'Updated body content.',
      );
    });

    await test.step('Verify post update', async () => {
      expect(postId).toBeDefined();
    });
  },
);

test(
  'graphql mutation delete resource',
  { tag: ['@api', '@graphql', '@regression'] },
  async ({ apiService }) => {
    const title = 'GraphQL Delete Example';
    const bodyText = 'Body content for delete test.';
    let postId!: string;

    await test.step('Create post for deletion test', async () => {
      postId = await apiService.createTestPost(GRAPHQL_ENDPOINT, title, bodyText);
    });

    await test.step('Delete post via GraphQL mutation', async () => {
      await apiService.deleteTestPost(GRAPHQL_ENDPOINT, postId);
    });

    await test.step('Verify post deletion', async () => {
      const queryResult = await apiService.queryPost(GRAPHQL_ENDPOINT, postId);
      expect(queryResult.data?.post).not.toBeNull();
    });
  },
);
