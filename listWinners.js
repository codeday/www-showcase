/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
require('dotenv').config();
const { sign } = require('jsonwebtoken');
const { apiFetch } = require('@codeday/topo/utils');

const token = sign({ scopes: 'write:users' }, process.env.ACCOUNT_SECRET, { expiresIn: '5m' });

// eslint-disable-next-line no-secrets/no-secrets
const queryFetchMembers = `
  query ShowYourWorkBadgesOwed($eventGroup: String!) {
    showcase {
      projects(where: { awarded: true, eventGroup: $eventGroup }) {
        name
        awards {
          type
          modifier
        }

        members {
          account {
            name
            discordId
          }
        }
      }
    }
  }
`;

async function fetchUsers(season) {
  const result = await apiFetch(queryFetchMembers, { eventGroup: season });
  return result.showcase
    .projects.map((p) => p.members.map((m) => p.awards.map((a) => ({
      name: m.account.name.replace(/,/g, ''),
      discordId: m.account.discordId,
      projectName: p.name.replace(/,/g, ''),
      award: a.modifier ? `${a.type} - ${a.modifier}` : a.type,
    }))))
    .reduce((accum, e) => [...accum, ...e], [])
    .reduce((accum, e) => [...accum, ...e], []);
}

(async () => {
  const users = await fetchUsers(process.argv[2]);
  console.log(`name,discordTag,project,award`);
  for (const user of users) {
    console.log(`${user.name},<@${user.discordId}>,${user.projectName},${user.award}`);
  }
})();
