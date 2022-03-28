import React from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import { create } from 'random-seed';
import { PROJECT_TYPES } from '../util/projectTypes';

const COLORS = [
  'orange', 'green', 'teal', 'cyan', 'blue', 'indigo', 'purple', 'pink'
];
export default function ProjectPreview({ project }) {
  const c = COLORS[create(project.id).intBetween(0, COLORS.length)];

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
            backgroundColor={`${c}.100`}
            color={`${c}.500`}
            position="relative"
          >
            {!project?.media[0] && (
              <Box
                textAlign="center"
                position="absolute"
                top="50%"
                left={0}
                right={0}
                mt={-10}
                mb={0}
              >
                No<br />Screenshot<br />Yet
              </Box>
            )}
          </Box>
          <Box>
            <Text mb={0} mr={2} color="current.textLight" fontWeight="bold">
              {PROJECT_TYPES[project.type]}
            </Text>
            <Heading mt={1} mb={0} as="h3" fontSize="xl">{project.name}</Heading>
            <Text>{project?.eventGroup?.title || project?.program?.name}</Text>
            <Box mt={2}>
              {project.awards.map((a) => (
                <Image src={a.info.icon.url} alt={a.info.name || a.type} h="1.8em" d="inline-block" mr={2} />
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
