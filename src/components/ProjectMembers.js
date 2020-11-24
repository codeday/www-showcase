import React from 'react';
import PropTypes from 'prop-types';

export default function ProjectMembers({ projectId, members, editToken }) {

}

ProjectMembers.propTypes = {
  projectId: PropTypes.string.isRequired,
  members: PropTypes.object.isRequired,
  editToken: PropTypes.string,
};
ProjectMembers.defaultProps = {
  editToken: null,
};
