import { sign, verify } from 'jsonwebtoken';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

// TODO(@tylermenezes): At some point we need to fix this that region, eventId, etc. are automatically determined.
//                      Not sure what the best way to do that is right now.
export function mintToken(session, programId, eventGroupId, subEventId) {
  const { nickname: u, admin: a } = session.user;
  const createProps = programId && eventGroupId && subEventId ? {
    e: subEventId,
    g: eventGroupId,
    p: programId,
    r: null,
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

export function mintAllTokens(session, programId, eventGroupId, subEventIds) {
  return Object.keys(subEventIds)
    .map((k) => ({
      id: k,
      name: subEventIds[k],
      token: mintToken(session, programId, eventGroupId, k),
    }));
}

export function mintJudgingToken(originalJudgingToken, username) {
  const {
    e, g, p, r, j, jvr,
  } = verify(
    originalJudgingToken,
    serverRuntimeConfig.showcase.secret,
    { audience: 'www-showcase' }
  );

  return sign(
    {
      e, g, p, r, j, jvr, jum: true, u: username,
    },
    serverRuntimeConfig.showcase.secret,
    { audience: serverRuntimeConfig.showcase.audience}
  );
}
