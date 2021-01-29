import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

const options = {
  secret: serverRuntimeConfig.appSecret,
  providers: [
    Providers.Auth0(serverRuntimeConfig.auth0),
  ],
  callbacks: {
    jwt: async (token, user, _, profile) => {
      if (user) {
        // This is bad but NextAuth requires it.
        // eslint-disable-next-line no-param-reassign
        token.user = profile;
      }
      return Promise.resolve(token);
    },
    session: async (session, { user }) => Promise.resolve({
      ...session,
      user: {
        ...user,
        admin: user['https://codeday.xyz/staff'] === true,
      },
    }),
  },
};

export default (req, res) => NextAuth(req, res, options);
