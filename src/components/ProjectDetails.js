import React from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
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
import ProjectGallery from './ProjectGallery';
import { MEDIA_TOPICS } from '../util/mediaTopics';
import Image from '@codeday/topo/Atom/Image';

const TOPIC_PREFERENCES = [ MEDIA_TOPICS.TEAM, MEDIA_TOPICS.DEMO, MEDIA_TOPICS.PRESENTATION ];

function makeProperLink(link) {
  return link.startsWith('http') ? link : `http://${link}`;
}

export default function ProjectDetails({ project, editToken, ...props }) {
  const preferredMedia = (project.media || [])
    .filter((item) => item.type === 'IMAGE')
    .sort((a, b) => {
      return TOPIC_PREFERENCES.indexOf(a.topic) - TOPIC_PREFERENCES.indexOf(b.type);
    });
  return (
    <Box {...props}>
      {preferredMedia.length > 0 && (
        <Image src={preferredMedia[0].coverImage} alt="" />
      )}
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
              <Heading as="h3" fontSize="2xl" mt={8}>Team Members' Prior Experience</Heading>
              <EditableTextField
                component={Textarea}
                name="priorExperience"
                params={{ projectId: project.id }}
                initialValue={project.priorExperience}
                gql={ProjectEditPriorExperience}
                token={editToken}
                cursor={editToken && 'pointer'}
                componentProps={{ height: 48 }}
              />
            </>
          )}

          {(project.media?.length > 0 || editToken) && (
            <>
              <Heading as="h3" fontSize="2xl" mt={8}>Media</Heading>
              <ProjectGallery media={project.media} projectId={project.id} editToken={editToken} />
            </>
          )}
        </Box>

        {/* Meta Column */}
        <Box>
          {(project.codeLink || project.viewLink || editToken) && (
            <Box mb={8}>
              <Heading as="h3" fontSize="2xl">Links</Heading>
              {(project.viewLink || editToken) && (
                <Box>
                  {editToken && <Text d="inline-block" mb={0} mr={1} bold>View: </Text>}
                  <EditableTextField
                    component={Input}
                    viewComponent={editToken ? Box : Link}
                    name="viewLink"
                    params={{ projectId: project.id }}
                    initialValue={editToken ? project.viewLink : 'View/Download'}
                    gql={ProjectEditViewLink}
                    token={editToken}
                    cursor="pointer"
                    d="inline-block"
                    href={makeProperLink(project.viewLink)}
                    target="_blank"
                  />
                </Box>
              )}

              {(project.codeLink || editToken) && (
                <Box>
                  {editToken && <Text d="inline-block" mb={0} mr={1} bold>Code: </Text>}
                  <EditableTextField
                    component={Input}
                    viewComponent={editToken ? Box : Link}
                    name="codeLink"
                    params={{ projectId: project.id }}
                    initialValue={editToken ? project.codeLink : 'Code'}
                    gql={ProjectEditCodeLink}
                    token={editToken}
                    cursor="pointer"
                    d="inline-block"
                    href={makeProperLink(project.codeLink)}
                    target="_blank"
                  />
                </Box>
              )}
            </Box>
          )}

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
