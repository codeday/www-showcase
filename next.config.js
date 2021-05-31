module.exports = {
  serverRuntimeConfig: {
    auth0: {
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
      authorizationUrl: `https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&prompt=login`
    },
    showcase: {
      audience: process.env.SHOWCASE_AUDIENCE,
      secret: process.env.SHOWCASE_SECRET,
      allowCreate: process.env.SHOWCASE_ALLOW_CREATE === 'true',
      eventGroup: process.env.SHOWCASE_EVENT_GROUP,
      program: process.env.SHOWCASE_PROGRAM,
      availableSubevents: process.env.SHOWCASE_AVAILABLE_SUBEVENTS.split(',') || [],
    },
    appSecret: process.env.NEXT_AUTH_SECRET,
  },
  publicRuntimeConfig: {
    appUrl: process.env.APP_URL,
  },
  async redirects() {
    return [
      {
        source: '/p/:slug',
        destination: '/projects/:slug', // Matched parameters can be used in the destination
        permanent: true,
      },
    ]
  },
};
