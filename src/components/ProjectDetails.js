import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import {
  Box, Grid, Heading, Image, Link, Text, Textarea, TextInput as Input,
} from '@codeday/topo/Atom';
import UiVolume from '@codeday/topocons/Icon/UiVolume';
import EditableTextField from './EditableTextField';
import ProjectMembers from './ProjectMembers';
import {
  ProjectEditChallengesEncountered,
  ProjectEditCodeLink,
  ProjectEditDescription,
  ProjectEditName,
  ProjectEditPriorExperience,
  ProjectEditViewLink,
} from './ProjectDetails.gql';
import ProjectGallery from './ProjectGallery';
import ProjectAwards from './ProjectAwards';
import { MEDIA_TOPICS } from '../util/mediaTopics';
import ProjectFeature from './ProjectFeature';
import ProjectDelete from './ProjectDelete';
import ProjectSubmit from './ProjectSubmit';
import ProjectReactions from './ProjectReactions';
import ProjectTags from './ProjectTags';
import SlugPicker from './SlugPicker';
import ParticipationCertificate from './ParticipationCertificate';

const ReactHlsPlayer = dynamic(
  () => import('react-hls-player'),
  { ssr: false }
);

const TOPIC_PREFERENCES = [MEDIA_TOPICS.TEAM, MEDIA_TOPICS.DEMO, MEDIA_TOPICS.PRESENTATION];

function makeProperLink(link) {
  if (!link) return null;
  return link.startsWith('http') ? link : `http://${link}`;
}

