import { sign, verify } from 'jsonwebtoken';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export function mintToken(session, programId, eventGroupId, subEventId, regionId) {
  const { nickname: u, admin: a } = session.user;
  const createProps = programId && eventGroupId && subEventId ? {
    e: subEventId,
    g: eventGroupId,
    p: programId,
    r: regionId,
  } : {};

  return sign({
    a,
    u,
    ...createProps,
  },
  serverRuntimeConfig.showcase.secret,
  {
    audience: serverRuntimeConfig.showcase.audience,
  });
}

export function mintAllTokens(session, programId, eventGroupId, subEventIds, title) {
  return Object.keys(subEventIds)
    .map((k) => {
      const subEvent = subEventIds[k];
      const region = typeof subEvent === 'object' ? subEvent.region || null : null;
      const subEventTitle = typeof subEvent === 'object' ? subEvent.title || null : subEvent;

      return {
        id: k,
        name: title ? `${title} - ${subEventTitle}` : subEventIds[k],
        token: mintToken(session, programId, eventGroupId, k, region),
      };
    });
}

export function mintJudgingToken(originalJudgingToken, username) {
  const {
    e, g, p, r, j, jvr, jum,
  } = verify(
    originalJudgingToken,
    serverRuntimeConfig.showcase.secret,
    { audience: 'www-showcase' }
  );

  return sign(
    {
      e, g, p, r, j, jvr, jum, u: username,
    },
    serverRuntimeConfig.showcase.secret,
    { audience: serverRuntimeConfig.showcase.audience }
  );
}
