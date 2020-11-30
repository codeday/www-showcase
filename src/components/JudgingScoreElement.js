import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';
import { useTheme } from '@codeday/topo/utils';

export default function JudgingScoreElement({ onChange }) {
  const [rating, setRating] = useState(1);
  const { colors, sizes } = useTheme();

  return (
    <StarRatings
      rating={rating}
      starDimension={sizes[6]}
      changeRating={(newRating) => { setRating(newRating); onChange(newRating); }}
      numberOfStars={5}
      starEmptyColor={colors.yellow[200]}
      starHoverColor={colors.yellow[600]}
      starRatedColor={colors.yellow[900]}
    />
  );
}

JudgingScoreElement.propTypes = {
  onChange: PropTypes.func.isRequired,
};
