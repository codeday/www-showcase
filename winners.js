const fetch = require('node-fetch');
const stringify = require('csv-stringify/lib/sync');
const fs = require('fs');

const query = `
  query {
    showcase {
      projects(where: { awarded: true, eventGroup: "${process.argv[2]}" }) {
        name
        awards {
          type
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

(async () => {
  const response = await fetch('http://graph.codeday.org', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query, variables: {}, }),
  });
  const result = await response.json();
  const table = result?.data?.showcase.projects
    .map((p) => ({
      project: p.name,
      award: p.awards[0]?.type,
      members: p.members,
    }))
    .map(({ members, ...rest }) => members.map((m) => ({
      ...rest,
      name: m.account?.name,
      discord: m.account?.discordId,
    })))
    .reduce((accum, e) => [...accum, ...e], []);

  console.log(stringify(table, { header: true }));
})();
