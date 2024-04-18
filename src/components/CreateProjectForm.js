import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Button, Text, Textarea, Select, TextInput as Input, Link,
} from '@codeday/topo/Atom';

import { PROJECT_TYPES } from '../util/projectTypes';

export default function CreateProjectForm({ availableTokens, isSubmitting, onSubmit, user }) {
  const { control, errors, handleSubmit } = useForm();
  const [showAdmin, setShowAdmin] = useState(false);

  const hasMultipleTokenOptions = Object.keys(availableTokens).length > 1;

  const doSubmit = handleSubmit((data) => !isSubmitting && onSubmit({
    ...data,
    token: hasMultipleTokenOptions ? data.token : availableTokens?.[0]?.token,
  }));

  return (
    <form onSubmit={doSubmit}>
          <Text bold mt={4} mb={0}>{hasMultipleTokenOptions? `At which event are you creating your project?` : `${availableTokens[0].name}`}</Text>
      {hasMultipleTokenOptions && (
        <>
          <Controller
            as={Select}
            control={control}
            name="token"
            rules={{ required: { value: true, message: "Select where you'd like to create a project." } }}
          >
            <option value="" />
            {availableTokens.map((t) => (
              <option value={t.token}>{t.name}</option>
            ))}
          </Controller>
          
          <Text bold color="red.800" mb={0}>{errors?.token ? errors.token.message : ''}</Text>
        </>
      )}
      <Text fontSize="sm" color="current.textLight">
            {user?.admin && <Link onClick={() => setShowAdmin(!showAdmin)}>(admin options)</Link>}
          </Text>
      {user?.admin && showAdmin && (
        <>
          <Text bold mt={4}>(admin) programId</Text>
          <Controller
            as={Input}
            control={control}
            name="programId"
            defaultValue=""
          />

          <Text bold mt={4}>(admin) eventGroupId</Text>
          <Controller
            as={Input}
            control={control}
            name="eventGroupId"
            defaultValue=""
          />

          <Text bold mt={4}>(admin) eventId</Text>
          <Controller
            as={Input}
            control={control}
            name="eventId"
            defaultValue=""
          />

          <Text bold mt={4}>(admin) regionId</Text>
          <Controller
            as={Input}
            control={control}
            name="regionId"
            defaultValue=""
          />
        </>
      )}

      <Text bold mt={4} mb={0}>Project Name:</Text>
      <Controller
        as={Input}
        control={control}
        name="name"
        rules={{
          required: { value: true, message: 'You need to pick a name (you can change it later).' },
          minLength: { value: 6, message: 'Pick a longer name (at least 6 characters).' },
          maxLength: { value: 100, message: 'Pick a shorter name (at most 100 characters).' },
        }}
        defaultValue=""
      />
      <Text bold color="red.800" mb={0}>{errors?.name ? errors.name.message : ''}</Text>

      <Text bold mt={4} mb={0}>Type of Project:</Text>
      <Controller
        as={Select}
        control={control}
        name="type"
        rules={{ required: { value: true, message: 'You need to select a project type (you can change it later).' } }}
      >
        <option value="" />
        {Object.keys(PROJECT_TYPES).map((k) => (
          <option value={k}>{PROJECT_TYPES[k]}</option>
        ))}
      </Controller>
      <Text bold color="red.800" mb={0}>{errors?.type ? errors.type.message : ''}</Text>

      <Text bold mt={4} mb={0}>Description:</Text>
      <Controller
        as={Textarea}
        control={control}
        name="description"
        defaultValue=""
      />
      <Text fontSize="sm" color="current.textLight">If you don't know what you're making yet, you can leave it blank.</Text>

      <Button mt={4} colorScheme="green" onClick={doSubmit} isLoading={isSubmitting}>Create</Button>
    </form>
  );
}

CreateProjectForm.propTypes = {
  availableTokens: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};
CreateProjectForm.defaultProps = {
  isSubmitting: false,
};
