import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Button, Grid, Heading, Text,
} from '@codeday/topo/Atom';
import JudgingScoreElement from './JudgingScoreElement';

export default function JudgingScorecard({
  project, judgingToken, judgingPool, onNextProject, ...props
}) {
  const [allCompleteElements, completeElement] = useReducer(
    (prev, add) => ({ ...prev, [add]: true }),
    judgingPool.judgingCriteria.reduce((accum, c) => ({
      ...accum,
      [c.id]: project?.userJudgement?.filter((j) => j.judgingCriteria.id === c.id)?.length > 0,
    }), {})
  );
  const isComplete = Object.values(allCompleteElements).reduce((accum, e) => accum && e, true);

  return (
    <Box
      p={8}
      borderColor="yellow.800"
      borderWidth={2}
      rounded="sm"
      mb={8}
      {...props}
    >
      <Heading as="h2" fontSize="xl">{judgingPool.name}</Heading>
      <Text fontSize="sm" mb={8}>If a project doesn't provide any detail, just give it one star.</Text>
      <Grid templateColumns={judgingPool.judgingCriteria.length > 1 ? '1fr 100%' : '1fr'} gap={8} mb={8}>
        {judgingPool.judgingCriteria.sort((a, b) => b.weight - a.weight).map((c) => (
          <>
            {judgingPool.judgingCriteria.length > 1 && (
              <Text bold mb={0} style={{ whiteSpace: 'nowrap' }}>{c.name} ({Math.round(c.weight * 100)}%)</Text>
            )}
            <Box>
              <JudgingScoreElement
                projectId={project.id}
                judgingCriteriaId={c.id}
                judgingToken={judgingToken}
                initialValue={project?.userJudgement?.filter((j) => j.judgingCriteria.id === c.id)[0]?.value || 0}
                onChange={() => {
                  completeElement(c.id);
                }}
              />
            </Box>
          </>
        ))}
      </Grid>
      <Box>
        <Button
          colorScheme={isComplete ? 'green' : 'gray'}
          onClick={onNextProject}
        >
          {isComplete ? 'Next' : 'Skip and Come Back'}
        </Button>
      </Box>
    </Box>
  );
}
JudgingScorecard.propTypes = {
  project: PropTypes.object.isRequired,
  judgingPool: PropTypes.object.isRequired,
  judgingToken: PropTypes.string.isRequired,
  onNextProject: PropTypes.func,
};
JudgingScorecard.defaultProps = {
  onNextProject: () => {},
};
