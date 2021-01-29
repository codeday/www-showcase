import { sign, verify } from 'jsonwebtoken';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

// TODO(@tylermenezes): At some point we need to fix this that region, eventId, etc. are automatically determined.
//                      Not sure what the best way to do that is right now.
export function mintToken(session, subEvent) {
  const { name: u, admin: a } = session.user;
  const createProps = {
    e: `${serverRuntimeConfig.showcase.program}.${serverRuntimeConfig.showcase.eventGroup}.${subEvent}`,
    g: serverRuntimeConfig.showcase.eventGroup,
    p: serverRuntimeConfig.showcase.program,
    r: null,
  };

  return sign({
    a,
    u,
    ...(serverRuntimeConfig.showcase.allowCreate && subEvent ? createProps : {}),
  },
  serverRuntimeConfig.showcase.secret,
  {
    audience: serverRuntimeConfig.showcase.audience,
  });
}

export function mintAllTokens(session) {
  return serverRuntimeConfig.showcase.availableSubevents
    .reduce((accum, event) => ({ ...accum, [event]: mintToken(session, event) }), {});
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
      e, g, p, r, j, jvr, u: username,
    },
    serverRuntimeConfig.showcase.secret,
    { audience: serverRuntimeConfig.showcase.audience }
  );
}
