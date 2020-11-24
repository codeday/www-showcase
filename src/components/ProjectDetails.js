import React from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import { Heading } from '@codeday/topo/Atom/Text';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { default as Textarea } from '@codeday/topo/Atom/Input/Textarea';
import EditableTextField from './EditableTextField';
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
        fontSize="3xl"
        component={Input}
        name="name"
        params={{ projectId: project.id }}
        initialValue={project.name}
        gql={ProjectEditName}
        token={editToken}
        cursor={editToken && 'pointer'}
        componentProps={{ d: 'inline-block', width: 'md', fontSize: '3xl' }}
      />

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
  );
}
ProjectDetails.propTypes = {
  project: PropTypes.object.isRequired,
  editToken: PropTypes.string,
};
ProjectDetails.defaultProps = {
  editToken: null,
};
