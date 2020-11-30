import React from 'react';
import PropTypes from 'prop-types';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import JudgingScoreElement from './JudgingScoreElement';

const SCORE_ELEMENTS = [
  'Difficulty', 'Creativity', 'Polish',
];

export default function JudgingScorecard({ project, submitToken, ...props }) {
  return (
    <Box
      p={8}
      borderColor="yellow.800"
      bg="yellow.50"
      borderWidth={2}
      rounded="sm"
      mb={8}
      {...props}
    >
      <Heading as="h2" fontSize="xl" mb={8}>Your Rating</Heading>
      <Grid templateColumns="1fr 100%" gap={8} mb={8}>
        {SCORE_ELEMENTS.map((element) => (
          <>
            <Text bold mb={0}>{element}</Text>
            <Box><JudgingScoreElement onChange={() => {}} /></Box>
          </>
        ))}
      </Grid>
      <Box float="right">
        <Button mr={4}>Skip</Button>
        <Button variantColor="green">Submit</Button>
      </Box>
      <Box style={{ clear: 'both' }} />
    </Box>
  );
}
JudgingScorecard.propTypes = {
  project: PropTypes.object.isRequired,
  submitToken: PropTypes.string.isRequired,
};
