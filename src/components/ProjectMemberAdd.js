import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Grid, Text, TextInput as Input,
} from '@codeday/topo/Atom';

import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../util/api';
import { ProjectMemberAddMutation } from './ProjectMemberAdd.gql';
import { ProjectMemberRemoveMutation } from './ProjectMember.gql';

export default function ProjectMemberAdd({
  projectId, editToken, onMemberAdded, isAdmin,
}) {
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error, info } = useToasts();

  if (!editToken) return <></>;

  return (
    <>
      <Grid templateColumns="100% minmax(0, 1fr)" style={{ clear: 'both' }}>
        <Input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="CodeDay Username"
        />
        <Button
          variant="ghost"
          isLoading={isSubmitting}
          disabled={isSubmitting}
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
      <Text>If your teammate doesn't have an account, they can sign up at account.codeday.org.</Text>
      <Text bold>(Not the same as your Discord account name.)</Text>
    </>
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
