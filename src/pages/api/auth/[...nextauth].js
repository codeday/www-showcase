import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

const options = {
  secret: serverRuntimeConfig.appSecret,
  providers: [
    Providers.Auth0(serverRuntimeConfig.auth0),
  ],
};

export default (req, res) => NextAuth(req, res, options);
