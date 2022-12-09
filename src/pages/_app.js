import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@codeday/topo/Theme';
import 'react-responsive-modal/styles.css';

export default function CustomApp({ Component, pageProps: { cookies, ...pageProps } }) {
  return (
    <ThemeProvider analyticsId="PRGLXIXB" brandColor="red" cookies={cookies}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
CustomApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};
CustomApp.defaultProps = {
  pageProps: {},
};
