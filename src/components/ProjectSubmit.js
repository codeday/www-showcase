import React, { useState } from 'react';
import Box from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import { useToasts } from '@codeday/topo/utils';
import { DateTime } from 'luxon';

export default function ProjectSubmit({ project, ...props }) {
  const { info } = useToasts();
  if (!project.projectSubmitInfo?.awardsAt) return <></>;
  if (DateTime.local() > DateTime.fromISO(project.projectSubmitInfo.awardsAt)) return <></>;

  return (
    <Box {...props}>
      <Heading as="h3" fontSize="xl" mb={1}>Judging</Heading>
      <Button
        variantColor="blue"
        size="lg"
        onClick={async () => {
          info('All projects will be judged, there is no need to submit :)')
        }}
      >
        Submit for Judging
      </Button>
      <Text fontSize="sm" color="current.textLight" mt={1}>
        You can make updates to your project at any time, but if you update after the deadline, some judges may not
        see them.
      </Text>
    </Box>
  )
}
