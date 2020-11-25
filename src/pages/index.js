import React from 'react';
import PropTypes from 'prop-types';
import Text, { Link, Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import { tryAuthenticatedApiQuery } from '../util/api';
import Page from '../components/Page';
import ProjectList from '../components/ProjectList';
import { IndexQuery } from './index.gql';

// TODO(@tylermenezes): Allow people to filter projects.

export default function Home({ projects }) {
  return (
    <Page slug="/">
      <Content>
        {projects && projects.length > 0 ? (
          <ProjectList projects={projects} />
        ) : (
          <Text bold>No projects to show right now, check back later.</Text>
        )}
      </Content>
    </Page>
  );
}
Home.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export async function getStaticProps() {
  const { result, error } = await tryAuthenticatedApiQuery(IndexQuery);
  if (error) console.error(error);

  return {
    props: {
      projects: result?.showcase?.projects || [],
    },
  };
}
