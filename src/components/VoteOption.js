import { Box, Flex } from "@codeday/topo/Atom"
import { useColorModeValue } from "@codeday/topo/Theme"
import { useTheme } from "@codeday/topo/utils";
import UiCheck from "@codeday/topocons/Icon/UiCheck"

export default function({
  children,
  selected,
  onClick,
  ...props
}) {
  const selectedFg = useColorModeValue('green.900', 'green.100');
  const selectedBg = useColorModeValue('green.50', 'green.900');
  const unselectedFg = useColorModeValue('gray.100', 'gray.900');

  return (
    <Box
      borderWidth={2}
      borderColor={selected ? selectedBg : unselectedFg}
      backgroundColor={selected ? selectedBg : 'transparent'}
      rounded="sm"
      cursor="pointer"
      onClick={(e) => onClick(selected, e)}
      shadow="lg"
      p={2}
      {...props}
    >
      <Flex alignItems="center">
        <Box pr={4}>
          <Box
            borderWidth={2}
            w={8}
            h={8}
            fontSize="xl"
            color={selectedFg}
            textAlign="center"
            borderColor={selected ? selectedFg : 'current.textLight'}
          >
            {selected && <UiCheck />}
          </Box>
        </Box>
        <Box>
          {children}
        </Box>
      </Flex>
    </Box>
  )
};