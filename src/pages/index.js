import React from 'react';
import PropTypes from 'prop-types';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Text, { Link, Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import { tryAuthenticatedApiQuery } from '../util/api';
import Page from '../components/Page';
import ProjectList from '../components/ProjectList';
import { IndexQuery } from './index.gql';
import ProjectFilter from '../components/ProjectFilter';

const PER_PAGE = 6;
export default function Home({ projects, events }) {
  return (
    <Page slug="/">
      <Content>
        <ProjectFilter events={events} />
        {projects && projects.length > 0 ? (
          <>
            <ProjectList projects={projects} />
            <Box textAlign="center" mt={8}>
              <Button as="a" href="/projects" m={1} variantColor="blue">Browse All</Button>
              <Button as="a" href="/projects/codeday" m={1} variantColor="blue">Browse CodeDay</Button>
              <Button as="a" href="/projects/labs" m={1} variantColor="blue">Browse CodeDay Labs</Button>
            </Box>
          </>
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

export async function getStaticProps({ params }) {
  const { result, error } = await tryAuthenticatedApiQuery(IndexQuery, {
    startLt: (new Date(new Date().getTime())).toISOString(),
    take: PER_PAGE * 3,
  });
  if (error) console.error(error);

  return {
    props: {
      events: result?.cms?.events?.items || [],
      projects: (result?.showcase?.projects || []).sort(() => Math.random() > 0.5 ? -1 : 1).slice(0, PER_PAGE),
    },
    revalidate: 240,
  };
}
