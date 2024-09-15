import React, { useEffect, useState } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import { saveGraphqlRequestToLS } from '../../../../src/helpers/graphqlRequestHistory';
import { usePathname } from 'next/navigation';

const defaultQuery = `
  query {
    characters(page: 2, filter: { name: "rick" }) {
      info {
        count
      }
      results {
        name
      }
    }
    location(id: 1) {
      id
    }
    episodesByIds(ids: [1, 2]) {
      id
    }
  }
`;

const defaultUrl = 'https://rickandmortyapi.com/graphql';

type HeadersObject = Record<string, string>;

const GraphiQLEditor = ({
  url,
  sdlUrl,
  query,
  variables,
  headers,
  onQueryChange,
  onVariablesChange,
  onHeadersChange,
}: {
  url: string;
  sdlUrl: string;
  query: string;
  variables: string;
  headers: string;
  onQueryChange: (newQuery: string) => void;
  onVariablesChange: (newVariables: string) => void;
  onHeadersChange: (newHeaders: string) => void;
}) => {
  const [schema, setSchema] = useState(null);
  const pathname = usePathname();

  const graphQLFetcher = (graphQLParams) => {
    let headersObj: HeadersObject = { 'Content-Type': 'application/json' };

    try {
      const parsedHeaders: HeadersObject = JSON.parse(headers);
      headersObj = { ...headersObj, ...parsedHeaders };
    } catch (error) {
      console.warn('Invalid headers JSON, using default headers only', error);
    }

    const activeUrl = url || defaultUrl;

    saveGraphqlRequestToLS(
      pathname,
      graphQLParams.query,
      graphQLParams.variables,
      headers
    );

    return fetch(activeUrl, {
      method: 'post',
      headers: headersObj,
      body: JSON.stringify(graphQLParams),
      credentials: 'omit',
    }).then((response) => response.json());
  };

  useEffect(() => {
    function fetchSDLDocumentation() {
      const activeUrl = sdlUrl || defaultUrl;

      return fetch(activeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: getIntrospectionQuery() }),
      }).then((response) => response.json());
    }

    fetchSDLDocumentation().then((result) => {
      const introspectionSchema = buildClientSchema(result.data);
      setSchema(introspectionSchema);
    });
  }, [sdlUrl]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GraphiQL
        defaultQuery={defaultQuery}
        fetcher={graphQLFetcher}
        variables={variables}
        query={query}
        headers={headers}
        onEditQuery={onQueryChange}
        onEditVariables={onVariablesChange}
        onEditHeaders={onHeadersChange}
        schema={schema}
        disableTabs
      />
    </div>
  );
};

export default GraphiQLEditor;
