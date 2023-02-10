import React from 'react';
import PropTypes from 'prop-types';
import { Box, Image, Link } from '@codeday/topo/Atom';

import MediaPlay from '@codeday/topocons/Icon/MediaPlay';
import dynamic from 'next/dynamic';
import UiDownload from '@codeday/topocons/Icon/UiDownload';

const ReactHlsPlayer = dynamic(
  () => import('react-hls-player'),
  { ssr: false }
);
export default function ProjectMediaVideo({ media, openModal, ...props }) {
  return (
    <Box
      cursor="pointer"
      onClick={() => openModal(
        <Box>
          <ReactHlsPlayer
            url={media.stream}
            poster={media.galleryImage}
            controls
            autoPlay
          />
          <Box as="a" href={media.download} borderWidth={1} borderTopWidth={0} rounded="sm" p={1} d="inline-block">
            <UiDownload /> <Link>Download</Link>
          </Box>
        </Box>
      )}
      d="inline-block"
      target="_blank"
      rel="noopener"
      position="relative"
      h="100%"
      {...props}
    >
      <Box
        position="absolute"
        top="calc(50% - 1em - 0.2rem)"
        left="calc(50% - 1em - 1.4rem)"
        color="white"
        bg="rgba(0,0,0,0.5)"
        fontSize="3xl"
        p={2}
        pl={8}
        pr={8}
      >
        <MediaPlay />
      </Box>
      <Image src={`${media.galleryImage}?width=800&height=600&fit_mode=crop`} alt="" />
    </Box>
  );
}
ProjectMediaVideo.propTypes = {
  media: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
};
