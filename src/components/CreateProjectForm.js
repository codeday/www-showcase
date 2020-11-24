import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { Select } from '@chakra-ui/core';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { default as Textarea } from '@codeday/topo/Atom/Input/Textarea';
import Button from '@codeday/topo/Atom/Button';
import Text from '@codeday/topo/Atom/Text';
import { PROJECT_TYPES } from '../util/projectTypes';

export default function CreateProjectForm({ availableTokens, isSubmitting, onSubmit }) {
  const { control, errors, handleSubmit } = useForm();

  const hasMultipleTokenOptions = Object.keys(availableTokens).length > 1;

  const doSubmit = handleSubmit((data) => !isSubmitting && onSubmit({
    ...data,
    token: hasMultipleTokenOptions ? data.token : availableTokens[0],
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
            rules={{ required: { value: true, message: "Select where you'd like to create a project."} }}
          >
            <option value=""></option>
            {Object.keys(availableTokens).map((displayName) => (
              <option value={availableTokens[displayName]}>{displayName}</option>
            ))}
          </Controller>
          <Text bold color="red.800" mb={0}>{errors?.token ? errors.token.message : ''}</Text>
        </>
      )}

      <Text bold mt={4} mb={0}>What would you like to call your project or team?</Text>
      <Controller
        as={Input}
        control={control}
        name="name"
        rules={{
          required: { value: true, message: 'You need to pick a name (you can change it later).' },
          minLength: { value: 6, message: 'Pick a longer name (at least 6 characters).'},
          maxLength: { value: 100, message: 'Pick a shorter name (at most 100 characters).'}
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
        <option value=""></option>
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


      <Button mt={16} variantColor="green" onClick={doSubmit} isLoading={isSubmitting}>Create</Button>
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
