import React, { useState } from 'react';
import {
  Box, Button, Select, Stack, TextInput as Input,
} from '@codeday/topo/Atom';

import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../util/api';
import { AwardAdd } from './ProjectAwards.gql';

export default function ProjectAwardsAdd({
  projectId, editToken, availableAwards, onAdd, ...props
}) {
  const { success, error } = useToasts();

  const [addAwardSelected, setAddAwardSelected] = useState(null);
  const [addAwardModifier, setAddAwardModifier] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Stack {...props}>
      <Select
        onChange={(e) => setAddAwardSelected(e.target.value)}
        selected={addAwardSelected}
      >
        <option value="">Select an Award</option>
        {availableAwards.map((a) => (
          <option value={a.id}>{a.name}</option>
        ))}
      </Select>
      <Input
        onChange={(e) => setAddAwardModifier(e.target.value)}
        value={addAwardModifier}
        placeholder="Modifier (optional)"
      />
      <Button
        isLoading={isSubmitting}
        disabled={!addAwardSelected || isSubmitting}
        onClick={async () => {
          if (isSubmitting) return;

          setIsSubmitting(true);
          const { result, error: resultError } = await tryAuthenticatedApiQuery(
            AwardAdd,
            { project: projectId, type: addAwardSelected, modifier: addAwardModifier || undefined },
            editToken
          );

          // Generic GraphQL error
          if (resultError) {
            error(resultError?.response?.errors[0]?.message || resultError.message);
          } else {
            success(`Award added.`);
            setAddAwardSelected('');
            setAddAwardModifier(null);
            onAdd(result?.showcase?.addAward);
          }

          setIsSubmitting(false);
        }}
      >
        Add
      </Button>
    </Stack>
  );
}
