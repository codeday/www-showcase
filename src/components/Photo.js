import { Box } from '@codeday/topo/Atom';

export default function Photo({ photo, children, ...props }) {
  if (!photo) return <></>;
  return (
    <Box
      as="a"
      role="img"
      // TODO: Support for manually generated labels
      aria-label={`A photo of ${photo.program.name}${photo.region ? ` ${photo.region.name}` : ''}.`}
      alt={`A photo of ${photo.program.name}${photo.region ? ` ${photo.region.name}` : ''}.`}
      key={photo.id}
      href={`/photo/${photo.id}`}
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
      { ...props }
    >
      {children}
      {photo.thanks && (
        <Box fontSize="xs" bg="rgba(0, 0, 0, 0.5)" color="white" position="absolute" bottom={0}>Photo: {photo.thanks}</Box>
      )}
    </Box>
  );
}
