import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { Content } from '@codeday/topo/Molecule';
import { Box, Grid, Heading, Text, TextInput as Input, Button } from '@codeday/topo/Atom';
import Page from '../components/Page';
import ForceLoginPage from '../components/ForceLoginPage';
import CreateProjectForm from '../components/CreateProjectForm';
import { mintToken } from '../util/token';
import { tryAuthenticatedApiQuery } from '../util/api';
import { CreateProjectMutation, CreateProjectQuery, JoinProjectMutation } from './create.gql';

// How long before the event starts/after the event ends will creation be allowed.
const PRE_POST_GRACE_PERIOD = 1000 * 60 * 60 * 60;
const PRE_POST_GRACE_PERIOD_ADMIN = 1000 * 60 * 60 * 24 * 14;

function getIso(offset) {
  return (new Date(new Date().getTime() + offset)).toISOString();
}

export default function Create({
  tokens, token, logIn, user,
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [joinCode, setJoinCode] = useState('');

  if (logIn) {
    return <ForceLoginPage />;
  }


  return (
    <Page slug="/create">
      <Content mt={-8}>
        {errorMessage && (
          <Box mb={4} bg="red.50" borderWidth={1} borderColor="red.900" p={8} color="red.900">
            {errorMessage.message}
          </Box>
        )}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 3fr' }} gap={6}>
          <Box>
            <Box borderWidth={1} rounded="sm" p={4}>
              <Heading as="h2" fontSize="2xl" mb={4}>Join an Existing Project</Heading>
              <Text bold mt={4} mb={0}>Join Code:</Text>
              <Input
                placeholder="correct-horse-battery-staple"
                onChange={(e) => setJoinCode(e.target.value)}
                value={joinCode}
              />
              <Text fontSize="sm" color="current.textLight">
                Ask your teammate who created the project for this code. It's on your project page, under "members" in a blue box.
              </Text>
              <Button
                mt={2}
                colorScheme="green"
                disabled={joinCode.length < 6}
                isLoading={isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true);
                  const { result, error } = await tryAuthenticatedApiQuery(JoinProjectMutation, { joinCode }, token);
                  if (result) {
                    router.push(`/project/${result.showcase.joinProject.id}`);
                  } else {
                    setErrorMessage({ message: 'Join code not found.' });
                  }
                  setIsSubmitting(false);
                }}
              >
                Join
              </Button>
            </Box>
          </Box>

          <Box>
            <Box borderWidth={1} rounded="sm" p={4}>
              <Heading as="h2" fontSize="2xl">Create a New Project</Heading>
              {((!tokens || tokens.length === 0) && !user?.admin) ? (
                <Text>
                    You can't create projects right now. Try checking back during an event!
                </Text>
              ) : (
                <CreateProjectForm
                  user={user}
                  availableTokens={tokens}
                  isSubmitting={isSubmitting}
                  onSubmit={async ({ token, programId, eventGroupId, eventId, regionId, ...params }) => {
                    setIsSubmitting(true);
                    let usedToken = token;

                    if (user.admin && (programId || eventGroupId || eventId || regionId)) {
                      const resp = await fetch('/api/mint-token?' + new URLSearchParams({ programId, eventGroupId, eventId, regionId }));
                      usedToken = await resp.text();
                    }

                    const { result, error } = await tryAuthenticatedApiQuery(CreateProjectMutation, params, usedToken);
                    if (result) {
                      router.push(`/project/${result.showcase.createProject.id}`);
                    } else {
                      setErrorMessage(error);
                    }
                    setIsSubmitting(false);
                  }}
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  const token = session ? mintToken(session) : null;
  if (!session?.user) {
    return {
      props: { logIn: true },
    };
  }

  const gracePeriod = session.user.admin ? PRE_POST_GRACE_PERIOD_ADMIN : PRE_POST_GRACE_PERIOD;

  const { result, error } = await tryAuthenticatedApiQuery(
    CreateProjectQuery,
    {
      id: session.user.sub,
      start: getIso(gracePeriod),
      end: getIso(-1 * gracePeriod),
    }
  );

  const tokens = result?.clear?.events.map((event) => {
    const groupTitle = event.cmsEventGroup?.title
    const eventTitle = event.name
    return {
      id: event.id,
      name: groupTitle ? `${groupTitle} - ${eventTitle}` : `${eventTitle}`,
      token: mintToken(session, 'codeday', event.eventGroup?.cmsEventGroup?.id, event.id, event.region?.webname)
    }
  })
  return {
    props: {
      tokens,
      token,
      user: session.user,
    },
  };
}
