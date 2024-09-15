// saveGraphqlRequestToLS.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { saveGraphqlRequestToLS } from './graphqlRequestHistory';

describe('saveGraphqlRequestToLS', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean state
    localStorage.clear();
  });

  it('should save the GraphQL request to localStorage', () => {
    const url = 'https://example.com/api/graphql';
    const sdl = 'type Query { test: String }';
    const query = 'query { test }';
    const headers = '{"Authorization":"Bearer token"}';

    // Call the function
    saveGraphqlRequestToLS(url, sdl, query, headers);

    // Retrieve data from localStorage
    const storedData = localStorage.getItem('graphqlRequestHistory');

    // Expect that data is saved correctly
    expect(storedData).not.toBeNull();

    // Parse and check the stored data
    const parsedData = JSON.parse(storedData as string);
    expect(parsedData).toHaveLength(1);
    expect(parsedData[0]).toEqual({
      endpoint: 'api/graphql', // From the URL processing
      sdl,
      query,
      headers,
    });
  });
});
