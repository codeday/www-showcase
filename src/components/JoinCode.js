import { Box, Text } from "@codeday/topo/Atom";
import { useState } from "react";

export default function JoinCode({ joinCode }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Box
      cursor={revealed ? 'initial' : 'pointer'}
      onClick={() => setRevealed(true)}
      borderWidth={1}
      borderColor="blue.700"
      rounded="sm"
      pb={2}
    >
      <Box
        roundedTop="sm"
        pl={2}
        pr={2}
        fontSize="sm"
        backgroundColor="blue.700"
        color="white"
        fontWeight="bold"
      >
        Teammate Join Code:
      </Box>
      <Text pl={2} pt={2} fontFamily="monospace" fontWeight="bold" fontStyle="italic">
        {revealed ? joinCode : '● ● ● ● ●'}
      </Text>
      {!revealed && <Text fontSize="xs" pl={2}>(click to reveal)</Text>}
    </Box>
  );
}