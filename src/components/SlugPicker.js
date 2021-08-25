import React, { useState } from 'react';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Text, { Link } from '@codeday/topo/Atom/Text';
// eslint-disable-next-line import/no-named-default
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { InputGroup, InputLeftAddon } from '@chakra-ui/core';
import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../util/api';
import { SetSlug } from './SlugPicker.gql';

export default function SlugPicker({
  projectId, slug: origSlug, media, editToken, isAdmin, ...rest
}) {
  const [slug, setSlug] = useState(origSlug);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [desiredSlug, setDesiredSlug] = useState(origSlug);
  const { error, success } = useToasts();

  if (isRevealed) {
    return (
      <Box {...rest}>
        <InputGroup size="xs">
          <InputLeftAddon pl={1} pr={1} fontFamily="monospace">https://codeday.sh/</InputLeftAddon>
          <Input
            d="inline"
            w="auto"
            pl={1}
            pr={1}
            fontFamily="monospace"
            onChange={(e) => {
              const sanitizedDesiredSlug = e.target.value
                .toLowerCase()
                .replace(/[^a-zA-Z0-9-]/g, '-')
                .replace(/-+/g, '-');
              setDesiredSlug(sanitizedDesiredSlug);
            }}
            value={desiredSlug}
            placeholder="(cannot be changed!)"
          />
          <Button
            d="inline-block"
            ml={2}
            variantColor="green"
            isLoading={isLoading}
            isDisabled={isLoading || !desiredSlug || desiredSlug.replace(/-/, '').length === 0}
            onClick={async () => {
              if (!isConfirming) {
                setIsConfirming(true);
                return;
              }
              setIsLoading(true);
              const { result, error: resultError } = await tryAuthenticatedApiQuery(
                SetSlug,
                { projectId, slug: desiredSlug },
                editToken
              );
              setIsLoading(false);

              // Generic GraphQL error
              if (resultError) {
                error(resultError?.response?.errors[0]?.message || resultError.message);
                return;
              }

              setSlug(result?.showcase?.editProject?.slug);
              setIsRevealed(false);
              setIsConfirming(false);
              success(`Short URL set: https://showcase.sh/${result?.showcase?.editProject?.slug}`);
            }}
          >
            {isConfirming ? 'Are You Sure?' : 'Set'}
          </Button>
        </InputGroup>
      </Box>
    );
  }

  if (slug || !editToken) {
    const url = slug ? `https://codeday.sh/${slug}` : `https://showcase.codeday.org/project/${projectId}`;
    return (
      <Box {...rest}>
        <Link fontFamily="monospace" href={url}>{slug ? `https://codeday.sh/${slug}` : 'Permalink'}</Link>
        {isAdmin && (
          <Button
            ml={2}
            onClick={() => setIsRevealed(true)}
            size="xs"
          >
            edit
          </Button>
        )}
      </Box>
    );
  }

  if (!isAdmin && (!media || media.filter((m) => m.type === 'IMAGE').length === 0)) {
    return (
      <Box {...rest}>
        <Text mb={0} fontFamily="monospace" color="current.textLight">(Upload a screenshot to pick a short URL)</Text>
      </Box>
    );
  }

  return (
    <Box {...rest}>
      <Button
        onClick={() => setIsRevealed(true)}
        size="xs"
      >
        Choose Short URL
      </Button>
    </Box>
  );
}
