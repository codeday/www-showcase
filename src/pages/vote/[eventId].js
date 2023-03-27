import React, { useState } from 'react';
import {
  Heading, Text, Box, Button, Grid,
} from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { useColorModeValue } from '@codeday/topo/Theme';
import { Content } from '@codeday/topo/Molecule';
import { getSession } from 'next-auth/client';
import { Modal } from 'react-responsive-modal';
import ProjectPreview from '../../components/ProjectPreview';
import { tryAuthenticatedApiQuery } from '../../util/api';
import { PeerVoteBallotQuery, PeerVoteSubmitJudgementQuery } from './eventId.gql';
import Page from '../../components/Page';
import ProjectDetails from '../../components/ProjectDetails';
import { mintToken } from '../../util/token';

export default function EventId({
  event, projects, username, token,
}) {
  const [votes, setVotes] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const { info, error, success } = useToasts();
  const numVotes = Math.max(Math.ceil(projects.length / 10), Math.min(projects.length, 3));
  // 10% of projects, but if that number is < 3, pick 3 instead, unless there are less than 3 projects
  if (voted) {
    return (
      <Page>
        <Content>
          <Heading textAlign="center">✅ You have voted!</Heading>
        </Content>
      </Page>
    );
  }
  return (
    <Page>
      <Content>
        <Heading>
          Vote ~ {event?.region?.name}
        </Heading>
        <Text>Select your <b>top {numVotes}</b> favorite projects by clicking on them!</Text>
        <Text>You do not need to vote in any particular order</Text>
        <Modal styles={{ modal: { maxWidth: '75%' } }} open={modalContent} onClose={() => setModalContent(null)}>
          {modalContent}
        </Modal>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
          {projects.map((project) => {
            const selected = votes.includes(project.id);
            return (
              <ProjectPreview
                project={project}
                isLink={false}
                showEvent={false}
                d="inline-flex"
                borderColor="green.500"
                bg={selected ? useColorModeValue('green.100', 'green.900') : undefined}
                borderWidth={selected ? 5 : 0}
                m={4}
                onClick={(e) => {
                  // target check prevents click of "details" button counting as a vote
                  if (e.target.type !== 'button') {
                    if (selected) {
                      setVotes(votes.filter((v) => v !== project.id));
                    } else if (votes.length === numVotes) {
                      info(`You have already cast ${numVotes} votes. De-select a project before voting for this one.`);
                    } else if (project.members.some((m) => m.username === username)) {
                      info('You cannot vote for your own project!');
                    } else {
                      setVotes([...votes, project.id]);
                    }
                  }
                }}
              >
                <Button onClick={() => {
                  setModalContent(<ProjectDetails project={project} showCertificate={false} />);
                }}
                >
                  Details
                </Button>
              </ProjectPreview>
            );
          })}
        </Grid>
        <Box w="100%" display="flex">
          { votes.length === numVotes
            ? (
              <Button
                m="auto"
                isLoading={loading}
                isDisabled={loading}
                onClick={async () => {
                  setLoading(true);
                  const { error: resultError } = await tryAuthenticatedApiQuery(
                    PeerVoteSubmitJudgementQuery, { eventId: event.id, projects: votes }, token
                  );
                  if (resultError) error(resultError.response.errors[0].message);
                  else success('Voted!');
                  setLoading(false);
                  setVoted(true);
                }}
              >Submit
              </Button>
            )
            : <Button m="auto" disabled>Submit (Vote for {numVotes - votes.length} more)</Button>}
        </Box>
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
  const token = mintToken(session);
  return {
    props: {
      token,
      username: session.user.nickname,
      projects: result?.showcase?.projects.sort(() => 0.5 - Math.random()),
      event: result?.clear?.event,
      loggedIn: true,
    },
  };
}
