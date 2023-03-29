import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';
import { Spinner } from '@codeday/topo/Atom';
import { useTheme, useToasts } from '@codeday/topo/utils';
import { JudgingScorecardSubmitJudgement } from './JudgingScorecard.gql';
import { tryAuthenticatedApiQuery } from '../util/api';

const MAX_STARS = 5;

export async function submitScore(judgingToken, projectId, judgingCriteriaId, rating) {
  const { result, error: resultError } = await tryAuthenticatedApiQuery(
    JudgingScorecardSubmitJudgement,
    {
      project: projectId,
      judgingCriteria: judgingCriteriaId,
      value: rating,
    },
    judgingToken
  );
  return { result, resultError };
} 

export default function JudgingScoreElement({
  onChange, judgingToken, projectId, judgingCriteriaId, initialValue,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToasts();
  const [rating, setRating] = useState(initialValue * MAX_STARS);
  const { colors, sizes } = useTheme();

  if (isSubmitting) return <Spinner />;

  return (
    <StarRatings
      rating={rating}
      starDimension={sizes[6]}
      changeRating={async (newRating) => {
        setIsSubmitting(true);

        const { result, resultError } = await submitScore(
          judgingToken,
          projectId,
          judgingCriteriaId,
          newRating/MAX_STARS
        );

        if (resultError) {
          error(resultError?.response?.errors[0]?.message || resultError.message);
        } else {
          success(`Rating saved.`);
          setRating(newRating);
          onChange(newRating);
        }

        setIsSubmitting(false);
      }}
      numberOfStars={MAX_STARS}
      starEmptyColor={colors.gray[200]}
      starHoverColor={colors.yellow[300]}
      starRatedColor={colors.yellow[900]}
    />
  );
}

JudgingScoreElement.propTypes = {
  onChange: PropTypes.func,
  initialValue: PropTypes.number,
  judgingToken: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  judgingCriteriaId: PropTypes.string.isRequired,
};
JudgingScoreElement.defaultProps = {
  initialValue: 0,
  onChange: () => {},
};
