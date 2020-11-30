import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import ProjectMediaImage from './ProjectMediaImage';
import ProjectMediaVideo from './ProjectMediaVideo';
import ProjectMediaItemBox from './ProjectMediaItemBox';
import ProjectMediaUpload from './ProjectMediaUpload';

export default function ProjectGallery({ projectId, media: initialMedia, editToken }) {
  const [media, changeMedia] = useReducer((currentMedia, { action, media }) => {
    if (action === 'add') {
      return [...currentMedia, media];
    }
    if (action === 'delete') {
      return currentMedia.filter((item) => item.id !== media.id);
    }
    return currentMedia;
  }, initialMedia);

  return (
    <Grid
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }}
      gap={4}
    >
      {media.map((item) => (
        <ProjectMediaItemBox
          media={item}
          editToken={editToken}
          projectId={projectId}
          key={item.id}
          onDeleted={(toDelete) => changeMedia({ action: 'delete', media: toDelete })}
        >
          {(() => {
            if (item.type === 'IMAGE') return <ProjectMediaImage media={item} />;
            if (item.type === 'VIDEO') return <ProjectMediaVideo media={item} />;
            return <></>;
          })()}
        </ProjectMediaItemBox>
      ))}
      <ProjectMediaUpload
        projectId={projectId}
        editToken={editToken}
        onAdded={(toAdd) => changeMedia({ action: 'add', media: toAdd })}
      />
    </Grid>
  );
}
ProjectGallery.propTypes = {
  projectId: PropTypes.string.isRequired,
  media: PropTypes.arrayOf(PropTypes.object).isRequired,
  editToken: PropTypes.string,
};
ProjectGallery.defaultProps = {
  editToken: null,
};
