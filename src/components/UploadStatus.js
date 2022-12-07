import React from 'react';
import { Box, Heading, Spinner } from '@codeday/topo/Atom';
import * as Icon from '@codeday/topocons/Icon';
import { Button, Text } from '@chakra-ui/core';

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

export function UploadError({
  errorDetails, onRetry, finalMediaBlobURL, filename, ...props
}) {
  return (
    <Box
      borderColor="failure.border"
      display="inline-block"
      borderWidth={3}
      backgroundColor="failure.bg"
      p={4}
      {...props}
    >
      <Icon.UiError color="white" height="5em" width="auto" />
      <Heading color="failure.text">Upload Failed</Heading>
      {(errorDetails) ? <Text><b>Error: {errorDetails}</b></Text> : null}
      <Button m={2} onClick={() => { onRetry(finalMediaBlobURL); }} variant="outline">Retry Upload</Button>
      <br /> <br />
      <Text as="a" href={finalMediaBlobURL} download={filename}>Having trouble uploading?
        <br />
        <u>Click here to download your recording, then email it to team@codeday.org</u>
      </Text>
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
