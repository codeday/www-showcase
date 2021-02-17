import React from 'react';
import { getSession } from 'next-auth/client';
import Content from '@codeday/topo/Molecule/Content';
import { Heading } from '@codeday/topo/Atom/Text';
import Page from '../../components/Page';
import ProjectDetails from '../../components/ProjectDetails';
import { mintToken } from '../../util/token';
import { tryAuthenticatedApiQuery } from '../../util/api';
import { ProjectByIdQuery } from './projectId.gql';

export default function ViewEditProject({ project, token, user, availableAwards }) {
  if (!project) {
    return (
      <Page>
        <Content>
          <Heading as="h2" fontSize="3xl">Not Found</Heading>
        </Content>
      </Page>
    );
  }

  return (
    <Page slug={`/project/${project.id}`} title={project.name}>
      <Content mt={-8}>
        <ProjectDetails project={project} editToken={token} user={user} availableAwards={availableAwards} />
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, res, params: { projectId } }) {
  const session = await getSession({ req });
  const token = session ? mintToken(session) : null;
  const { result, error } = await tryAuthenticatedApiQuery(ProjectByIdQuery, { id: projectId }, token);

  if (error) {
    res.statusCode = 404;
    console.error(error);
    return {
      props: {},
    };
  }

  return {
    props: {
      project: result?.showcase?.project,
      availableAwards: result?.cms?.awards?.items,
      user: session?.user || null,
      token: session
        && (
          result?.showcase?.project?.members?.map((m) => m.username).includes(session.user.nickname)
          || session.user.admin
        )
          ? token
          : null,
    },
  };
}
