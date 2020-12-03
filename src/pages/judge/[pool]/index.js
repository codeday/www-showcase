import React, { useState } from 'react';
import { getSession } from 'next-auth/client';
import Content from '@codeday/topo/Molecule/Content';
import Text from '@codeday/topo/Atom/Text';
import Spinner from '@codeday/topo/Atom/Spinner';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../components/Page';
import ForceLoginPage from '../../../components/ForceLoginPage';
import JudgingScorecard from '../../../components/JudgingScorecard';
import ProjectDetails from '../../../components/ProjectDetails';
import { mintJudgingToken } from '../../../util/token';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import { JudgingPoolQuery, JudgingNextProjectQuery } from './index.gql'

export default function Judging({ token, poolToken, judgingPool, initialProject, error, logIn }) {
  const { error: errorToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState(initialProject);

  if (logIn) return <ForceLoginPage />;
  if (error) return <Page><Content><Text>Error fetching a project.</Text></Content></Page>;
  if (isLoading) return <Page><Content><Spinner /></Content></Page>

  return (
    <Page slug={`/judge/${poolToken}`} title="Judging">
      <Content mt={-8}>
        {project ? (
          <>
            <JudgingScorecard
              project={project}
              judgingPool={judgingPool}
              judgingToken={token}
              onNextProject={async (completed) => {
                setIsLoading(true);
                const { result, error: resultError } = await tryAuthenticatedApiQuery(
                  JudgingNextProjectQuery,
                  {},
                  token
                );
                if (resultError) {
                  errorToast(resultError?.response?.errors[0]?.message || resultError.message);
                } else {
                  const remainingProjects = result?.showcase?.myJudgingPool?.projects
                    .filter((p) => p.id !== project.id);
                  if (!completed && remainingProjects.length === 0) {
                    errorToast("That's the last project!");
                  } else {
                    setProject(remainingProjects[Math.floor(Math.random() * remainingProjects.length)]);
                  }
                }
                setIsLoading(false);
              }}
            />
            <ProjectDetails project={project} />
          </>
        ) : (
          <Text>That's all the projects we've got for now!</Text>
        )}
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, res, params: { pool } }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        logIn: true,
      },
    };
  }

  const backendToken = mintJudgingToken(pool, session.user.name);
  const { result, error } = await tryAuthenticatedApiQuery(JudgingPoolQuery, {}, backendToken);

  if (error) {
    res.statusCode = 404;
    console.error(error);
    return {
      props: {
        error: error.message,
      },
    };
  }


  return {
    props: {
      token: backendToken,
      poolToken: pool,
      judgingPool: result?.showcase?.myJudgingPool,
      initialProject: result?.showcase?.myJudgingPool?.projects[0] || null,
    },
  };
}
