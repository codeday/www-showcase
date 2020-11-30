import React from 'react';
import PropTypes from 'prop-types';
import Image from '@codeday/topo/Atom/Image';
import Box from '@codeday/topo/Atom/Box';

export default function ProjectMediaImage({ media, ...props }) {
  return (
    <Box as="a" href={media.fullImage} target="_blank" rel="noopener" {...props}>
      <Image src={media.galleryImage} alt="" />
    </Box>
  );
}
ProjectMediaImage.propTypes = {
  media: PropTypes.object.isRequired,
};
