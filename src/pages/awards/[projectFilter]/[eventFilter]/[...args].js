import React, { useState, useReducer, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getSession } from 'next-auth/client';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Image from '@codeday/topo/Atom/Image';
import SetSlideOrder from '../../../../components/Slides/SetSlideOrder';
import { makeFilter } from '../../../[projectFilter]/[eventFilter]/[...args]';
import { ProjectsAwardsQuery } from './projects.gql';
import { tryAuthenticatedApiQuery } from '../../../../util/api';
import { mintToken } from '../../../../util/token';
import Text, { Heading } from '@codeday/topo/Atom/Text'
import AudioSpectrum from 'react-audio-spectrum';
import ReactTypingEffect from 'react-typing-effect'
import { CodeDay } from '@codeday/topo/Atom/Logo';

const ReactHlsPlayer = dynamic(
  () => import('react-hls-player'),
  { ssr: false },
);

function mediaSort (a, b) {
  if (a.type === 'VIDEO' && b.type !== 'VIDEO') return -1;
  if (b.type === 'VIDEO' && a.type !== 'VIDEO') return 1;

  if (a.topic === 'DEMO' && b.topic !== 'DEMO') return -1;
  if (b.topic === 'DEMO' && a.topic !== 'DEMO') return 1;

  if (a.type === 'AUDIO' && b.type !== 'AUDIO') return -1;
  if (b.type === 'AUDIO' && a.type !== 'AUDIO') return 1;
}

function MediaPreview({ media }) {
  if (media.type === 'IMAGE') return <Image h="100%" src={media.image} alt="" />;
  if (media.type === 'VIDEO') return (
    <ReactHlsPlayer
      url={media.stream}
      poster={media.image}
      controls={true}
      autoPlay={true}
      width="100%"
      height="100%"
    />
  );
  // TODO(@tylermenezes): Audio
  if (media.type === 'AUDIO') return (
    <Box w="100%" h="100%" p="10%" bg="red.600">
      <audio id="audioSource" crossOrigin="anonymous" src={media.download} autoPlay />
      <AudioSpectrum
        height={parent.innerHeight/2} // wish i could use percents here but it demands pixel width
        width={parent.outerWidth*0.8}
        audioId="audioSource"
        capHeight={0}
        meterWidth={25}
        meterCount={25}
        meterColor="#ffffff"
        gap={50}
      />
    </Box>
  )
}

const hellos = [
  "We Did The CodeDay!",
  "Incredible.",
  "Can't believe we did it.",
  "WOOOOOOOOW",
  "So crazy!",
  "Is this real life?",
  "Help, I'm trapped in this slide deck",
  "See you next season!",
  "AAAaaaaaaAaaaaaaaaa",
  "It's already over?",
  "I hope you slept",
  "John Peter Approved",
  "Thank you to all of our amazing volunteer organizers, mentors, and judges!",
  "<3",
  "WHEEL",
]

export default function AwardsSlides({ projects, availableAwards }) {
  const [order, setOrder] = useState();
  const [index, nextIndex] = useReducer(
    (prev, action) => {
      if (!order) return -1;
      return Math.max(-1, Math.min(prev + (action === 'next' ? 1 : -1), order.length * 2 ))
    },
    -1,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onKeyDown = (e) => {
      if (e.keyCode === 39) nextIndex('next');
      if (e.keyCode === 37) nextIndex('previous');
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [typeof window]);

  if (!order && (!projects || projects.length === 0)) return 'No projects.';
  if (!order) return <SetSlideOrder onSubmit={setOrder} projects={projects} availableAwards={availableAwards} />;

  const project = index >= 0 && index < (order.length * 2) ? order[Math.floor(index/2)] : null;
  const showingDemo = index >= 0 && index < (order.length * 2) ? index % 2 === 1 : null;

  const projectPreferredDemo = project && project.media.filter(({ topic }) => topic !== 'JUDGES').sort(mediaSort)[0] || null;
  const projectPreferredJudge = project && project.media.filter(({ topic }) => topic === 'JUDGES').sort(mediaSort)[0] || null;

  let slide = <></>;
  if (index === -1) {
    slide = <Box w="100%" h="100%" p={20} bg="red.600">
      <Heading fontSize="9vh" color="white"><CodeDay color="white" withText /></Heading>
      <Heading fontSize="27vh" mt="10vh" mb="10vh" color="white">Awards</Heading>
      <Text as="div" fontSize="4vh" color="white">
        <ReactTypingEffect
          speed={50}
          eraseSpeed={50}
          typingDelay={100}
          text={hellos.sort(() => Math.random() > 0.5 ? 1 : -1)}
        />
      </Text>
    </Box>
  }
  else if (index >= (order.length * 2)) {
    slide = <Box w="100%" h="100%" p={20} bg="red.600">
      <Heading fontSize="19vh" mt="15vh" mb="5vh" color="white">Congratulations!</Heading>
      <Text fontSize="6vh" color="white">Now let's all go get some rest.</Text>
    </Box>
  }
  else if (showingDemo) slide = (
    <Box w="100%" h="100%">
      <MediaPreview media={projectPreferredDemo} />
      <Box position="absolute" top={0} left={0} right={0} p={4} pb={16} grad="darken.lg.180">
        <Grid templateColumns={project.awardIcon ? "10vw 1fr" : "1fr"} gap="1vw" alignItems="center">
            {project.awardIcon && (<Image src={project.awardIcon} mb={0} width="10vw" />)}
            <Box color="white" fontWeight="bold">
              <Text fontSize="3vh" mb={0}>{project.awardName}</Text>
              <Text fontSize="5vh">{project.name}</Text>
            </Box>
        </Grid>
      </Box>
    </Box>
  );
  else slide = (
    <Box w="100%" h="100%">
      <MediaPreview media={projectPreferredJudge} />
    </Box>
  );

  return (
    <Box bg="#000" position="absolute" top={0} bottom={0} left={0} right={0}>
      {slide}
      <style>{'video { height: 100%; }'}</style>
    </Box>
  );
}

export async function getServerSideProps({ req, params }) {
  const session = await getSession({ req });
  if (!session?.user?.admin) throw Error(`You are not authorized to access this page.`);

  const token = session ? mintToken(session) : null;
  const where = { ...makeFilter(params).where, mediaTopic: 'JUDGES' };
  const { result, error } = await tryAuthenticatedApiQuery(ProjectsAwardsQuery, { where }, token);
  if (error) {
    console.log(error)
  }
  const projects = result?.showcase?.projects

  return {
    props: {
      projects: projects || [],
      availableAwards: result?.cms?.awards?.items || []
    },
  };
}
