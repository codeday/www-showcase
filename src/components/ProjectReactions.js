import React, { useReducer, useRef, useEffect } from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import RedHeart from '@codeday/topocons/Emoji/Symbols/RedHeart';
import ClappingHands from '@codeday/topocons/Emoji/People/ClappingHands';
import GrinningFace from '@codeday/topocons/Emoji/People/GrinningFace';
import Upvote from '@codeday/topocons/Emoji/Symbols/UpArrow';
import { AddReactions } from './ProjectReactions.gql';

const REACTION_BUFFER_TIME = 2000;
const SUPPORTED_REACTIONS = {
  CLAP: <ClappingHands />,
  GRIN: <GrinningFace />,
  HEART: <RedHeart />,
  UPVOTE: <Upvote />,
};

function ReactionButton({ type, count, onClick }) {
  return (
    <Box textAlign="center">
      <Box fontSize="4xl" cursor="pointer" onClick={onClick}>{SUPPORTED_REACTIONS[type]}</Box>
      <Box
        fontSize={count >= 1000 ? 'xs' : undefined}
        color="current.textLight"
      >
        {count.toLocaleString()}
      </Box>
    </Box>
  )
}

export default function ProjectReactions({ id, reactionCounts }) {
  const { error } = useToasts();
  const ref = useRef();
  const { width, height } = useWindowSize();
  const [numConfetti, confetti] = useReducer((prev) => prev + 1, 0);
  const addReactionReducerFn = (prev, { type, count }) => [
    ...prev.filter((p) => p.type !== type),
    { type, count: count + (prev.filter((p) => p.type === type)[0]?.count || 0) },
  ];
  const [appliedReactions, addAppliedReactions] = useReducer(addReactionReducerFn, reactionCounts);
  const [unappliedReactions, updateUnappliedReactions] = useReducer((prev, { action, ...rest }) => {
    if (action === 'clear') return [];
    if ((prev.filter((p) => p.type === rest.type)[0]?.count || 0) + rest.count > 50) rest.count = 0;
    if (rest.count > 0) confetti();
    return addReactionReducerFn(prev, rest);
  }, []);

  const displayedReactions = Object.keys(SUPPORTED_REACTIONS).map((type) => ({
    type,
    count: (appliedReactions.filter((r) => r.type === type)[0]?.count || 0)
      + (unappliedReactions.filter((r) => r.type === type)[0]?.count || 0)
  }));

  useEffect(() => {
    if (typeof window === 'undefined' || unappliedReactions.filter((r) => r.count > 0).length === 0) return () => {};
    const timeout = setTimeout(() => {
      apiFetch(AddReactions, { id, reactions: unappliedReactions })
        .catch((e) => error(e.toString()));
      // Update the applied reactions count.
      unappliedReactions.forEach((ur) => addAppliedReactions(ur));
      updateUnappliedReactions({ action: 'clear' });
    }, REACTION_BUFFER_TIME);
    return () => clearTimeout(timeout);
  }, [typeof window, unappliedReactions]);

  return (
    <>
      {numConfetti > 0 && (
        <Confetti
          recycle={false}
          numberOfPieces={10 * numConfetti}
          initialVelocityY={5}
          tweenDuration={500}
          gravity={0.15}
          width={width}
          height={height}
          confettiSource={{
            x: ref.current?.offsetLeft,
            y: ref.current?.offsetTop,
            w: ref.current?.clientWidth,
          }}
        />
      )}
      <Grid ref={ref} templateColumns={`repeat(${displayedReactions.length}, minmax(0,1fr))`} gap={1}>
        {displayedReactions.map(({ type, count }) => (
          <ReactionButton
            key={type}
            onClick={() => updateUnappliedReactions({ type, count: 1 })}
            type={type}
            count={count}
          />
        ))}
      </Grid>
    </>
  )
}
