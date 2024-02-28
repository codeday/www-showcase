import React, { useState } from 'react';
import {
  Heading, Text, Box, Button, Grid, Link,
} from '@codeday/topo/Atom';
import { useTheme, useToasts } from '@codeday/topo/utils';
import { Content } from '@codeday/topo/Molecule';
import { getSession, useSession } from 'next-auth/client';
import { Modal } from 'react-responsive-modal';
import ProjectPreview from '../../../components/ProjectPreview';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import { PeerVoteBallotQuery, PeerVoteSubmitJudgementQuery } from './index.gql';
import Page from '../../../components/Page';
import ProjectDetails from '../../../components/ProjectDetails';
import { mintToken } from '../../../util/token';
import VoteOption from '../../../components/VoteOption';
import { useColorModeValue } from '@codeday/topo/Theme';

export default function EventId({
  event, projects, username, token,
}) {
  const [votes, setVotes] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const { info, error, success } = useToasts();
  const theme = useTheme();
  const bg = useColorModeValue(theme.colors.white, theme.colors.black);

  // 10% of projects, but if that number is < 3, pick 3 instead, unless there are less than 3 projects
  const numVotes = Math.max(Math.ceil(projects.length / 10), Math.min(projects.length, 3));

  if (voted) {
    return (
      <Page>
        <Content mt={-6}>
          <Heading textAlign="center">✅ You have voted!</Heading>
          <Text textAlign="center">
            Refresh to change your votes.
          </Text>
        </Content>
      </Page>
    );
  }
  return (
    <Page>
      <Content mt={-12}>
        <Heading>
          Vote ~ {event?.region?.name}
        </Heading>
        <Text>Select your favorite <b>top {numVotes}</b> favorite projects in any order.</Text>
        <Text mb={6}>Click submit at the bottom when done!</Text>
        <Modal
          styles={{
            modal: {
              maxWidth: '75%',
              backgroundColor: bg,
            }
          }}
          open={modalContent}
          onClose={() =>setModalContent(null)}
        >
          {modalContent}
        </Modal>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={4}>
          {projects.map((project) => (
              <VoteOption
                selected={votes.includes(project.id)}
                onClick={(selected, e) => {
                  // target check prevents click of "details" button counting as a vote
                  if (e.target.type === 'button') return;
                  if (project.members.some((m) => m.username === username))
                    return info('You cannot vote for your own project.')
                  if (selected)
                    return setVotes(votes.filter((v) => v !== project.id));
                  setVotes([...votes, project.id]);
                }}
              >
                <ProjectPreview
                  project={project}
                  isLink={false}
                  showEvent={false}
                  showAwards={false}
                  d="inline-flex"
                  m={0}
                  p={0}
                  border={0}
                >
                  <Button
                    onClick={() => setModalContent(<ProjectDetails project={project} showCertificate={false} />)}
                  >
                    Details
                  </Button>
                </ProjectPreview>
              </VoteOption>
          ))}
        </Grid>
        <Box w="100%" display="flex" mt={8}>
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
            : (
              <Button m="auto" disabled>
                {votes.length > numVotes
                  ? `Remove ${votes.length - numVotes} vote${votes.length - numVotes !== 1 ? 's' : ''} to submit`
                  : `Vote for ${numVotes - votes.length} more to submit`
                }
              </Button>
            )}
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
