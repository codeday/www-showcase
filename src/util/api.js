import { print } from 'graphql';
import { GraphQLClient } from 'graphql-request';
// import { apiFetch } from '@codeday/topo/utils';

const apiFetch = (query, variables, headers) => {
  const client = new GraphQLClient('http://localhost:4000', { headers });
  return client.request(query, variables);
};
export async function tryAuthenticatedApiQuery(gql, params, token) {
  const headers = {
    'X-Showcase-Authorization': `Bearer ${token}`,
  };

  try {
    return {
      result: await apiFetch(print(gql), params || {}, token ? headers : {}),
    };
  } catch (err) {
    return { error: err };
  }
}
