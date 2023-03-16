import React from 'react';
import {
  Box, Heading, Button, Text, Code, Spinner,
} from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { getSession } from 'next-auth/client';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import Page from '../../components/Page';
import ForceLoginPage from '../../components/ForceLoginPage';
import { tryAuthenticatedApiQuery } from '../../util/api';
import { VoteIndexQuery } from './index.gql';

export default function Index({ projects, loggedIn, session }) {
  const router = useRouter();
  if (!loggedIn) return <ForceLoginPage />;
  const projectsMadeByEvent = {};
  projects.forEach((project) => {
    const key = `${project.eventGroup.title}, ${project.region.name}`;
    if (projectsMadeByEvent[key] === undefined) {
      projectsMadeByEvent[key] = { eventId: project.eventId, projects: [] };
    }
    projectsMadeByEvent[key].projects.push(project.name);
  });
  if (Object.keys(projectsMadeByEvent).length === 0) {
    return (
      <Page>
        <Content>
          <Text>To vote, you must be a member of a CodeDay Showcase project created within the last 30 days.</Text>
          {/* eslint-disable-next-line max-len,react/prop-types */}
          <Text>Your teammates can add you as a member by entering your username (<Code>{session.user.nickname}</Code>) on your project page.</Text>
        </Content>
      </Page>
    );
  }

  if (Object.keys(projectsMadeByEvent).length === 1 && typeof window !== 'undefined') {
    router.push(`vote/${projects[0].eventId}`);
    return (
      <Page>
        <Content>
          <Spinner />
        </Content>
      </Page>
    );
  }
  return (
    <Page>
      <Content>
        <Heading>Select Event</Heading>
        {/* eslint-disable-next-line max-len */}
        {
          Object.keys(projectsMadeByEvent).map(((event) => (
            <Box
              display="inline-block"
              borderLeftWidth={3}
              pl={2}
              mt={2}
            >
              <Text bold>{event}</Text>
              <Text>You made:</Text>
              {projectsMadeByEvent[event].projects.map((name) => <Text ml={2}>{name}</Text>)}
              <Button mt={1} as="a" href={`vote/${projectsMadeByEvent[event].eventId}`}>Vote Now</Button>
            </Box>
          )))
        }
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        loggedIn: false,
      },
    };
  }

  const { result } = await tryAuthenticatedApiQuery(VoteIndexQuery, { username: session.user.nickname });

  return {
    props: {
      session,
      projects: result?.showcase?.projects.filter((project) => DateTime.fromISO(project.createdAt).diffNow().days <= 30) || [],
      loggedIn: true,
    },
  };
}

Index.propTypes = {
  projects: PropTypes.array,
  loggedIn: PropTypes.bool.isRequired,
};

Index.defaultProps = {
  projects: [],
};
