import React from 'react';
import { NextSeo } from 'next-seo';
import { getSession } from 'next-auth/client';
import { Content } from '@codeday/topo/Molecule';
import { Heading } from '@codeday/topo/Atom';
import Page from '../../../components/Page';
import ProjectDetails from '../../../components/ProjectDetails';
import { mintToken } from '../../../util/token';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import { MEDIA_TOPICS } from '../../../util/mediaTopics';
import { ProjectByIdQuery } from './index.gql';

const TOPIC_PREFERENCES = [MEDIA_TOPICS.TEAM, MEDIA_TOPICS.DEMO, MEDIA_TOPICS.PRESENTATION];

export default function ViewEditProject({
  project, token, user, availableAwards,
}) {
  if (!project) {
    return (
      <Page>
        <Content>
          <Heading as="h2" fontSize="3xl">Not Found</Heading>
        </Content>
      </Page>
    );
  }

  const preferredMedia = (project.media || [])
    .map((e, i) => ({ ...e, index: i }))
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'VIDEO' ? 1 : -1;
      if (a.topic !== b.topic) return TOPIC_PREFERENCES.indexOf(a.topic) > TOPIC_PREFERENCES.indexOf(b.topic) ? 1 : -1;
      return a.index > b.index ? -1 : 1;
    })[0] || null;

  return (
    <Page slug={`/project/${project.id}`} title={project.name}>
      <NextSeo
        title={project.name}
        description={project.description}
        openGraph={{
          title: project.name,
          description: project.description,
          images: preferredMedia && [{ url: preferredMedia.ogImage, width: 1200, height: 630 }],
        }}
      />
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
          result?.showcase?.project?.members?.map((m) => m.username.toLowerCase()).includes(session.user.nickname.toLowerCase())
          || session.user.admin
        )
        ? token
        : null,
    },
  };
}
