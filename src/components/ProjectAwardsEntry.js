import React, { useReducer, useState } from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Image from '@codeday/topo/Atom/Image';
import Button from '@codeday/topo/Atom/Button';
import Text from '@codeday/topo/Atom/Text';
import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../util/api';
import { AwardRemove } from './ProjectAwards.gql';

export default function ProjectAwardsEntry({ projectId, editToken, award, onRemove, isAdmin, ...props }) {
  const { success, error } = useToasts();

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Grid templateColumns={"1fr 100%"} gap={4} alignItems="center" mb={4} {...props}>
      <Box
        width={16}
        height={16}
        bg={!award?.info?.icon?.url && "gray.100"}
      >
        <Image
          src={award?.info?.icon?.url}
          alt=""
        />
      </Box>
      <Box>
        <Text mb={0} bold>{award?.info?.name || award?.type}</Text>
        {award?.modifier && <Text mb={0} fontSize="sm">{award.modifier}</Text>}
        {isAdmin && (
          <Button
            m={0}
            p={0}
            fontSize="sm"
            variant="link"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            onClick={async () => {
              if (isSubmitting) return;

              setIsSubmitting(true);
              const { error: resultError } = await tryAuthenticatedApiQuery(
                AwardRemove,
                { projectId, id: award.id },
                editToken
              );

              // Generic GraphQL error
              if (resultError) {
                error(resultError?.response?.errors[0]?.message || resultError.message);
              } else {
                success(`Award removed.`);
                onRemove(award);
              }

              setIsSubmitting(false);
            }}
          >
            Remove
          </Button>
        )}
      </Box>
    </Grid>
  )
}
