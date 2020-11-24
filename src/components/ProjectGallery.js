import React from 'react';
import PropTypes from 'prop-types';
import { UploadMediaMutation } from './ProjectGallery.gql';

export default function ProjectGallery({ projectId, media, editToken }) {

}
ProjectGallery.propTypes = {
  projectId: PropTypes.string.isRequired,
  media: PropTypes.object.isRequired,
  editToken: PropTypes.string,
};
ProjectGallery.defaultProps = {
  editToken: null,
};
