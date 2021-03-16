/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
require('dotenv').config();
const { sign } = require('jsonwebtoken');
const { apiFetch } = require('@codeday/topo/utils');

const token = sign({ scopes: 'write:users' }, process.env.ACCOUNT_SECRET, { expiresIn: '5m' });

const queryGrantBadge = `
  mutation GrantBadge  ($username: String!, $badge: ID!) {
    account {
      grantBadge(where: {username: $username}, badge: { id: $badge })
    }
  }
`;

async function grantBadge({ username, badge }) {
  return apiFetch(queryGrantBadge, { username, badge }, { Authorization: `Bearer ${token}` });
}

(async () => {
  console.log(await grantBadge({ username: process.argv[2], badge: process.argv[3] }));
})();
