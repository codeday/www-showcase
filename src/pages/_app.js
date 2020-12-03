import React from 'react';
import PropTypes from 'prop-types';
import Theme from '@codeday/topo/Theme';
import 'react-responsive-modal/styles.css';

export default function App({ Component, pageProps }) {
  return (
    <Theme analyticsId="PRGLXIXB" brandColor="red">
      <Component {...pageProps} />
    </Theme>
  );
}
App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};
App.defaultProps = {
  pageProps: {},
};
