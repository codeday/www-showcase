import React from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import { PROJECT_TYPES } from '../util/projectTypes';

export default function ProjectPreview({ project }) {
  return (
    <Box
      as="a"
      href={`/project/${project.id}`}
      borderWidth={1}
      shadow="sm"
      rounded="md"
    >
      <Box p={2}>
        <Grid templateColumns="1fr minmax(0, 100%)" gap={8}>
          <Box
            height={32}
            width={32}
            backgroundImage={`url(${project?.media[0]?.image})`}
            backgroundSize="cover"
            backgroundPosition="50% 50%"
            backgroundRepeat="no-repeat"
            backgroundColor="gray.200"
          />
          <Box>
            <Text mb={0}>
              {project.featured ? (
                <Box
                  d="inline-block"
                  rounded="sm"
                  bg="gray.100"
                  p={1}
                  pl={2}
                  pr={2}
                  mr={2}
                >
                  Featured {PROJECT_TYPES[project.type]}
                </Box>
              ) : <Box d="inline-block" mr={2}>{PROJECT_TYPES[project.type]}</Box>}
            </Text>
            <Heading mt={1} mb={0} as="h3" fontSize="xl">{project.name}</Heading>
            <Text>{project?.eventGroup?.title || project?.program?.name}</Text>
            <Box mt={2}>
              {project.awards.map((a) => (
                <Box fontSize="md">
                  <Image src={a.info.icon.url} alt={a.info.name || a.type} h="1.8em" d="inline-block" mr={2} />
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}
ProjectPreview.propTypes = {
  project: PropTypes.object.isRequired,
};
