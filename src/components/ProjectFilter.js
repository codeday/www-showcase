import React, { useState } from 'react';
import {
  Box, Button, Checkbox, Text, Select, Option, Stack, TextInput as Input,
} from '@codeday/topo/Atom';

import { Collapse } from '@codeday/topo/Molecule';
import { UiArrowDown, UiArrowRight } from '@codeday/topocons/Icon';
import PropTypes from 'prop-types';

export default function ProjectFilter({
  additional,
  startProjectFilter,
  startEventFilter,
  events,
}) {
  const additionalData = additional
    ? additional
      .filter(Boolean)
      .map((term) => {
        const [k, v] = term.split('=', 2);
        if (k === 'undefined') return {};
        return { [k]: v || true };
      })
      .reduce((accum, e) => ({ ...accum, ...e }), {})
    : [];
  const [contains, setContains] = useState(additionalData.contains || '');
  const [awarded, setAwarded] = useState(additionalData.awarded || false);
  const [showAdditional, setShowAdditional] = React.useState(
    contains || awarded
  );
  const [projectTypeFilter, setProjectTypeFilter] = useState(startProjectFilter);
  const [eventFilter, setEventFilter] = useState(startEventFilter);
  const currentEvent = events.find((event) => event.id === eventFilter);
  const [region, setRegion] = useState(additionalData.event || false);
  const newAdditional = [
    awarded ? 'awarded' : null,
    contains ? `contains=${contains}` : null,
    region ? `event=${region}` : null,
    projectTypeFilter !== 'PROJECTS' ? `type=${projectTypeFilter.toLowerCase()}` : null,
  ]
    .filter(Boolean)
    .join(',');

  return (
    <Box
      aria-label="Project Filter"
      mb={4}
      display={{
        base: 'none',
        sm: 'none',
        md: 'block',
        lg: 'block',
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newAdditional) {
            // eslint-disable-next-line no-undef
            window.location.href = `/projects/${eventFilter}/${newAdditional}`;
          } else {
            // eslint-disable-next-line no-undef
            window.location.href = `/projects/${eventFilter}/`;
          }
        }}
      >
        <Stack isInline mt={-12} mb={2}>
          <Button
            size="sm"
            aria-label={showAdditional ? 'Collapse' : 'Expand'}
            fontSize="l"
            onClick={() => setShowAdditional(!showAdditional)}
            zIndex={1000}
          >
            {showAdditional ? <UiArrowDown /> : <UiArrowRight />}
          </Button>
          <Text fontSize="xl" whiteSpace="nowrap">Browse all</Text>
          <Select
            width="fit-content"
            role="combobox"
            aria-label="Project Type"
            size="sm"
            fontSize="lg"
            onChange={(e) => {
              setProjectTypeFilter(e.target.value);
            }}
            value={projectTypeFilter}
            zIndex={1000}
          >
            <option value="PROJECTS">projects</option>
            <optgroup label="Categories">
              {/* I hate this hack but it's not my fault https://github.com/chakra-ui/chakra-ui/issues/2853 */}
              <option style={{ backgroundColor: 'inherit' }} value="APP">apps 📲</option>
              <option style={{ backgroundColor: 'inherit' }} value="GAME">games 🎮</option>
              <option style={{ backgroundColor: 'inherit' }} value="VR">vr projects</option>
              <option style={{ backgroundColor: 'inherit' }} value="HARDWARE">hardware ⚙️</option>
              <option style={{ backgroundColor: 'inherit' }} value="WEBSITE">websites 🌐</option>
              <option style={{ backgroundColor: 'inherit' }} value="LIBRARY">libraries 📚</option>
              <option style={{ backgroundColor: 'inherit' }} value="BOT">bots 🤖</option>
              <option style={{ backgroundColor: 'inherit' }} value="OTHER">other projects</option>
            </optgroup>
          </Select>
          <Text fontSize="xl">from</Text>
          <Select
            width="fit-content"
            aria-label="Program/Event"
            size="sm"
            fontSize="lg"
            onChange={(e) => {
              setEventFilter(e.target.value);
            }}
            value={eventFilter}
            zIndex={1000}
          >
            <option value="all">all events</option>
            <optgroup label="Programs">
              <option style={{ backgroundColor: 'inherit' }} value="codeday">CodeDay (High School)</option>
              <option style={{ backgroundColor: 'inherit' }} value="labs">CodeDay Labs (High School/College)</option>
            </optgroup>
            <optgroup label="Events">
              {events.map((event) => (
                <option style={{ backgroundColor: 'inherit' }} key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </optgroup>
          </Select>
          {currentEvent?.program?.webname === 'codeday'
            && currentEvent.subEventIds && (
              <Select
                width="fit-content"
                aria-label="Region"
                size="sm"
                fontSize="lg"
                zIndex={1000}
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                }}
              >
                <option key="global" value="">
                  Global
                </option>
                {Object.entries(currentEvent?.subEventIds)
                  .map((e) => ({ [e[0]]: e[1] }))
                  ?.map((subEvent) => (
                    <option
                      key={Object.keys(subEvent)}
                      value={Object.keys(subEvent)}
                    >
                      {Object.values(subEvent)[0]?.title}
                    </option>
                  ))}
              </Select>
          )}
          {!showAdditional && (
            <Button
              type="submit"
              size="sm"
              fontSize="l"
              colorScheme="red"
              zIndex={1000}
            >
              Go
            </Button>
          )}
        </Stack>
        <Collapse in={showAdditional}>
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
              aria-label="Awarded"
              isChecked={awarded}
              onChange={(e) => setAwarded(e.target.checked)}
              borderColor="gray.300"
            >
              awarded
            </Checkbox>
            <Button type="submit" size="sm" fontSize="l" colorScheme="red">
              Go
            </Button>
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
  startProjectFilter: 'PROJECTS',
  startEventFilter: 'all',
  events: [],
};
