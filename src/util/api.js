import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';

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
