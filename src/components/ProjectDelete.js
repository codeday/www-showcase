import React, { useState } from 'react';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../util/api';
import { ProjectDeleteMutation } from './ProjectDelete.gql';

export default function ProjectDelete({ projectId, editToken, isAdmin, ...props }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToasts();

  if (!isAdmin) return <></>;

  return (
    <Box {...props}>
      <Button
        isLoading={isSubmitting}
        disabled={isSubmitting}
        onClick={async () => {
          if (isSubmitting) return;
          if (!isConfirming) {
            setIsSubmitting(true);
            setTimeout(() => {
              setIsSubmitting(false);
              setIsConfirming(true);
            }, 1000);
            return;
          }

          setIsSubmitting(true);
          const { error: resultError } = await tryAuthenticatedApiQuery(
            ProjectDeleteMutation,
            { projectId },
            editToken
          );

          // Generic GraphQL error
          if (resultError) {
            error(resultError?.response?.errors[0]?.message || resultError.message);
          } else {
            success(`Project was deleted. This page may remain cached for a few minutes.`);
          }

          setIsSubmitting(false);
        }}
      >
        {isConfirming ? 'Really Delete?' : 'Delete'}
      </Button>
    </Box>
  )
}
