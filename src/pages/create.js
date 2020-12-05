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
import { CreateProjectMutation, CreateProjectAccountLinkedQuery } from './create.gql';

export default function Create({ tokens, logIn, linkAccount, username }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (logIn) {
    return <ForceLoginPage />
  }

  if (linkAccount) {
    return (
      <Page>
        <Content>
          <Text>
            Please link your account to Discord first. (Follow the instruction in #link-account.)
            You're logged in with the CodeDay username: {username}
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
  if (!session) {
    return {
      props: { logIn: true },
    };
  }

  const { result, error } = await tryAuthenticatedApiQuery(
    CreateProjectAccountLinkedQuery,
    { username: session.user.name }
  );

  if (!result?.account?.getUser?.discordId) {
    return {
      props: { linkAccount: true, username: session.user.name },
    };
  }

  return {
    props: {
      tokens: mintAllTokens(session),
    },
  };
}
