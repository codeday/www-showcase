import React from 'react';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import { UiDownload } from '@codeday/topocons/Icon';

export default function ParticipationCertificate({ project, user, ...props }) {
  if (!project.members?.map((m) => m.username).includes(user?.nickname)) return <></>;
  return (
    <Box {...props}>
      <Button
        as="a"
        href={`https://showcase.codeday.org/api/certificate/${project.id}`}
      >
        <UiDownload />  Participation Certificate
      </Button>
    </Box>
  );
}
