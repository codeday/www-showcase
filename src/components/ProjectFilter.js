import React, { useState } from 'react';
import { Select, Stack } from '@chakra-ui/core';
import Text from '@codeday/topo/Atom/Text/Text';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Input from '@codeday/topo/Atom/Input/Text';
import Checkbox from '@codeday/topo/Atom/Input/Checkbox';
import Collapse from '@codeday/topo/Molecule/Collapse';
import { UiArrowDown, UiArrowRight } from '@codeday/topocons/Icon';
import PropTypes from 'prop-types';

export default function ProjectFilter({
  additional, startProjectFilter, startEventFilter, events,
}) {
  const additionalData = additional ? (
    additional.filter(Boolean)
      .map((term) => {
        const [k, v] = term.split('=', 2);
        if (k === 'undefined') return {};
        return { [k]: v || true };
      })
      .reduce((accum, e) => ({ ...accum, ...e }), {})) : [];
  const [contains, setContains] = useState(additionalData.contains || null);
  const [awarded, setAwarded] = useState(additionalData.awarded || false);
  const [showAdditional, setShowAdditional] = React.useState((contains || awarded));
  const [projectTypeFilter, setProjectTypeFilter] = useState(startProjectFilter);
  const [eventFilter, setEventFilter] = useState(startEventFilter);
  const newAdditional = [(awarded ? 'awarded' : null), (contains ? `contains=${contains}` : null)]
    .filter(Boolean).join(',');

  return (
    <Box display={{
      base: 'none', sm: 'none', md: 'block', lg: 'block',
    }}
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        if (showAdditional) {
          // eslint-disable-next-line no-undef
          window.location.href = `/${projectTypeFilter.toLowerCase()}/${eventFilter}/${newAdditional}`;
        } else {
          window.location.href = `/${projectTypeFilter.toLowerCase()}/${eventFilter}`;
        }
      }}
      >
        <Stack isInline marginTop={-12}>
          <Button
            size="sm"
            as="a"
            fontSize="l"
            onClick={() => setShowAdditional(!showAdditional)}
            zIndex={1000}
          >{showAdditional ? <UiArrowDown /> : <UiArrowRight />}
          </Button>
          <Text fontSize="xl">Browse all</Text>
          <Select
            width="fit-content"
            size="sm"
            fontSize="lg"
            onChange={(e) => {
              setProjectTypeFilter(e.target.value);
            }}
            value={projectTypeFilter}
            zIndex={1000}
          >
            <option value="PROJECTS">projects</option>
            <option value="APP">apps 📲</option>
            <option value="GAME">games 🎮</option>
            <option value="VR">vr projects</option>
            <option value="HARDWARE">hardware projects ⚙️</option>
            <option value="WEBSITE">websites 🌐</option>
            <option value="LIBRARY">libraries 📚</option>
            <option value="BOT">bots 🤖</option>
            <option value="OTHER">other projects</option>
          </Select>
          <Text fontSize="xl">from</Text>
          <Select
            width="fit-content"
            size="sm"
            fontSize="lg"
            onChange={(e) => {
              setEventFilter(e.target.value);
            }}
            value={eventFilter}
            zIndex={1000}
          >
            <option value="all">all events</option>
            <option value="virtual">Virtual CodeDay</option>
            <option value="labs">CodeDay Labs</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </Select>
          {!showAdditional && (
            <Button type="submit" size="sm" fontSize="l" variantColor="brand" zIndex={1000}>Go</Button>
          )}
        </Stack>
        <Collapse isOpen={showAdditional}>
          <Stack isInline ml="10%">
            <Text fontSize="xl">that contain</Text>
            <Input
              placeholder="anything"
              value={contains}
              width="20%"
              onChange={(e) => setContains(e.target.value)}
              size="sm"
              fontSize="l"
            />
            <Text fontSize="xl">and are</Text>
            <Checkbox
              size="lg"
              mb={3}
              isChecked={awarded}
              onChange={(e) => setAwarded(e.target.checked)}
              borderColor="gray.300"
            >awarded
            </Checkbox>
            <Button type="submit" size="sm" fontSize="l" variantColor="brand">Go</Button>
          </Stack>
        </Collapse>
      </form>
    </Box>
  );
}

ProjectFilter.propTypes = {
  additional: PropTypes.string,
  startProjectFilter: PropTypes.string,
  startEventFilter: PropTypes.string,
  events: PropTypes.array,
};
ProjectFilter.defaultProps = {
  additional: null,
  startProjectFilter: 'projects',
  startEventFilter: 'all',
  events: [],
};
