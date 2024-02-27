import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Button, Grid, Text, TextInput as Input, Divider,
} from '@codeday/topo/Atom';

import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../util/api';
import { ProjectMemberAddMutation } from './ProjectMemberAdd.gql';
import { ProjectMemberRemoveMutation } from './ProjectMember.gql';
import JoinCode from './JoinCode';

export default function ProjectMemberAdd({
  projectId, editToken, onMemberAdded, joinCode,
}) {
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error, info } = useToasts();

  if (!editToken) return <></>;

  return (
    <Box mt={4}>
      {joinCode && <JoinCode joinCode={joinCode} />}
      <Text mt={1} mb={1} fontSize="xs">or add your teammate by username:</Text>
      <Grid templateColumns="100% minmax(0, 1fr)" style={{ clear: 'both' }}>
        <Input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="account.codeday.org username"
          size="sm"
        />
        <Button
          variant="ghost"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          size="sm"
          onClick={async () => {
            if (isSubmitting) return;

            setIsSubmitting(true);
            const { result, error: resultError } = await tryAuthenticatedApiQuery(
              ProjectMemberAddMutation,
              { projectId, username: username.trim() },
              editToken
            );

            // Generic GraphQL error
            if (resultError) {
              error(resultError?.response?.errors[0]?.message || resultError.message);

            // Showcase will let us add usernames that aren't real users, which would provide a confusing user experience.
            // If the user isn't real, we'll show an error and remove them from Showcase (so they don't get a "user
            // already exists" error if they try to add that username again).
            } else if (!result?.showcase?.addMember?.account) {
              error(`${username} is not a valid username.`);
              tryAuthenticatedApiQuery(ProjectMemberRemoveMutation, { projectId, username }, editToken);

            // Everything looks good!
            } else {
              success(`${result.showcase.addMember.account.name} was added to the team.`);
              setUsername('');
              onMemberAdded(result.showcase.addMember);
              setIsDoubleClick(false);
            }

            setIsSubmitting(false);
          }}
        >
          Add
        </Button>
      </Grid>
    </Box>
  );
}
ProjectMemberAdd.propTypes = {
  projectId: PropTypes.string.isRequired,
  editToken: PropTypes.string,
  onMemberAdded: PropTypes.func,
};
ProjectMemberAdd.defaultProps = {
  editToken: null,
  onMemberAdded: () => {},
};
