import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-responsive-modal';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import ProjectMediaImage from './ProjectMediaImage';
import ProjectMediaVideo from './ProjectMediaVideo';
import ProjectMediaItemBox from './ProjectMediaItemBox';
import ProjectMediaUpload from './ProjectMediaUpload';

export default function ProjectGallery({ projectId, media: initialMedia, editToken }) {
  const [modalContent, setModalContent] = useState(null);
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
    <>
      <Modal open={modalContent} onClose={() => setModalContent(null)}>
        {modalContent}
      </Modal>
      <Grid
        templateColumns={{ base: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }}
        gap={4}
      >
        {media.sort((a) => (a.type === 'VIDEO' ? -1 : 1)).map((item) => (
          <ProjectMediaItemBox
            media={item}
            editToken={editToken}
            projectId={projectId}
            key={item.id}
            onDeleted={(toDelete) => changeMedia({ action: 'delete', media: toDelete })}
          >
            {(() => {
              if (item.type === 'IMAGE') return <ProjectMediaImage openModal={setModalContent} media={item} />;
              if (item.type === 'VIDEO') return <ProjectMediaVideo openModal={setModalContent} media={item} />;
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
    </>
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
