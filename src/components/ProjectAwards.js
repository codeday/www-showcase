import React, { useReducer } from 'react';
import Box from '@codeday/topo/Atom/Box';
import ProjectAwardsAdd from './ProjectAwardsAdd';
import ProjectAwardsEntry from './ProjectAwardsEntry';

export default function ProjectAwards({
  projectId, editToken, awards, availableAwards, isAdmin, ...props
}) {
  const [currentAwards, changeAwards] = useReducer((current, { action, toChange }) => {
    if (action === 'add') {
      return [...current, toChange].sort((a, b) => a.info.ranking - b.info.ranking);
    }
    return current.filter(({ id }) => id !== toChange.id);
  }, awards);

  return (
    <Box {...props}>
      {currentAwards.map((award) => (
        <ProjectAwardsEntry
          projectId={projectId}
          editToken={editToken}
          award={award}
          isAdmin={isAdmin}
          onRemove={(a) => changeAwards({ action: 'remove', toChange: a })}
        />
      ))}

      {isAdmin && (
        <ProjectAwardsAdd
          projectId={projectId}
          editToken={editToken}
          isAdmin={isAdmin}
          availableAwards={availableAwards}
          onAdd={(a) => changeAwards({ action: 'add', toChange: a })}
        />
      )}
    </Box>
  );
}
