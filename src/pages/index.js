import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Text, TextInput as Input } from '@codeday/topo/Atom';
import UiSearch from '@codeday/topocons/Icon/UiSearch';
import { Content } from '@codeday/topo/Molecule';
import { tryAuthenticatedApiQuery } from '../util/api';
import Page from '../components/Page';
import ProjectList from '../components/ProjectList';
import { IndexQuery } from './index.gql';
import ProjectFilter from '../components/ProjectFilter';

const PER_PAGE = 6;
export default function Home({ projects, events }) {
  const [search, setSearch] = useState('');
  return (
    <Page slug="/">
      <Content>
        <ProjectFilter events={events} />
        <Box as="form" mb={4} onSubmit={(e) => {
          e.preventDefault();
          if (search) {
            // eslint-disable-next-line no-undef
            window.location.href = `/projects/all/contains=${search}`;
          }
        }}
        >
          <Box d="flex">
            <Input
              role="search"
              placeholder="Search Projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              borderTopRightRadius={0}
              borderBottomRightRadius={0}
              borderRight="none"
            />
            <Button
              size="md"
              fontSize="xl"
              type="submit"
              borderTopLeftRadius={0}
              borderBottomLeftRadius={0}
              borderWidth={1}
              borderLeft="none"
            >
              <UiSearch style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              />
            </Button>
          </Box>
        </Box>
        {projects && projects.length > 0 ? (
          <>
            <ProjectList projects={projects} />
            <Box textAlign="center" mt={8}>
              <Button as="a" href="/projects/codeday" m={1} size="lg" colorScheme="red">Browse CodeDay</Button>
              <Button as="a" href="/projects/labs" m={1} size="lg" colorScheme="red">Browse CodeDay Labs</Button>
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

export async function getStaticProps() {
  const { result, error } = await tryAuthenticatedApiQuery(IndexQuery, {
    startLt: (new Date(new Date().getTime())).toISOString(),
    take: PER_PAGE * 3,
  });
  if (error) console.error(error);

  return {
    props: {
      events: result?.cms?.events?.items || [],
      projects: (result?.showcase?.projects || []).sort(() => (Math.random() > 0.5 ? -1 : 1)).slice(0, PER_PAGE),
    },
    revalidate: 240,
  };
}
