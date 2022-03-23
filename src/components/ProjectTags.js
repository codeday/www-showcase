import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@codeday/topo/Atom/Box';
import Text, { Link } from '@codeday/topo/Atom/Text';
import List, { Item } from '@codeday/topo/Atom/List';
import { Checkbox, CheckboxGroup } from '@chakra-ui/core';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import { EditTags } from './ProjectTags.gql';
import { tryAuthenticatedApiQuery } from '../util/api';

const TAG_OPTIONS = [
  'construct',
  'scratch',
  'unity',
  'unreal-engine',
  'godot',
  'c#',
  'c++',
  'pygame',
  'javascript',
  'java',
  'python',
  'typescript',
  'react',
  'angular',
  'flutter',
  'photoshop',
  'gimp',
  'maya',
  'inkscape',
  'illustrator',
  'figma',
  'earsketch',
  'fl-studio',
  'reaper',
  'audacity',
];
const CHECK_BUFFER_TIME = 1000;

export default function ProjectTags({
  projectId, tags, editToken, isAdmin, ...rest
}) {
  const firstRender = useRef(true);
  const { error, success } = useToasts();
  const [selectedTags, setSelectedTags] = useState(tags);

  if (!editToken) return (
    <List styleType="disc" {...rest}>
      {selectedTags.map((t) => <Item><Link href={`/projects/all/tags=${t}`}>{t}</Link></Item>)}
    </List>
  );

  useEffect(() => {
    if (typeof window === 'undefined') return () => {};
    if (firstRender.current) {
      firstRender.current = false;
      return () => {};
    }

    const timeout = setTimeout(async () => {
      const { error: resultError } = await tryAuthenticatedApiQuery(
        EditTags,
        { projectId, tags: selectedTags },
        editToken
      );

      // Generic GraphQL error
      if (resultError) {
        error(resultError?.response?.errors[0]?.message || resultError.message);
      } else {
        success(`Project tags saved.`);
      }
    }, CHECK_BUFFER_TIME);
    return () => clearTimeout(timeout);
  }, [typeof window, selectedTags]);

  return (
    <CheckboxGroup
      d="grid"
      mt={4}
      gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }}
      gridGap={2} {...rest}
      onChange={setSelectedTags}
      defaultValue={tags}
    >
      {TAG_OPTIONS.map((t) => (
        <Checkbox value={t}>
          {t}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}
ProjectTags.propTypes = {
  projectId: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  editToken: PropTypes.string,
  isAdmin: PropTypes.bool,
};
ProjectTags.defaultProps = {
  editToken: null,
  isAdmin: false,
};
