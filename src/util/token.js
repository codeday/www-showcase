import { sign, verify } from 'jsonwebtoken';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export function mintToken(session, programId, eventGroupId, subEventId, regionId) {
  const { nickname: u, admin: a } = session.user;
  const createProps = {
    e: subEventId,
    g: eventGroupId,
    p: programId,
    r: regionId,
  };
  Object.keys(createProps).forEach(key => createProps[key] === undefined ? delete createProps[key] : {});

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
