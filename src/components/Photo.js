import Box from '@codeday/topo/Atom/Box';

export default function Photo({ photo }) {
  if (!photo) return <></>;
  return (
    <Box
      as="a"
      href={photo.url}
      borderWidth={1}
      shadow="sm"
      rounded="md"
      backgroundImage={`url(${photo.urlSmall})`}
      backgroundPosition="50% 50%"
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      minH={32}
      target="_blank"
      position="relative"
    >
      {photo.thanks && (
        <Box fontSize="xs" bg="rgba(0, 0, 0, 0.5)" color="white" position="absolute" bottom={0}>Photo: {photo.thanks}</Box>
      )}
    </Box>
  );
}