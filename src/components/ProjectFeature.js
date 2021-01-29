import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../util/api';
import { ProjectSetFeatured } from './ProjectFeature.gql';

export default function ProjectFeature({ projectId, editToken, featured, ...props }) {
  const [isFeatured, setIsFeatured] = useState(featured);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session] = useSession();
  const { success, error } = useToasts();

  if (!session?.user?.admin) return <></>;

  return (
    <Box mb={8} {...props}>
      <Button
        isLoading={isSubmitting}
        disabled={isSubmitting}
        onClick={async () => {
          if (isSubmitting) return;

          setIsSubmitting(true);
          const { error: resultError } = await tryAuthenticatedApiQuery(
            ProjectSetFeatured,
            { projectId, isFeatured: !isFeatured },
            editToken
          );

          // Generic GraphQL error
          if (resultError) {
            error(resultError?.response?.errors[0]?.message || resultError.message);
          } else {
            success(`Project was ${isFeatured ? 'un-featured' : 'featured'}.`);
            setIsFeatured(!isFeatured);
          }

          setIsSubmitting(false);
        }}
      >
        {isFeatured ? 'Un-Feature' : 'Feature'}
      </Button>
    </Box>
  )
}
