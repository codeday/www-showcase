import React, { useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { getSession } from 'next-auth/client';
import { Box, Text } from '@codeday/topo/Atom';
import { makeFilter } from '../../../projects/[eventFilter]/[...args]';
import { ProjectsAwardsQuery } from './projects.gql';
import { tryAuthenticatedApiQuery } from '../../../../util/api';
import { mintToken } from '../../../../util/token';

const ReactHlsPlayer = dynamic(
  () => import('react-hls-player'),
  { ssr: false }
);

function mediaSort(a, b) {
  if (a.type === 'VIDEO' && b.type !== 'VIDEO') return -1;
  if (b.type === 'VIDEO' && a.type !== 'VIDEO') return 1;

  if (a.topic === 'DEMO' && b.topic !== 'DEMO') return -1;
  if (b.topic === 'DEMO' && a.topic !== 'DEMO') return 1;

  if (a.type === 'AUDIO' && b.type !== 'AUDIO') return -1;
  if (b.type === 'AUDIO' && a.type !== 'AUDIO') return 1;
}

function MediaPreview({ media, onEnded }) {
  if (media.type === 'VIDEO') {
    return (
      <ReactHlsPlayer
        url={media.stream}
        poster={media.image}
        controls
        autoPlay
        width="100%"
        height="100%"
        onEnded={onEnded}
      />
    );
  }
  onEnded();
}

export default function Kiosk({ projects }) {
  const [index, nextIndex] = useReducer(
    (prev, action) => Math.max(0, Math.min(prev + (action === 'next' ? 1 : -1), projects.length)),
    0
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onKeyDown = (e) => {
      if (e.keyCode === 39) nextIndex('next');
      if (e.keyCode === 37) nextIndex('previous');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [typeof window]);

  if (!projects || projects.length === 0) return 'No projects.';

  const project = projects[index % projects.length];
  const projectPreferredDemo = project && project.media
    .filter(({ topic }) => topic !== 'JUDGES')
    .sort(mediaSort)[0] || null;

  const slide = (
    <Box w="100%" h="100%">
      <MediaPreview media={projectPreferredDemo} onEnded={() => nextIndex('next')} />
      <Box position="absolute" top={0} left={0} right={0} p={4} pb={16} grad="darken.lg.180">
        <Box color="white" fontWeight="bold">
          <Text fontSize="5vh" mb={0}>{project.name}</Text>
          <Text fontSize="3vh">{project.eventGroup.title}</Text>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box bg="#000" position="absolute" top={0} bottom={0} left={0} right={0}>
      {slide}
      <style>{'video { height: 100%; }'}</style>
    </Box>
  );
}

// https://stackoverflow.com/a/2450976/154044
function shuffle(array) {
  let currentIndex = array.length; let
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export async function getServerSideProps({ req, params }) {
  const session = await getSession({ req });

  const token = session ? mintToken(session) : null;
  const where = { ...makeFilter(params).where, media: 'VIDEOS' };
  const { result, error } = await tryAuthenticatedApiQuery(ProjectsAwardsQuery, { where }, token);
  if (error) {
    console.log(error);
  }
  const projects = result?.showcase?.projects;

  return {
    props: {
      projects: shuffle(projects) || [],
      availableAwards: result?.cms?.awards?.items || [],
    },
  };
}
