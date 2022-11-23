import React, { useState } from 'react';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import { UiDownload } from '@codeday/topocons/Icon';
import { useToasts } from '@codeday/topo/utils';
import { signIn } from 'next-auth/client';

export default function ParticipationCertificate({ project, user, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const { error } = useToasts();

  let onClick = () => setIsLoading(true);

  if (!project.members?.map((m) => m.username).includes(user?.nickname)) {
    onClick = (e) => {
      e.preventDefault();
      error(`Only team members can download. Ask someone listed on this page to add "${user.nickname}".`);
      return false;
    }
  }

  if (!user?.nickname) {
    onClick = (e) => {
      e.preventDefault();
      error(`You need to log in first.`);
      signIn('auth0');
      return false;
    }
  }

  return (
    <Box {...props}>
      <Button
        as="a"
        onClick={onClick}
        href={`https://showcase.codeday.org/api/certificate/${project.id}`}
      >
        <UiDownload />  Participation Certificate
      </Button>
    </Box>
  );
}
