import {
  ApolloClient as ApolloCoreClient,
  gql,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core/index.js';
import fetch from 'cross-fetch';

export class ApolloClient {
  private client: ApolloCoreClient<NormalizedCacheObject>;

  constructor(uri: string, headers?: Record<string, string>) {
    const link = new HttpLink({ uri, fetch, headers });
    this.client = new ApolloCoreClient({ link, cache: new InMemoryCache() });
  }

  async createPost(title: string, body?: string) {
    const mutation = gql`
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          id
          title
          body
        }
      }
    `;
    const variables = { input: { title, body } };
    const res = await this.client.mutate({ mutation, variables, errorPolicy: 'all' });
    if (res.errors?.length && !res.data?.createPost) {
      throw new Error(`Apollo createPost errors: ${JSON.stringify(res.errors)}`);
    }
    return res.data?.createPost;
  }

  async getPost(id: string) {
    const query = gql`
      query GetPost($id: ID!) {
        post(id: $id) {
          id
          title
          body
        }
      }
    `;
    const res = await this.client.query({
      query,
      variables: { id },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
    if (res.errors?.length && !res.data?.post) {
      throw new Error(`Apollo getPost errors: ${JSON.stringify(res.errors)}`);
    }
    return res.data?.post;
  }

  async getLaunches(pageSize = 10, after?: string) {
    const query = gql`
      query GetLaunches($pageSize: Int, $after: String) {
        launches(pageSize: $pageSize, after: $after) {
          cursor
          hasMore
          launches {
            id
            site
            mission {
              name
            }
            rocket {
              name
            }
            isBooked
          }
        }
      }
    `;
    const res = await this.client.query({
      query,
      variables: { pageSize, after },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
    if (res.errors?.length && !res.data?.launches) {
      throw new Error(`Apollo getLaunches errors: ${JSON.stringify(res.errors)}`);
    }
    return res.data?.launches;
  }

  async getLaunch(id: string) {
    const query = gql`
      query GetLaunch($id: ID!) {
        launch(id: $id) {
          id
          site
          mission {
            name
          }
          rocket {
            name
          }
          isBooked
        }
      }
    `;
    const res = await this.client.query({
      query,
      variables: { id },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
    if (res.errors?.length && !res.data?.launch) {
      throw new Error(`Apollo getLaunch errors: ${JSON.stringify(res.errors)}`);
    }
    return res.data?.launch;
  }

  async getAllPosts(page = 1, limit = 10) {
    const query = gql`
      query GetPosts($options: PageQueryOptions) {
        posts(options: $options) {
          data {
            id
            title
            body
          }
        }
      }
    `;
    const variables = { options: { paginate: { page, limit } } };
    const res = await this.client.query({
      query,
      variables,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
    if (res.errors?.length && !res.data?.posts) {
      throw new Error(`Apollo getAllPosts errors: ${JSON.stringify(res.errors)}`);
    }
    return res.data?.posts;
  }

  async updatePost(id: string, title?: string, body?: string) {
    const mutation = gql`
      mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
        updatePost(id: $id, input: $input) {
          id
          title
          body
        }
      }
    `;
    const variables = { id, input: { title, body } };
    const res = await this.client.mutate({ mutation, variables, errorPolicy: 'all' });
    if (res.errors?.length && !res.data?.updatePost) {
      throw new Error(`Apollo updatePost errors: ${JSON.stringify(res.errors)}`);
    }
    return res.data?.updatePost;
  }

  async deletePost(id: string) {
    const mutation = gql`
      mutation DeletePost($id: ID!) {
        deletePost(id: $id)
      }
    `;
    const res = await this.client.mutate({ mutation, variables: { id }, errorPolicy: 'all' });
    if (res.errors?.length && res.data?.deletePost === undefined) {
      throw new Error(`Apollo deletePost errors: ${JSON.stringify(res.errors)}`);
    }
    return res.data?.deletePost;
  }

  async bookTrips(launchIds: string[]) {
    const mutation = gql`
      mutation BookTrips($launchIds: [ID]!) {
        bookTrips(launchIds: $launchIds) {
          success
          message
          launches {
            id
            mission {
              name
            }
            isBooked
          }
        }
      }
    `;
    const res = await this.client.mutate({
      mutation,
      variables: { launchIds },
      errorPolicy: 'all',
    });
    if (res.errors?.length && !res.data?.bookTrips) {
      throw new Error(`Apollo bookTrips errors: ${JSON.stringify(res.errors)}`);
    }
    return res.data?.bookTrips;
  }

  async login(email?: string) {
    const mutation = gql`
      mutation Login($email: String) {
        login(email: $email) {
          id
          email
          token
        }
      }
    `;
    const res = await this.client.mutate({ mutation, variables: { email }, errorPolicy: 'all' });
    if (res.errors?.length && !res.data?.login) {
      throw new Error(`Apollo login errors: ${JSON.stringify(res.errors)}`);
    }
    return res.data?.login;
  }

  async cancelTrip(launchId: string) {
    const mutation = gql`
      mutation CancelTrip($launchId: ID!) {
        cancelTrip(launchId: $launchId) {
          success
          message
          launches {
            id
            mission {
              name
            }
            isBooked
          }
        }
      }
    `;
    const res = await this.client.mutate({ mutation, variables: { launchId }, errorPolicy: 'all' });
    if (res.errors?.length && !res.data?.cancelTrip) {
      throw new Error(`Apollo cancelTrip errors: ${JSON.stringify(res.errors)}`);
    }
    return res.data?.cancelTrip;
  }

  async dispose() {
    // Apollo Client doesn't require explicit disposal in most cases.
    // If using subscriptions or other long-lived links, close them here.
    // This is a no-op kept for API symmetry with other clients.
    return Promise.resolve();
  }
}
