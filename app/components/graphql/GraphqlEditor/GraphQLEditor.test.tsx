import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GraphiQLEditor from './GraphqlEditor';
import { getIntrospectionQuery } from 'graphql';
import '@testing-library/jest-dom';

vi.mock('graphiql', () => ({
  __esModule: true,
  default: vi.fn(() => <div>GraphiQL Component</div>),
}));

vi.mock('graphql', () => ({
  buildClientSchema: vi.fn(),
  getIntrospectionQuery: vi.fn(),
}));

vi.mock('../../../../src/helpers/graphqlRequestHistory', () => ({
  saveGraphqlRequestToLS: vi.fn(),
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('GraphiQLEditor', () => {
  it('renders correctly and performs fetches', async () => {
    const mockOnQueryChange = vi.fn();
    const mockOnVariablesChange = vi.fn();
    const mockOnHeadersChange = vi.fn();

    render(
      <GraphiQLEditor
        url="https://example.com/graphql"
        sdlUrl="https://example.com/sdl"
        query="{ hello }"
        variables="{ \'name\': \'World\' }"
        headers="{ \'Authorization\': \'Bearer token\' }"
        onQueryChange={mockOnQueryChange}
        onVariablesChange={mockOnVariablesChange}
        onHeadersChange={mockOnHeadersChange}
      />
    );

    expect(screen.getByText('GraphiQL Component')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.com/sdl',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ query: getIntrospectionQuery() }),
        })
      );
    });
  });
});
