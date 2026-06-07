import { expect, test } from '@fixtures';

test.describe('apollo GraphQL operations', () => {
  test(
    'apollo GraphQL READ - all launches',
    { tag: ['@api', '@graphql', '@apollo', '@regression'] },
    async ({ apolloClient }) => {
      await test.step('Fetch available launches', async () => {
        const launchesResult = await apolloClient.getLaunches(10);
        expect(launchesResult).toBeDefined();
        expect(Array.isArray(launchesResult.launches)).toBeTruthy();
        expect(launchesResult.launches.length).toBeGreaterThan(0);
      });
    },
  );

  test(
    'apollo GraphQL READ - launch by id',
    { tag: ['@api', '@graphql', '@apollo', '@regression'] },
    async ({ apolloClient }) => {
      let launchId!: string;

      await test.step('Fetch one launch id', async () => {
        const launchesResult = await apolloClient.getLaunches(1);
        expect(launchesResult).toBeDefined();
        expect(Array.isArray(launchesResult.launches)).toBeTruthy();
        expect(launchesResult.launches.length).toBeGreaterThan(0);
        launchId = launchesResult.launches[0].id;
      });

      await test.step('Fetch launch by id and verify fields', async () => {
        const launch = await apolloClient.getLaunch(launchId);
        expect(launch.id).toBe(launchId);
        expect(launch.mission?.name).toBeDefined();
      });
    },
  );

  test(
    'apollo GraphQL CRUD - create trip booking',
    { tag: ['@api', '@graphql', '@apollo', '@regression'] },
    async ({ apolloClient }) => {
      let launchId!: string;

      await test.step('Fetch available launch to book', async () => {
        const launchesResult = await apolloClient.getLaunches(1);
        expect(launchesResult.launches.length).toBeGreaterThan(0);
        launchId = launchesResult.launches[0].id;
      });

      await test.step('Book trip for launch', async () => {
        const bookResult = await apolloClient.bookTrips([launchId]);
        expect(bookResult.success).toBeTruthy();
        expect(bookResult.launches[0].isBooked).toBeTruthy();
      });
    },
  );

  test(
    'apollo GraphQL CRUD - update user login',
    { tag: ['@api', '@graphql', '@apollo', '@regression'] },
    async ({ apolloClient }) => {
      await test.step('User login mutation', async () => {
        const loginResult = await apolloClient.login('test@example.com');
        expect(loginResult).toBeDefined();
        expect(loginResult.id).toBeDefined();
        expect(loginResult.email).toBe('test@example.com');
        expect(loginResult.token).toBeDefined();
      });
    },
  );

  test(
    'apollo GraphQL CRUD - delete trip cancellation',
    { tag: ['@api', '@graphql', '@apollo', '@regression'] },
    async ({ apolloClient }) => {
      let launchId!: string;

      await test.step('Fetch available launch to book', async () => {
        const launchesResult = await apolloClient.getLaunches(1);
        expect(launchesResult.launches.length).toBeGreaterThan(0);
        launchId = launchesResult.launches[0].id;
      });

      await test.step('Book trip for cancellation test', async () => {
        const bookResult = await apolloClient.bookTrips([launchId]);
        expect(bookResult.success).toBeTruthy();
      });

      await test.step('Cancel booked trip', async () => {
        const cancelResult = await apolloClient.cancelTrip(launchId);
        expect(cancelResult.success).toBeTruthy();
        expect(cancelResult.launches[0].isBooked).toBeFalsy();
      });
    },
  );
});
