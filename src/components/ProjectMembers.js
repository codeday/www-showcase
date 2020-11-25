import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import Box from '@codeday/topo/Atom/Box';
import ProjectMember from './ProjectMember';
import ProjectMemberAdd from './ProjectMemberAdd';

export default function ProjectMembers({
  projectId, members, editToken,
}) {
  const [editedMembers, changeMembers] = useReducer((currentMembers, { action, member }) => {
    if (action === 'remove') {
      return currentMembers.filter((m) => m.username !== member.username);
    }
    if (action === 'add' && member.account !== null) {
      return [member, ...currentMembers];
    }
    return currentMembers;
  }, members);

  const onMemberAdded = (member) => changeMembers({ action: 'add', member });
  const onMemberRemoved = (member) => changeMembers({ action: 'remove', member });

  return (
    <Box>
      {editedMembers.filter((member) => !!member.account).map((member) => (
        <ProjectMember
          projectId={projectId}
          member={member}
          editToken={editToken}
          onMemberRemoved={onMemberRemoved}
        />
      ))}
      <ProjectMemberAdd
        projectId={projectId}
        editToken={editToken}
        onMemberAdded={onMemberAdded}
      />
    </Box>
  );
}

ProjectMembers.propTypes = {
  projectId: PropTypes.string.isRequired,
  members: PropTypes.object.isRequired,
  editToken: PropTypes.string,
  onMemberAdded: PropTypes.func,
  onMemberRemoved: PropTypes.func,
};
ProjectMembers.defaultProps = {
  editToken: null,
  onMemberAdded: () => {},
  onMemberRemoved: () => {},
};
