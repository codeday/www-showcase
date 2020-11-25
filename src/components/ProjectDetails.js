import React from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import { Heading } from '@codeday/topo/Atom/Text';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { default as Textarea } from '@codeday/topo/Atom/Input/Textarea';
import EditableTextField from './EditableTextField';
import ProjectMembers from './ProjectMembers';
import {
  ProjectEditName,
  ProjectEditType,
  ProjectEditDescription,
  ProjectEditPriorExperience,
  ProjectEditCodeLink,
  ProjectEditViewLink,
} from './ProjectDetails.gql';

export default function ProjectDetails({ project, editToken }) {
  return (
    <Box>
      <EditableTextField
        as="h1"
        fontSize="5xl"
        fontWeight="bold"
        component={Input}
        name="name"
        params={{ projectId: project.id }}
        initialValue={project.name}
        gql={ProjectEditName}
        token={editToken}
        cursor={editToken && 'pointer'}
        componentProps={{ d: 'inline-block', width: 'md', fontSize: '3xl' }}
      />

      <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={8}>

        {/* Main Column */}
        <Box>
          {(project.description || editToken) && (
            <>
              <EditableTextField
                component={Textarea}
                name="description"
                params={{ projectId: project.id }}
                initialValue={project.description}
                gql={ProjectEditDescription}
                token={editToken}
                cursor={editToken && 'pointer'}
                componentProps={{ height: 48 }}
              />
            </>
          )}

          {(project.priorExperience || editToken) && (
            <>
              <Heading as="h3" fontSize="2xl" mt={8}>Prior Experience</Heading>
              <EditableTextField
                component={Textarea}
                name="description"
                params={{ projectId: project.id }}
                initialValue={project.description}
                gql={ProjectEditDescription}
                token={editToken}
                cursor={editToken && 'pointer'}
                componentProps={{ height: 48 }}
              />
            </>
          )}
        </Box>

        {/* Meta Column */}
        <Box>
          <Heading as="h3" fontSize="xl" mb={2}>Members</Heading>
          <ProjectMembers projectId={project.id} members={project.members} editToken={editToken} />
        </Box>
      </Grid>
    </Box>
  );
}
ProjectDetails.propTypes = {
  project: PropTypes.object.isRequired,
  editToken: PropTypes.string,
};
ProjectDetails.defaultProps = {
  editToken: null,
};
