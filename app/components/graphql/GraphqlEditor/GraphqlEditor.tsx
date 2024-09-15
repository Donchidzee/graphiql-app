import React, { useEffect, useState } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import { buildClientSchema, getIntrospectionQuery } from 'graphql';

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

const GraphiQLEditor = ({ url, sdlUrl }: { url: string; sdlUrl: string }) => {
  const [query, setQuery] = useState(defaultQuery);
  const [variables, setVariables] = useState('{}');
  const [headers, setHeaders] = useState('{"foo":"bar"}');
  const [schema, setSchema] = useState(null);

  const graphQLFetcher = (graphQLParams) => {
    return fetch(url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphQLParams),
      credentials: 'omit',
    }).then((response) => response.json());
  };

  useEffect(() => {
    function fetchSDLDocumentation() {
      return fetch(sdlUrl, {
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

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
  };

  const handleVariablesChange = (newVariables) => {
    setVariables(newVariables);
  };

  const handleHeadersChange = (newHeaders) => {
    setHeaders(newHeaders);
  };

  useEffect(() => {
    console.log('query', query);
  }, [query]);

  useEffect(() => {
    console.log('variables', variables);
  }, [variables]);

  useEffect(() => {
    console.log('headers', headers);
  }, [headers]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GraphiQL
        fetcher={graphQLFetcher}
        defaultQuery={defaultQuery}
        defaultHeaders={headers}
        variables={variables}
        query={query}
        headers={headers}
        onEditQuery={(newQuery) => {
          handleQueryChange(newQuery);
        }}
        onEditVariables={(newVariables) => {
          handleVariablesChange(newVariables);
        }}
        onEditHeaders={(newHeaders) => {
          handleHeadersChange(newHeaders);
        }}
        schema={schema}
      />
    </div>
  );
};

export default GraphiQLEditor;
