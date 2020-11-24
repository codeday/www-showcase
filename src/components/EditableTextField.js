import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../util/api';

export default function EditableTextField({
  name, params, initialValue, component: Component, gql, token, onUpdate, componentProps, ...props
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedValue, setSavedValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);
  const { success, error } = useToasts();
  const ref = useRef();

  useEffect(() => {
    if (ref.current && isEditing) {
      ref.current.focus();
    }
  }, [ref, isEditing])

  const editingBox = (
    <>
      <Component
        onChange={(e) => { if (isEditing && !isSubmitting) setValue(e.target.value); }}
        value={value}
        ref={ref}
        {...componentProps}
      />
      <Button
        ml={2}
        mt={1}
        isLoading={isSubmitting}
        onClick={async () => {
          setIsSubmitting(true);
          const { error: resultError } = await tryAuthenticatedApiQuery(
            gql,
            { [name]: value, ...params },
            token
          );

          if (resultError) {
            error(resultError.response?.errors[0]?.message || resultError.message);
          } else {
            success('Updated!');
            setIsEditing(false);
            setSavedValue(value);
            onUpdate(value);
          }

          setIsSubmitting(false);
        }}
      >
        Update
      </Button>
      <Button
        ml={2}
        mt={1}
        variant="ghost"
        disabled={isSubmitting}
        onClick={() => { if (!isSubmitting) { setIsEditing(false); setValue(savedValue); } }}
      >
        Cancel
      </Button>
    </>
  );

  return <Box
    onClick={() => { if (!isEditing && token) { setIsEditing(true); } }}
    {...props}
  >
    {isEditing ? editingBox : (savedValue || `(Nothing here yet... click to edit.)`)}
  </Box>;
}
EditableTextField.propTypes = {
  name: PropTypes.string.isRequired,
  params: PropTypes.object,
  initialValue: PropTypes.string,
  component: PropTypes.elementType.isRequired,
  gql: PropTypes.object.isRequired,
  token: PropTypes.string,
  onUpdate: PropTypes.func,
  componentProps: PropTypes.object,
};
EditableTextField.defaultProps = {
  params: {},
  initialValue: '',
  token: null,
  onUpdate: () => {},
  componentProps: {},
};
