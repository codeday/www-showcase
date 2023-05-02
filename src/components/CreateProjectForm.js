import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Button, Text, Textarea, Select, TextInput as Input,
} from '@codeday/topo/Atom';

import { PROJECT_TYPES } from '../util/projectTypes';

export default function CreateProjectForm({ availableTokens, isSubmitting, onSubmit, user }) {
  const { control, errors, handleSubmit } = useForm();

  const hasMultipleTokenOptions = Object.keys(availableTokens).length > 1;

  const doSubmit = handleSubmit((data) => !isSubmitting && onSubmit({
    ...data,
    token: hasMultipleTokenOptions ? data.token : availableTokens?.[0]?.token,
  }));

  return (
    <form onSubmit={doSubmit}>
      {hasMultipleTokenOptions && (
        <>
          <Text bold mt={4} mb={0}>At which event are you creating your project?</Text>
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
          <Text color="current.textLight">
            Pick the event where you, the creator, are participating. You can work with people from anywhere.
            This is only used for judging.
          </Text>
          <Text bold color="red.800" mb={0}>{errors?.token ? errors.token.message : ''}</Text>
        </>
      )}

      {user?.admin && (
        <>
          <Text bold mt={4}>(admin) programId</Text>
          <Controller
            as={Input}
            control={control}
            name="programId"
            defaultValue=""
          />
          <Text color="current.textLight">(Only if you want to create a project outside of the defined events.)</Text>

          <Text bold mt={4}>(admin) eventGroupId</Text>
          <Controller
            as={Input}
            control={control}
            name="eventGroupId"
            defaultValue=""
          />
          <Text color="current.textLight">(Only if you want to create a project outside of the defined events.)</Text>

          <Text bold mt={4}>(admin) eventId</Text>
          <Controller
            as={Input}
            control={control}
            name="eventId"
            defaultValue=""
          />
          <Text color="current.textLight">(Only if you want to create a project outside of the defined events. Required if any other admin field is filled.)</Text>

          <Text bold mt={4}>(admin) regionId</Text>
          <Controller
            as={Input}
            control={control}
            name="regionId"
            defaultValue=""
          />
          <Text color="current.textLight">(Only if you want to create a project outside of the defined events.)</Text>
        </>
      )}

      <Text bold mt={4} mb={0}>What would you like to call your project or team?</Text>
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

      <Text bold mt={4} mb={0}>What type of project are you making?</Text>
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

      <Text bold mt={4} mb={0}>If you already know what you're going to make, describe it below:</Text>
      <Controller
        as={Textarea}
        control={control}
        name="description"
        defaultValue=""
      />

      <Button mt={16} colorScheme="green" onClick={doSubmit} isLoading={isSubmitting}>Create</Button>
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
