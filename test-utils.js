import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
import { render } from '@testing-library/react';
import { ThemeProvider } from '@codeday/topo/Theme';

// eslint-disable-next-line react/prop-types
const AllTheProviders = ({ children }) => (
  <ThemeProvider brandColor="red">
    {children}
  </ThemeProvider>
);

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, hydrate: true, ...options });

// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
export * from '@testing-library/react';
export { customRender as render };
