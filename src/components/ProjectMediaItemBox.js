import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useToasts } from '@codeday/topo/utils';
import Box from '@codeday/topo/Atom/Box';
import UiX from '@codeday/topocons/Icon/UiX';
import { tryAuthenticatedApiQuery } from '../util/api';
import { DeleteMediaMutation } from './ProjectGallery.gql';

export default function ProjectMediaItemBox({ media, projectId, editToken, children, onDeleted, ...props }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToasts();

  return (
    <Box position="relative" bg="black" textAlign="center" {...props}>
      {editToken && (
        <Box
          cursor="pointer"
          position="absolute"
          zIndex={1000}
          top={0}
          right={0}
          color="white"
          p={1}
          onClick={async () => {
            if (isSubmitting || !editToken) return;
            setIsSubmitting(true);

            const { result, error: resultError } = await tryAuthenticatedApiQuery(
              DeleteMediaMutation,
              { id: media.id },
              editToken
            );

            if (resultError) {
              error(resultError?.response?.errors[0]?.message || resultError.message);
            } else {
              success('Media was removed.');
              onDeleted(media);
            }

            setIsSubmitting(false);
          }}
        >
          <UiX />
        </Box>
      )}
      {children}
    </Box>
  );
}
ProjectMediaItemBox.propTypes = {
  media: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  editToken: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  onDeleted: PropTypes.func,
};
ProjectMediaItemBox.defaultProps = {
  editToken: null,
  children: null,
  onDeleted: () => {},
};
