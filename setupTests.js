/* eslint-disable */
require('jest-fetch-mock').enableMocks();

jest.mock('next/config', () => () => ({
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
}));
