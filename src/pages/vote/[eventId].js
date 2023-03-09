import React, { useState } from 'react';
import {
  Heading, Text, Box, Button,
} from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { getSession } from 'next-auth/client';
import { Modal } from 'react-responsive-modal';
import ProjectPreview from '../../components/ProjectPreview';
import { tryAuthenticatedApiQuery } from '../../util/api';
import { PeerVoteBallotQuery } from './eventId.gql';
import Page from '../../components/Page';
import ProjectDetails from '../../components/ProjectDetails';

export default function EventId({ event, projects, session }) {
  const [votes, setVotes] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  return (
    <Page>
      <Content>
        <Heading>
          Vote ~ {event?.region?.name}
        </Heading>
        <Text>Select your <b>top 3</b> favorite projects by clicking on them!</Text>
        <Text>You do not need to vote in any particular order</Text>
        <Modal styles={{ modal: { maxWidth: '75%' } }} open={modalContent} onClose={() => setModalContent(null)}>
          {modalContent}
        </Modal>
        {projects.map((project) => {
          const selected = votes.includes(project.id);
          return (
            <ProjectPreview
              project={project}
              isLink={false}
              showEvent={false}
              d="inline-flex"
              shadow={selected ? 'outline' : undefined}
              m={4}
              onClick={(e) => {
                if (e.target.type !== 'button') {
                  if (selected) {
                    setVotes(votes.filter((v) => v !== project.id));
                  } else {
                    setVotes([...votes, project.id]);
                  }
                }
              }}
            >
              <Button onClick={(e) => {
                setModalContent(<ProjectDetails project={project} showCertificate={false} />);
              }}
              >
                Details
              </Button>
            </ProjectPreview>
          );
        })}
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, res, params: { eventId } }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        loggedIn: false,
      },
    };
  }

  const { result } = await tryAuthenticatedApiQuery(PeerVoteBallotQuery, { eventId });

  return {
    props: {
      session,
      projects: result?.showcase?.projects,
      event: result?.clear?.event,
      loggedIn: true,
    },
  };
}
