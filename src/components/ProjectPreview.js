import React from 'react';
import PropTypes from 'prop-types';
import Box from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import { PROJECT_TYPES } from '../util/projectTypes';
import Image from '@codeday/topo/Atom/Image';

export default function ProjectPreview({ project }) {
  return (
    <Box
      as="a"
      href={`/project/${project.id}`}
      borderWidth={1}
      shadow="sm"
      rounded="md"
    >
      <Box p={4}>
        {project.media?.length > 0 && (
          <Image src={project.media[0].image} alt="" />
        )}
        <Heading as="h3" fontSize="xl">{project.name}</Heading>
        <Text mb={0}>{PROJECT_TYPES[project.type]}</Text>
      </Box>
    </Box>
  );
}
ProjectPreview.propTypes = {
  project: PropTypes.object.isRequired,
};
