import React from 'react';
import Text, { Link, Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import Page from '../components/Page';

// TODO(@tylermenezes): Allow people to filter projects.

export default function Home() {
  return (
    <Page slug="/">
      <Content>
        <Text fontSize="xl">Check back later.</Text>
      </Content>
    </Page>
  );
}
