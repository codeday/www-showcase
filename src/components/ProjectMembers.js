import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@codeday/topo/Atom';
import ProjectMember from './ProjectMember';
import ProjectMemberAdd from './ProjectMemberAdd';

export default function ProjectMembers({
  projectId, members, editToken, isAdmin,
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
          key={member.username}
          projectId={projectId}
          member={member}
          editToken={editToken}
          onMemberRemoved={onMemberRemoved}
        />
      ))}
      <Box d="block" style={{ clear: 'both' }} />
      <ProjectMemberAdd
        projectId={projectId}
        editToken={editToken}
        onMemberAdded={onMemberAdded}
        isAdmin={isAdmin}
      />
    </Box>
  );
}

ProjectMembers.propTypes = {
  projectId: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  editToken: PropTypes.string,
  onMemberAdded: PropTypes.func,
  onMemberRemoved: PropTypes.func,
};
ProjectMembers.defaultProps = {
  editToken: null,
  onMemberAdded: () => {},
  onMemberRemoved: () => {},
};
