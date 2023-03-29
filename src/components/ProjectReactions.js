import React, { useEffect, useReducer, useRef } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import RedHeart from '@codeday/topocons/Emoji/Symbols/RedHeart';
import ClappingHands from '@codeday/topocons/Emoji/People/ClappingHands';
import GrinningFace from '@codeday/topocons/Emoji/People/GrinningFace';
import Upvote from '@codeday/topocons/Emoji/Symbols/UpArrow';
import { Box, Grid, NumberInputStepper } from '@codeday/topo/Atom';
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
  );
}

function keepClickingString(unappliedCount) {
  if (unappliedCount >= 200) return null;
  if (unappliedCount >= 175) return 't̷̢͂o̴̘̳̊͑ȯ̶̙̈́͜ ̸̼̘̉p̵̱̈͠o̵̱̾w̶̤̳̾ȩ̷̔̈́r̷̺͒f̸͔͘͜u̸͎͇͐͗l̷̡͒͆t̴͙̑͛';
  if (unappliedCount >= 150) return 'Approaching max power!';
  if (unappliedCount >= 125) return 'Power level increasing';
  if (unappliedCount >= 100) return '!!!!MORE MORE MORE!!!!';
  if (unappliedCount >= 75) {
    return 'More' + ('!'.repeat(Math.floor(unappliedCount - 75)));
  }
  if (unappliedCount >= 50) return 'Feed me different emotes!';
  if (unappliedCount > 0 && unappliedCount < 50) {
    return 'Keep clicking' + ('!'.repeat(Math.floor(unappliedCount/5)));
  }
}

export default function ProjectReactions({ id, reactionCounts }) {
  const { error } = useToasts();
  const ref = useRef();
  const { width, height } = useWindowSize();
  const [numConfetti, confetti] = useReducer((prev) => prev + 1, 0);
  const addReactionReducerFn = (prev, { type, count }) => [
    ...(prev || []).filter((p) => p.type !== type),
    { type, count: count + ((prev || []).filter((p) => p.type === type)[0]?.count || 0) },
  ];
  const [appliedReactions, addAppliedReactions] = useReducer(addReactionReducerFn, reactionCounts || []);
  const [unappliedReactions, updateUnappliedReactions] = useReducer((prev, { action, ...rest }) => {
    if (action === 'clear') return [];
    if (((prev || []).filter((p) => p.type === rest.type)[0]?.count || 0) + rest.count > 50) rest.count = 0;
    if (rest.count > 0) confetti();
    return addReactionReducerFn(prev, rest);
  }, []);

  const displayedReactions = Object.keys(SUPPORTED_REACTIONS).map((type) => ({
    type,
    count: ((appliedReactions || []).filter((r) => r.type === type)[0]?.count || 0)
      + ((unappliedReactions || []).filter((r) => r.type === type)[0]?.count || 0),
  }));

  useEffect(() => {
    if (typeof window === 'undefined' || (unappliedReactions || []).filter((r) => r.count > 0).length === 0) {
      return () => {};
    }
    const timeout = setTimeout(() => {
      apiFetch(AddReactions, { id, reactions: unappliedReactions })
        .catch((e) => error(e.toString()));
      // Update the applied reactions count.
      unappliedReactions.forEach((ur) => addAppliedReactions(ur));
      updateUnappliedReactions({ action: 'clear' });
    }, REACTION_BUFFER_TIME);
    return () => clearTimeout(timeout);
  }, [typeof window, unappliedReactions]);

  const unappliedReactionsCount = (unappliedReactions || []).map((r) => r.count).reduce((a, b) => a + b, 0);
  

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
      <Box
        position="absolute"
        top="0"
        bottom="0"
        left="0"
        right="0"
        opacity={Math.max(0, (unappliedReactionsCount - 75)/(200-75))}
        display={unappliedReactionsCount > 0 ? 'block' : 'none'}
        background={`radial-gradient(circle at ${ref.current?.offsetLeft+(ref.current?.clientWidth/2)}px ${ref.current?.offsetTop+(ref.current?.clientHeight/2)}px, rgba(189, 0, 0, 0), rgba(189, 0, 0, 0.6), rgba(189, 0, 0, 0.8), rgba(189, 0, 0, 1))`}
        css={{ pointerEvents: 'none' }}
      />
      <Grid ref={ref} templateColumns={`repeat(${displayedReactions.length}, minmax(0,1fr))`} gap={1} mb={8}>
        {displayedReactions.map(({ type, count }) => (
          <ReactionButton
            key={type}
            onClick={() => updateUnappliedReactions({ type, count: 1 })}
            type={type}
            count={count}
          />
        ))}
      </Grid>
      <Box
        textTransform="uppercase"
        textAlign="center"
        fontSize="sm"
        fontWeight={unappliedReactionsCount >= 25 ? 'bold' : 'normal'}
        color={unappliedReactionsCount >= 50 ? 'red.700' : 'inherit'}
        mt={-8}
      >
        {keepClickingString(unappliedReactionsCount) || <>&nbsp;</>}
      </Box>
    </>
  );
}
