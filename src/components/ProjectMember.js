import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@codeday/topo/Atom/Box';
import Image from '@codeday/topo/Atom/Image';
import Text, { Link } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import { useToasts } from '@codeday/topo/utils';
import { ProjectMemberRemoveMutation } from './ProjectMember.gql';
import { tryAuthenticatedApiQuery } from '../util/api';
import { Tooltip } from '@chakra-ui/core';

export default function ProjectMember({
  projectId, member, editToken, onMemberRemoved,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToasts();
  const discordMention = "@" + member.account.discordInformation.username + "#" + member.account.discordInformation.discriminator;
  const [tooltipText, setTooltipText] = useState(discordMention);
  return (
    <Box fontSize="lg" style={{ clear: 'both' }}>
      <Image mb={2} src={member.account.picture} alt="" float="left" mr={2} height="1.5em" rounded="full" />
      <Box float="left">
        <Tooltip hasArrow label={tooltipText} placement="auto" fontSize="md">
          <Text mb={0} style={{borderBottom: "1px dotted #000", textDecoration: "none"}}
            onClick={() => {
              navigator.clipboard.writeText(discordMention); 
              setTooltipText("Copied!"); setTimeout(() => 
              {setTooltipText(discordMention)}, 1000);}}> 
            {member.account.name} 
          </Text>
        </Tooltip>
        {editToken && (
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
