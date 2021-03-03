import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-responsive-modal';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import { Link } from '@codeday/topo/Atom/Text';
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
      <style type="text/css">{`.react-responsive-modal-modal { max-width: 1200px !important; }`}</style>
      <Modal open={modalContent} onClose={() => setModalContent(null)}>
        {modalContent}
      </Modal>
      {editToken && (
        <Box p={4} mb={4} bg="blue.50" color="blue.800" borderWidth={1} borderColor="blue.600">
          The maximum file size for new uploads is 125mb. Images can be PNGs, JPEGs, or GIFs. The preferred video format
          is MP4, but MKV and MOV will usually work.<br /><br />
          If you're trying to upload a video which is too large, or in a different format, please use{' '}
          <Link href="https://www.freeconvert.com/video-compressor" target="_blank" rel="noopener">
            an online video compressor/converter.
          </Link>
        </Box>
      )}
      <Grid
        templateColumns={{ base: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }}
        gap={4}
      >
        {media
          .map((e, i) => ({ ...e, index: i }))
          .sort((a, b) => {
            if (a.type !== b.type) return a.type === 'VIDEO' ? -1 : 1;
            return a.index > b.index ? 1 : -1;
          })
          .map((item) => (
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
