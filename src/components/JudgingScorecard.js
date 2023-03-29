import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Button, Grid, Heading, Text,
} from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import JudgingScoreElement, { submitScore } from './JudgingScoreElement';

export default function JudgingScorecard({
  project, judgingToken, judgingPool, onNextProject, ...props
}) {
  const bg = useColorModeValue('white', 'black');
  const [isLoading, setIsLoading] = useState(false);
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
      borderColor="yellow.300"
      borderWidth={2}
      rounded="sm"
      ml="auto"
      mr="auto"
      bg={bg}
      {...props}
    >
      <Box color="yellow.900" bg="yellow.300" p={4} pt={3} pb={3}>
        <Heading as="h2" fontSize="xl">Judging Scorecard</Heading>
        <Text fontSize="xs">{judgingPool.name}</Text>
      </Box>
      <Box p={4}>
        {judgingPool.judgingCriteria.sort((a, b) => b.weight - a.weight).map((c) => (
          <Box mb={4}>
            <Text bold mb={0} style={{ whiteSpace: 'nowrap' }}>{c.name}:</Text>
            <Box>
              <JudgingScoreElement
                projectId={project.id}
                judgingCriteriaId={c.id}
                judgingToken={judgingToken}
                initialValue={project?.userJudgement?.filter((j) => j.judgingCriteria.id === c.id)[0]?.value || 0}
                onChange={() => {
                  completeElement(c.id);
                  if (judgingPool.judgingCriteria.length === 1) {
                    onNextProject()
                  }
                }}
              />
            </Box>
          </Box>
        ))}
        <Box mt={{ base: 0, lg: 8 }}>
          <Button
            mr={2}
            mb={2}
            isLoading={isLoading}
            size="sm"
            onClick={async () => {
              setIsLoading(true);
              for (const c of judgingPool.judgingCriteria) {
                await submitScore(judgingToken, project.id, c.id, 0.3);
              }
              onNextProject();
              setIsLoading(false);
            }}
          >
            Not Enough Detail
          </Button>
          <Button
            mb={2}
            isLoading={isLoading}
            colorScheme={isComplete ? 'green' : 'gray'}
            size={isComplete ? 'md' : 'sm'}
            onClick={() => {
              setIsLoading(true);
              onNextProject();
              setIsLoading(false);
            }}
          >
            {isComplete ? 'Next' : 'Skip'}
          </Button>
        </Box>
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
