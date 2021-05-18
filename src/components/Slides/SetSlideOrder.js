import React, { useState } from 'react';
import { List, arrayMove } from 'react-movable';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';

export default function SetSlideOrder({ projects, onSubmit }) {
  const [items, setItems] = useState(projects);
  return (
    <Box>
      <List
        values={items}
        onChange={({ oldIndex, newIndex }) => setItems(arrayMove(items, oldIndex, newIndex))}
        renderList={({ children, props }) => <Box {...props}>{children}</Box>}
        renderItem={({ value, props }) => <Box border={1} m={2} p={2} {...props}>{value.name}</Box>}
      />
      <Button variantColor="green" onClick={() => onSubmit(items)}>Start</Button>
    </Box>
  );
}
