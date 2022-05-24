import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import Content from '@codeday/topo/Molecule/Content';
import Box from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Page from '../components/Page';
import ForceLoginPage from '../components/ForceLoginPage';
import CreateProjectForm from '../components/CreateProjectForm';
import { mintAllTokens } from '../util/token';
import { tryAuthenticatedApiQuery } from '../util/api';
import { CreateProjectMutation, CreateProjectQuery } from './create.gql';

// How long before the event starts/after the event ends will creation be allowed.
const PRE_POST_GRACE_PERIOD = 1000 * 60 * 60 * 60;
const PRE_POST_GRACE_PERIOD_ADMIN = 1000 * 60 * 60 * 24 * 14;

function getIso(offset) {
    return (new Date(new Date().getTime() + offset)).toISOString();
}

export default function Create({ tokens, logIn, linkAccount, username }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (logIn) {
    return <ForceLoginPage />
  }

  if (!tokens || tokens.length === 0) {
    return (
      <Page>
        <Content>
          <Text>
            You can't create projects right now. Try checking back during an event!
          </Text>
        </Content>
      </Page>
    );
  }

  return (
    <Page slug="/create">
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl">Create a New Project</Heading>
        {errorMessage && (
          <Box bg="red.50" borderWidth={1} borderColor="red.900" p={8} color="red.900">
            {errorMessage.message}
          </Box>
        )}
        <CreateProjectForm
          availableTokens={tokens}
          isSubmitting={isSubmitting}
          onSubmit={async ({ token, ...params }) => {
            setIsSubmitting(true);
            const { result, error } = await tryAuthenticatedApiQuery(CreateProjectMutation, params, token);
            if (result) {
              router.push(`/project/${result.showcase.createProject.id}`);
            } else {
              setErrorMessage(error);
            }
            setIsSubmitting(false);
          }}
        />
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
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

  const tokens = result?.cms?.events?.items
    .filter((e) => e.program?.webname && e.id && e.subEventIds && e.title)
    .flatMap((e) => mintAllTokens(session, e.program.webname, e.id, e.subEventIds, e.title))

  return {
    props: {
      tokens,
    },
  }
}
