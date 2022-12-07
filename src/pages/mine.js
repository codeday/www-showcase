import React from 'react';
import { getSession } from 'next-auth/client';
import { Content } from '@codeday/topo/Molecule';
import { Heading, Text } from '@codeday/topo/Atom';
import Page from '../components/Page';
import ProjectList from '../components/ProjectList';
import { tryAuthenticatedApiQuery } from '../util/api';
import { MineQuery } from './mine.gql';

export default function MyProjects({ projects, loggedIn }) {
  if (!loggedIn) {
    return (
      <Page slug="/mine">
        <Content mt={-8}>
          <Text bold>You need to be logged in to view your projects.</Text>
        </Content>
      </Page>
    );
  }

  return (
    <Page slug="/mine">
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" mb={4}>My Projects</Heading>
        {projects && projects.length > 0 ? (
          <ProjectList projects={projects} />
        ) : (
          <Text bold>You haven&apos;t created or been added to any projects yet.</Text>
        )}
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      loggedIn: false,
    };
  }

  const { result, error } = await tryAuthenticatedApiQuery(MineQuery, { username: session.user.nickname });
  if (error) console.error(error);

  return {
    props: {
      projects: result?.showcase?.projects || [],
      loggedIn: true,
    },
  };
}
