import React from 'react';
import { getSession } from 'next-auth/client';
import { Heading, Box, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import { GetPeerJudgingResultsQuery } from './results.gql';
import { mintToken } from '../../../util/token';
import ForceLoginPage from '../../../components/ForceLoginPage';
import Page from '../../../components/Page';
import { useColorModeValue } from '@codeday/topo/Theme';

export default function Results({ projects, loggedIn }) {
  if (!loggedIn) return <ForceLoginPage />;
  const sortedProjects = projects.sort((a, b) => b.peerJudgements.length - a.peerJudgements.length);
  const bgReverse = useColorModeValue('black', 'white');
  const fgReverse = useColorModeValue('white', 'black');

  return (
    <Page>
      <Content textAlign="center" mt={-12}>
        <Box
          rounded="sm"
          backgroundColor={bgReverse}
          color={fgReverse}
          fontWeight="bold"
          display="inline-block"
          p={2}
          pt={1}
          pb={1}
        >
          CONFIDENTIAL
        </Box>
        <Heading mb={4}>Peer Judging Results</Heading>
        <Box as="table" cellPadding="5em" margin="0 auto">
          <Box as="tr" borderBottomWidth={2}>
            <Box as="td" textAlign="left">Project Name</Box>
            <Box as="td">Votes</Box>
            <Box as="td">Team Size</Box>
          </Box>
          {
            sortedProjects.map((p) => (
              <Box as="tr">
                <Box as="td" textAlign="left"><Link href={`/project/${p.id}`}>{p.name}</Link></Box>
                <Box as="td">{p.peerJudgements.length}</Box>
                <Box as="td">{p.members.length}</Box>
              </Box>
            ))
          }
        </Box>
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, params: { eventId } }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        loggedIn: false,
      },
    };
  }

  const token = mintToken(session);
  const { result } = await tryAuthenticatedApiQuery(GetPeerJudgingResultsQuery, { eventId }, token);
  return {
    props: {
      projects: result?.showcase?.projects,
      loggedIn: true,
    },
  };
}
