import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Link, List, Checkbox, CheckboxGroup, Grid, ListItem as Item,
} from '@codeday/topo/Atom';

import { useToasts } from '@codeday/topo/utils';
import { EditTags } from './ProjectTags.gql';
import { tryAuthenticatedApiQuery } from '../util/api';

const TAG_OPTIONS = [
  'construct',
  'scratch',
  'twine',
  'renpy',
  'earsketch',
  'fl-studio',
  'inkscape',
  'illustrator',
  'figma',
  'photoshop',
  'gimp',
  'maya',
  'reaper',
  'audacity',
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
];
const CHECK_BUFFER_TIME = 1000;

export default function ProjectTags({
  projectId, tags, editToken, isAdmin, ...rest
}) {
  const firstRender = useRef(true);
  const { error, success } = useToasts();
  const [selectedTags, setSelectedTags] = useState(tags);

  if (!editToken) {
    return (
      <List styleType="disc" {...rest}>
        {selectedTags.map((t) => <Item><Link href={`/projects/all/tags=${t}`}>{t}</Link></Item>)}
      </List>
    );
  }

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
      onChange={setSelectedTags}
      defaultValue={tags}
    >
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap={2} mt={4} {...rest}>
        {TAG_OPTIONS.map((t) => (
          <Checkbox value={t}>
            {t}
          </Checkbox>
        ))}
      </Grid>
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