export default function ProjectDetails({
  project, editToken, user, availableAwards, showMemberCount, showCertificate, metaBox, ...props
}) {
  const playerRef = useRef();
  const muteRef = useRef();
  const isAdmin = user?.admin;

  const preferredMedia = (project.media || [])
    .filter((e) => e.type !== 'AUDIO')
    .map((e, i) => ({ ...e, index: i }))
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'VIDEO' ? 1 : -1;
      if (a.topic !== b.topic) return TOPIC_PREFERENCES.indexOf(a.topic) > TOPIC_PREFERENCES.indexOf(b.topic) ? 1 : -1;
      return a.index > b.index ? -1 : 1;
    })[0] || null;

  const preferredVideo = (project.media || [])
    .filter((e) => e.type === 'VIDEO')
    .map((e, i) => ({ ...e, index: i }))
    .sort((a, b) => {
      if (a.topic !== b.topic) return TOPIC_PREFERENCES.indexOf(a.topic) > TOPIC_PREFERENCES.indexOf(b.topic) ? 1 : -1;
      return a.index > b.index ? -1 : 1;
    })[0] || null;

  const links = [
    ...(project.eventGroup ? [(
      <Link
        d="inline-block"
        fontSize="lg"
        fontWeight="bold"
        textDecoration="none"
        mb={0}
        href={`/projects/${project.eventGroup.id}`}
      >
        {project.eventGroup.title}
      </Link>
    )] : []),
    ...(project.region && project.eventId ? [(
      <>
        <Link
          d="inline-block"
          fontSize="lg"
          fontWeight="bold"
          textDecoration="none"
          mb={0}
          href={`/projects/all/event=${project.eventId}`}
        >
          {project.region.name}
        </Link>
        <Link
          d="inline-block"
          fontWeight="bold"
          textDecoration="none"
          mb={0}
          href={`/projects/all/region=${project.region.webname}`}
          fontSize="xs"
          ml={2}
        >
          (history)
        </Link>
      </>
    )] : []),
  ];

  return (
    <Box {...props}>
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
        lineHeight={1}
      />
      <Box
        color="current.textLight"
      >
        {links.reduce((acc, x) => (acc === null ? x : <>{acc},&nbsp;{x}</>), null)}
        {links.length > 0 && (<>&nbsp;&#8729;&nbsp;</>)}
        <SlugPicker
          d="inline-block"
          projectId={project.id}
          editToken={editToken}
          isAdmin={isAdmin}
          media={project.media}
          slug={project.slug}
        />
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '3fr minmax(0, 1fr)' }} gap={8} mt={8}>

        {/* Main Column */}
        <Box>
          {preferredMedia && !preferredVideo && (
            <Image mb={4} src={preferredMedia.coverImage} alt="" />
          )}
          {preferredVideo && (
            <Box
              mb={4}
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                // This code isn't very React-like, but it prevents the video from restarting.
                if (playerRef.current.muted) {
                  playerRef.current.muted = false;
                  e.target.style.cursor = 'auto';
                  muteRef.current.style.display = 'none';
                  playerRef.current.style.pointerEvents = 'auto';
                }
              }}
              position="relative"
            >
              <Box
                ref={muteRef}
                position="absolute"
                bottom={2}
                width="100%"
                color="white"
                textAlign="center"
                fontSize="3xl"
              >
                <Box p={1} pl={2} pr={2} rounded="sm" bg="rgba(0,0,0,0.6)" d="inline-block">
                  <UiVolume />
                  <Box as="span" fontSize="xl" pl={4}>Unmute</Box>
                </Box>
              </Box>
              <ReactHlsPlayer
                style={{ pointerEvents: 'none', borderRadius: '5px' }}
                url={preferredVideo.stream}
                poster={preferredVideo.galleryImage}
                controls
                autoPlay
                muted
                playerRef={playerRef}
              />
            </Box>
          )}
          {(project.media?.length > 0 && !editToken) && (
            <ProjectGallery
              media={project.media}
              projectId={project.id}
              preview
            />
          )}
          {(preferredMedia || preferredVideo || project.media?.length > 0) && (
            <Box mb={4} />
          )}
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

          {((project.tags && project.tags.length > 0) || editToken) && (
            <>
              <Heading as="h3" fontSize="lg" mt={8}>
                What tools did you use to create your project?
              </Heading>
              <ProjectTags
                projectId={project.id}
                editToken={editToken}
                isAdmin={isAdmin}
                tags={project.tags}
              />
            </>
          )}

          {(project.priorExperience || editToken) && (
            <>
              <Heading as="h3" fontSize="lg" mt={8}>
                How much experience does your group have? Does the project use anything (art, music, starter kits) you didn't create?
              </Heading>
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

          {(project.challengesEncountered || editToken) && (
            <>
              <Heading as="h3" fontSize="lg" mt={8}>What challenges did you encounter?</Heading>
              <EditableTextField
                component={Textarea}
                name="challengesEncountered"
                params={{ projectId: project.id }}
                initialValue={project.challengesEncountered}
                gql={ProjectEditChallengesEncountered}
                token={editToken}
                cursor={editToken && 'pointer'}
                componentProps={{ height: 48 }}
              />
            </>
          )}

          {editToken && (
            <>
              <Heading as="h3" fontSize="2xl" mt={8}>Media</Heading>
              <ProjectGallery
                media={project.media}
                projectId={project.id}
                editToken={editToken}
                isAdmin={isAdmin}
              />
            </>
          )}
        </Box>

        {/* Meta Column */}
        <Box>
          {metaBox}
          <Box mb={8}>
            <ProjectReactions
              id={project.id}
              reactionCounts={project.reactionCounts}
            />
          </Box>

          {showCertificate ? (
            <Box mb={8}>
              <ParticipationCertificate project={project} user={user} />
            </Box>
          ) : undefined}

          <Box mb={8}>
            <ProjectFeature
              projectId={project.id}
              featured={project.featured}
              editToken={editToken}
              isAdmin={isAdmin}
              d="inline-block"
              m={2}
            />
            <ProjectDelete
              projectId={project.id}
              editToken={editToken}
              isAdmin={isAdmin}
              d="inline-block"
              m={2}
            />

            {(isAdmin || project.awards.length > 0) && (
              <>
                <Heading as="h3" fontSize="xl" mb={2}>Awards</Heading>
                <ProjectAwards
                  projectId={project.id}
                  awards={project.awards}
                  editToken={editToken}
                  availableAwards={availableAwards}
                  isAdmin={isAdmin}
                  mb={8}
                />
              </>
            )}

            {(project.viewLink || project.codeLink || editToken) && (
              <Heading as="h3" fontSize="xl">Links</Heading>
            )}
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

          {
            (showMemberCount)
              ? <Heading as="h3" fontSize="xl" mb={2}>
                {(project.members || []).length > 1 ? <>Team of {project.members.length}</> : 'Solo team'}
              </Heading>
              : (
                <>
                  <Heading as="h3" fontSize="xl" mb={2}>Members</Heading>
                  <ProjectMembers
                    projectId={project.id}
                    members={project.members || []}
                    editToken={editToken}
                    isAdmin={isAdmin}
                  />
                </>
              )
          }

          <ProjectSubmit mt={6} editToken={editToken} project={project} />

          {project.type === 'HARDWARE' && (
            <Box mt={8}>
              <Heading as="h3" fontSize="sm" color="gray.600" fontWeight={400} mb={2}>
                Hardware category supported by
              </Heading>
              <Box as="a" href="https://www.digikey.com/" target="_blank" rel="noopener" d="inline">
                <Image src="/digikey.png" alt="DigiKey" />
              </Box>
            </Box>
          )}
        </Box>
      </Grid>
    </Box>
  );
}
ProjectDetails.propTypes = {
  project: PropTypes.object.isRequired,
  editToken: PropTypes.string,
  showMemberCount: PropTypes.bool,
  showCertificate: PropTypes.bool,
};
ProjectDetails.defaultProps = {
  editToken: null,
  showMemberCount: false,
  showCertificate: true,
};
