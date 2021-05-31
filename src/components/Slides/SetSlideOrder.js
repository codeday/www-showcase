import React, { useState } from 'react';
import { List, arrayMove } from 'react-movable';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import TextInput from '@codeday/topo/Atom/Input/Text';
import { Select } from '@codeday/topo/Atom/Input/Select';

import * as Icon from '@codeday/topocons/Icon';
import Text from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';

export default function SetSlideOrder({ projects, availableAwards, onSubmit }) {
  const [items, setItems] = useState(projects);
  return (
    <Box>
      <List
        values={items}
        onChange={({ oldIndex, newIndex }) => setItems(arrayMove(items, oldIndex, newIndex))}
        renderList={({ children, props }) => <Box {...props}>{children}</Box>}
        renderItem={({ value, index, props }) => (
          <Box bg="gray.200" m={2} p={2} {...props}>
            <Icon.UiMenu />
            <Text width="15em" display="inline-block">{value.name}</Text>
            <TextInput
              width="50%"
              display="inline-block"
              placeholder="Award name"
              m={4}
              value={value.awardName || ''}
              onChange={(e) => {
                const t = [...items];
                t[index].awardName = e.target.value;
                setItems(t);
              }}
            />
            <Image display="inline-block" height={16} src={value.awardIcon} />
            <Select
              display="inline-block"
              width="30%"
              onChange={(e) => {
                const t = [...items];
                t[index].awardIcon = e.target.value;
                setItems(t);
              }}
            >
              <option value="">Select award icon</option>
              {availableAwards.map((award) => <option value={award.icon.url}>{award.id}</option>)}
            </Select>
          </Box>
        )}
      />
      <Button variantColor="green" onClick={() => onSubmit(items.filter((i) => i.awardName))}>Start</Button>
    </Box>
  );
}

// setSlideOrder.prop
