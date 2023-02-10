import React, { useState } from 'react';
import { Box, Button } from '@codeday/topo/Atom';

import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../util/api';
import { ProjectSetFeatured } from './ProjectFeature.gql';

export default function ProjectFeature({
  projectId, editToken, featured, isAdmin, ...props
}) {
  const [isFeatured, setIsFeatured] = useState(featured);
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
  );
}
