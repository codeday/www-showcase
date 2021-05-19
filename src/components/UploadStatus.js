import React from 'react';
import { Heading } from '@codeday/topo/Atom/Text'
import Spinner from '@codeday/topo/Atom/Spinner'
import * as Icon from '@codeday/topocons/Icon'
import { Text } from '@chakra-ui/core';
import Box from '@codeday/topo/Atom/Box'

export function UploadPending({ ...props }) {
  return (
    <Box {...props}>
      <Spinner />
      <Heading>Upload In Progress...</Heading>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <Text>Please don't close this window</Text>
    </Box>

  );
}

export function UploadError({ ...props }) {
  return (
    <Box borderColor="failure.border" display="inline-block" borderWidth={3} backgroundColor="failure.bg" p={4} {...props}>
      <Icon.UiError color="white" height="5em" width="auto" />
      <Heading color="failure.text">Upload Failed</Heading>
      <Text color="failure.text">Reach out to the CodeDay team for help</Text>
    </Box>
  );
}

export function UploadOK({ ...props }) {
  return (
    <Box borderColor="success.border" display="inline-block" borderWidth={3} backgroundColor="success.bg" p={4} {...props}>
      <Icon.UiOk color="white" height="5em" width="auto" />
      <Heading color="success.text">Upload Complete!</Heading>
      <Text color="success.text">You can now close this window</Text>
    </Box>
  );
}
