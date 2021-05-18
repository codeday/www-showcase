import React, { useState } from 'react';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import * as Icon from '@codeday/topocons/Icon';
import RecordJudgingVideoClip from '../../../../../components/RecordJudgingVideoClip';
import RecordJudgingAudioClip from '../../../../../components/RecordJudgingAudioClip';
import Page from '../../../../../components/Page';
import { getSession } from 'next-auth/client';
import { mintJudgingToken } from '../../../../../util/token';
import { tryAuthenticatedApiQuery } from '../../../../../util/api';
import { RecordVideoQuery } from 'index.gql';
import ForceLoginPage from '../../../../../components/ForceLoginPage';
import ProjectDetails from '../../../../../components/ProjectDetails';

export default function JudgingRecord({ token, poolToken, project, error, logIn }) {
  const [status, setStatus] = useState('select'); // 'select', 'audio', 'video'
  const [showProjectDetails, setShowProjectDetails] = useState(false)
  if (logIn) return <ForceLoginPage />;
  if (error) return <Page><Content><Text>Error fetching a project.</Text></Content></Page>;
  let selector;
  const BackButton = (
    <Button
      display="flex"
      variant="solid"
      variantColor="red"
      onClick={
        () => { setStatus('select'); }
      }
    >
      <Icon.UiArrowLeft />&nbsp;Back
    </Button>
  );
  switch (status) {
    default:
      selector = (
        <Box>
          {/* eslint-disable react/no-unescaped-entities */}
          <Text><b>Thanks so much for volunteering to announce a CodeDay award!</b></Text>
          <Text>
            Please take a look at the script on the right - you don't have to follow it, but it's a good starting point!
            <br />
            When you're ready, click one of the buttons below to select if you'll be recording a video or audio message
            to the team
            <br /> <br />
            (Don't worry, you can always change your selection, and if you mess up you can delete your recording and
            retry until you get it right!)
          </Text>
          {/* eslint-enable react/no-unescaped-entities */}
          <Button variant="solid" variantColor="purple" m={4} onClick={() => { setStatus('video'); }}>
            <Icon.Camera />&nbsp;Record Video
          </Button>
          <Button variant="solid" variantColor="purple" m={4} onClick={() => { setStatus('audio'); }}>
            <Icon.UiVolume />&nbsp;Record Audio
          </Button>
        </Box>
      );
      break;
    case 'audio':
      selector = <Box>{BackButton}<RecordJudgingAudioClip /></Box>;
      break;
    case 'video':
      selector = <Box>{BackButton}<RecordJudgingVideoClip /></Box>;
      break;
  }
  return (
    <Page title="Recording">
      <Content wide textAlign="center">
        <Heading m={4}>Record judging comments for {project.name}</Heading>
        <Grid templateColumns={{ base: '1fr', md: '1.5fr 1fr' }} gap={8}>
          <Box bg="gray.100" p={8} rounded={5}>
            {selector}
          </Box>
          <Box bg="gray.100" p={2} rounded={5}>
            <Box bg="gray.300" p={1} rounded={5} m={2}><Heading fontSize="2xl">Script</Heading></Box>
            {/* eslint-disable react/no-unescaped-entities */}
            <Text textAlign="left">
              Hi, my name is <b>[name]</b> and I'm one of the judges for Virtual CodeDay.
              <br /><br />
              I'm a <b>[your job/experience]</b>, and here to present the winners of <b>[award you're presenting]</b>.
              <br />
              The judges really liked how this project <b>[...]</b>,
              and we were particularly impressed by <b>[...]</b>
              and for that reason I'm presenting the <b>[name of award]</b> to <b>[team name]</b>.
              <br /> <br />
              Congratulations!
            </Text>
            {/* eslint-enable react/no-unescaped-entities */}
          </Box>
        </Grid>
        <Button variant="ghost" variantColor="white" w="full" onClick={() => {setShowProjectDetails(!showProjectDetails)}}>
          {(showProjectDetails)? <Icon.UiArrowDown /> : <Icon.UiArrowRight />}&nbsp;{(showProjectDetails) ? 'Hide' : 'Show'} Project Details
        </Button>
        {(showProjectDetails)? <ProjectDetails bg="gray.100" p={8} rounded={5} project={project} /> : null }
        </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, res, params: { pool, project } }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        logIn: true,
      },
    };
  }

  const backendToken = mintJudgingToken(pool, session.user.nickname);
  const { result, error } = await tryAuthenticatedApiQuery(RecordVideoQuery, {id: project}, backendToken);
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
      project: result?.showcase?.project || null,
    },
  };
}
