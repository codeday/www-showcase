import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Button, Image, Text, Tooltip,
} from '@codeday/topo/Atom';

import { useToasts } from '@codeday/topo/utils';
import { ProjectMemberRemoveMutation } from './ProjectMember.gql';
import { tryAuthenticatedApiQuery } from '../util/api';

export default function ProjectMember({
  projectId, member, editToken, onMemberRemoved,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToasts();
  const { picture, name } = member.account;

  const [tooltipText, setTooltipText] = useState(member.username);
  return (
    <Box fontSize="lg" style={{ clear: 'both' }}>
      <Image mb={2} src={picture} alt="" float="left" mr={2} height="1.5em" rounded="full" />
      <Box float="left">
        {editToken ? (
          <Tooltip hasArrow label={tooltipText} placement="auto" fontSize="md">
            <Text
              as="a"
              href={`/projects/all/user=${member.username}`}
              mb={0}
              textDecoration="underline"
            >
              {name}
            </Text>
          </Tooltip>
        ) : (
          <Text
            as="a"
            href={`/projects/all/user=${member.username}`}
            mb={0}
            textDecoration="underline"
          >
            {name}
          </Text>
        )}
        {editToken && (
          <>
            <br />
            <Button
              mt={-3}
              fontSize="sm"
              variant="link"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              onClick={async () => {
                if (isSubmitting) return;
                setIsSubmitting(true);
                const { result, error: resultError } = await tryAuthenticatedApiQuery(
                  ProjectMemberRemoveMutation,
                  { projectId, username: member.username },
                  editToken
                );

                if (resultError) {
                  error(resultError?.response?.errors[0]?.message || resultError.message);
                } else {
                  success(`${member.account.name} was removed from the team.`);
                  onMemberRemoved(member);
                }

                setIsSubmitting(false);
              }}
            >
              Remove
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
ProjectMember.propTypes = {
  projectId: PropTypes.string.isRequired,
  member: PropTypes.object.isRequired,
  editToken: PropTypes.string,
  onMemberRemoved: PropTypes.func,
};
ProjectMember.defaultProps = {
  editToken: null,
  onMemberRemoved: () => {},
};
