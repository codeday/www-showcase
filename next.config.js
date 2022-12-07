module.exports = {
  serverRuntimeConfig: {
    auth0: {
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
      authorizationUrl: `https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&prompt=login`,
    },
    showcase: {
      audience: process.env.SHOWCASE_AUDIENCE,
      secret: process.env.SHOWCASE_SECRET,
    },
    appSecret: process.env.NEXT_AUTH_SECRET,
  },
  publicRuntimeConfig: {
    appUrl: process.env.APP_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/p/:slug',
        destination: '/projects/:slug', // Matched parameters can be used in the destination
        permanent: true,
      },
    ];
  },
};
