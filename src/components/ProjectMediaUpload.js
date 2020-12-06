import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@chakra-ui/core';
import Button from '@codeday/topo/Atom/Button';
import Box from '@codeday/topo/Atom/Box';
import { useToasts } from '@codeday/topo/utils';
import { MEDIA_TOPICS } from '../util/mediaTopics';
import { tryAuthenticatedApiQuery } from '../util/api';
import { UploadMediaMutation } from './ProjectGallery.gql';
import Text from '@codeday/topo/Atom/Text';

const WARN_FILE_SIZE = 1024 * 1024 * 5;
const MAX_FILE_SIZE = 1024 * 1024 * 125;
const MIME_IMAGE = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const MIME_VIDEO = ['video/mp4'];

export default function ProjectMediaUpload({ projectId, editToken, onAdded, ...props }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topic, setTopic] = useState('');
  const fileUploadRef = useRef();
  const { success, error, info } = useToasts();

  if (!editToken) return <></>;

  return (
    <Box p={4} borderWidth={1} {...props}>
      <Text bold>Upload New Media</Text>
      <Text mb={1}>What are you uploading:</Text>
      <Select onChange={(e) => setTopic(e.target.value)} mb={4} value={topic}>
        <option value="" />
        {Object.keys(MEDIA_TOPICS).map((val) => (
          <option key={val} value={val}>{MEDIA_TOPICS[val]}</option>
        ))}
      </Select>
      <Button
        disabled={isSubmitting || !topic || !fileUploadRef?.current}
        isLoading={isSubmitting}
        onClick={() => {
          // Are we ready to upload files?
          if (isSubmitting || !topic || !fileUploadRef?.current) {
            console.error(`Not ready to upload files.`);
            return;
          }

          // Open file prompt
          fileUploadRef.current.click();
        }}
      >
        {topic ? 'Upload' : 'Upload (pick topic first)'}
      </Button>
      <input
        type="file"
        ref={fileUploadRef}
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files[0];

          // Did the user select a file.
          if (!file) return;

          // Is the file supported?
          let type = null;
          if (MIME_IMAGE.includes(file.type)) type = 'IMAGE';
          if (MIME_VIDEO.includes(file.type)) type = 'VIDEO';
          if (!type) {
            error('Only images and videos are supported.');
            return;
          }

          // Is the file really big.
          if (file.size > MAX_FILE_SIZE) {
            error(`You might have a problem uploading files larger than ${Math.floor(MAX_FILE_SIZE/(1024*1024))}MB`);
          }

          setIsSubmitting(true);

          if (file.size > WARN_FILE_SIZE) {
            info(`Your file is uploading, but at ${Math.floor(file.size/(1024*1024))}MB, it might take a while.`);
          } else {
            info(`Your file is uploading.`);
          }

          const { result, error: resultError } = await tryAuthenticatedApiQuery(
            UploadMediaMutation,
            {upload: file, topic, type, projectId },
            editToken
          );

          if (resultError) {
            error(resultError?.response?.errors[0]?.message || resultError.message);
          } else {
            success('Media was uploaded and is processing...');
            setTopic('');
            setTimeout(() => onAdded(result?.showcase?.uploadMedia), 2000)
          }

          setIsSubmitting(false);
        }}
      />
    </Box>
  );
}
ProjectMediaUpload.propTypes = {
  projectId: PropTypes.string.isRequired,
  editToken: PropTypes.string,
  onAdded: PropTypes.func,
};
ProjectMediaUpload.defaultProps = {
  editToken: null,
  onAdded: () => {},
};
