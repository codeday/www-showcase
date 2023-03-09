import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Grid, Heading, Image, Text,
} from '@codeday/topo/Atom';
import { create } from 'random-seed';
import { PROJECT_TYPES } from '../util/projectTypes';

const COLORS = [
  'orange', 'green', 'teal', 'cyan', 'blue', 'indigo', 'purple', 'pink',
];
export default function ProjectPreview({
  project, isLink, showEvent, children, ...props
}) {
  const c = COLORS[create(project.id).intBetween(0, COLORS.length)];

  return (
    <Box
      as={isLink ? 'a' : undefined}
      href={isLink ? `/project/${project.id}` : undefined}
      aria-label={`${project.name}, a ${PROJECT_TYPES[project.type]} created at ${project?.eventGroup?.title || project?.program?.name}`}
      borderWidth={1}
      shadow="sm"
      rounded="md"
      key={project.id}
      {...props}
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
            key="image"
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
          <Box key="details">
            <Text mb={0} mr={2} color="current.textLight" fontWeight="bold" key="type">
              {PROJECT_TYPES[project.type]}
            </Text>
            <Heading mt={1} mb={0} as="h3" fontSize="xl" key="name">{project.name}</Heading>
            {showEvent ? <Text key="event">{project?.eventGroup?.title || project?.program?.name}</Text> : undefined}
            <Box mt={2} key="awards">
              {project.awards.map((a) => (
                <Image src={a.info.icon.url} alt={a.info.name || a.type} h="1.8em" d="inline-block" mr={2} />
              ))}
            </Box>
            {children}
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}
ProjectPreview.propTypes = {
  project: PropTypes.object.isRequired,
  isLink: PropTypes.bool,
  showEvent: PropTypes.bool,
  children: PropTypes.element,
};

ProjectPreview.defaultProps = {
  isLink: true,
  showEvent: true,
  children: undefined,
};
