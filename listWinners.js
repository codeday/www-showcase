/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
require('dotenv').config();
const { sign } = require('jsonwebtoken');
const { apiFetch } = require('@codeday/topo/utils');

const token = sign({ scopes: 'read:users' }, process.env.ACCOUNT_SECRET, { expiresIn: '5m' });

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
            email
          }
        }
      }
    }
  }
`;

async function fetchUsers(season) {
  const result = await apiFetch(queryFetchMembers, { eventGroup: season }, { Authorization: `Bearer ${token}` });
  return result.showcase
    .projects
    .map((p) =>
      p.members.filter((m) => m.account).map((m) =>
        p.awards.map((a) => ({
          name: m.account.name.replace(/,/g, ''),
          discordId: m.account.discordId,
          email: m.account.email,
          projectName: p.name.replace(/,/g, ''),
          award: a.modifier ? `${a.type} - ${a.modifier}` : a.type,
        }))
      )
    )
    .reduce((accum, e) => [...accum, ...e], [])
    .reduce((accum, e) => [...accum, ...e], []);
}

(async () => {
  const users = await fetchUsers(process.argv[2]);
  console.log(`name,email,discordTag,project,award`);
  for (const user of users) {
    console.log(`${user.name},${user.email},<@${user.discordId}>,${user.projectName},${user.award}`);
  }
})();
