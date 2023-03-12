/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
require('dotenv').config();
const { sign } = require('jsonwebtoken');
const { apiFetch } = require('@codeday/topo/utils');

const TYPE_TO_BADGE = {
  'best-in-show': 'best-in-show',
  'best-in-class': 'best-in-class',
  special: 'special-prize',
};

const token = sign({ scopes: 'write:users' }, process.env.ACCOUNT_SECRET, { expiresIn: '5m' });

// eslint-disable-next-line no-secrets/no-secrets
const queryFetchMembers = `
  query ShowYourWorkBadgesOwed($eventGroup: String!) {
    showcase {
      projects(where: { awarded: true, eventGroup: $eventGroup }) {
        awards {
          type
        }

        members {
          username
        }
      }
    }
  }
`;

const queryGrantBadge = `
  mutation GrantBadge  ($username: String!, $badge: ID!) {
    account {
      grantBadge(where: {username: $username}, badge: { id: $badge })
    }
  }
`;

async function fetchUsers(season) {
  const result = await apiFetch(queryFetchMembers, { eventGroup: season });
  return result.showcase
    .projects.map((p) => p.members.map((m) => p.awards.map((a) => ({
      username: m.username,
      badge: TYPE_TO_BADGE[a.type] || null,
    }))))
    .reduce((accum, e) => [...accum, ...e], [])
    .reduce((accum, e) => [...accum, ...e], [])
    .filter((e) => e.username && e.badge);
}

async function grantBadge({ username, badge }) {
  return apiFetch(queryGrantBadge, { username, badge }, { Authorization: `Bearer ${token}` });
}

(async () => {
  const users = await fetchUsers(process.argv[2]);
  for (const user of users) {
    try {
      console.log(`Granting badge ${user.badge} to ${user.username}`);
      console.log(await grantBadge(user));
    } catch (ex) { console.error(ex); }
  }
})();
