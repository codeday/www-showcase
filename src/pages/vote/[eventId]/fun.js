import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/client';
import {
  Heading, Box, Link, Text, Grid,
} from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { Progress } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import { GetAllProjectsAndStudentsQuery } from './fun.gql';
import { mintToken } from '../../../util/token';
import ForceLoginPage from '../../../components/ForceLoginPage';
import Page from '../../../components/Page';

export default function Results({ projects, loggedIn }) {
  const [allStudents, setAllStudents] = useState({});
  const [pjCount, setPjCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!projects) return;
    const students = Object.fromEntries(
      projects.flatMap((p) => p.members.map((m) => ([m.username, { name: m.account.name, voted: false }])))
    );
    let count = 0;
    projects.forEach((project) => {
      project.peerJudgements.forEach((pj) => {
        count += 1;
        if (Object.keys(students).includes(pj.username)) {
          students[pj.username].voted = pj.createdAt;
        }
      });
    });
    setAllStudents(students);
    setPjCount(count);
  }, [projects]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.push(router.asPath); // refreshes server side props
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);
  if (!loggedIn) return <ForceLoginPage />;

  return (
    <Page>
      <Content>
        <Heading>
          TO VOTE:&nbsp;
          <Text fontSize="5xl" d="inline" color="brand" textDecoration="underline">showcase.codeday.org/vote</Text>
        </Heading>
        <Heading mx={10} mb={1}><Text d="inline" color="brand">{pjCount}</Text> votes cast</Heading>
        <Progress
          isAnimated
          mx={10}
          h={10}
          colorScheme="green"
          hasStripe
          value={
            (Object.keys(allStudents).filter((s) => allStudents[s].voted)
              .length / Object.keys(allStudents).length) * 100
          }
        />

        <Grid templateColumns={{ base: '1fr 1fr' }} w="xl" m="9">
          <Box>
            {
            Object.keys(allStudents).sort(
              (a, b) => DateTime.fromISO(allStudents[b].voted) - DateTime.fromISO(allStudents[a].voted)
            ).filter((u) => allStudents[u].voted).map((username) => (
              <Box p={2} m={2} bg="green.100" w="md" rounded={10} borderColor="green.800" borderWidth={3}>
                <Text bold fontSize="xl">✅ {allStudents[username].name}</Text>
                <Text>⌛Voted <b>{DateTime.fromISO(allStudents[username].voted).toRelative()}</b></Text>
              </Box>
            ))
}
          </Box>
          <Box>
            { Object.keys(allStudents).filter((u) => !allStudents[u].voted).map((username) => (
              <Box p={2} m={2} bg="red.100" w="md" rounded={10} borderColor="red.800" borderWidth={3}>
                <Text bold fontSize="xl">❌ {allStudents[username].name}</Text>
                <Text>⌛Has <b>not </b>voted</Text>
              </Box>
            ))}
          </Box>

        </Grid>
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
  const { result } = await tryAuthenticatedApiQuery(GetAllProjectsAndStudentsQuery, { eventId }, token);
  return {
    props: {
      projects: result?.showcase?.projects,
      loggedIn: true,
    },
  };
}
