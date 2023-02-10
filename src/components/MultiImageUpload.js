import { useEffect, useState } from 'react';
import {
  Box, Button, Image, List, ListItem, Text,
} from '@codeday/topo/Atom';

import Files from 'react-butterfiles';
import { useList } from 'react-use';

const STATUS_COLORS = {
  pending: 'blue.500',
  failed: 'red.500',
  succeeded: 'green.500',
};

export default function MultiImageUpload({ uploadPhoto, ...props }) {
  const [errors, { push: pushErrors }] = useList([]);
  const [dragging, setDragging] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [files, { push, removeAt, updateAt }] = useList([]);

  useEffect(() => {
    for (const i in files) {
      const f = files[i];
      if (!f.src.src) updateAt(i, { ...f, src: { ...f.src, src: URL.createObjectURL(f.src.file) } });
    }
  }, [files]);

  return (
    <Box borderColor={dragging ? 'blue.500' : undefined} borderWidth={2} p={8} {...props}>
      <Files
        multiple
        maxSize="50mb"
        multipleMaxSize={null}
        accept={['image/jpg', 'image/jpeg', 'image/png']}
        onError={(e) => pushErrors(...e)}
        onSuccess={(f) => push(...f)}
      >
        {({ browseFiles, getDropZoneProps }) => (
          <Box
            {...getDropZoneProps({
              onDragEnter: () => setDragging(true),
              onDragLeave: () => setDragging(false),
              onDrop: () => setDragging(false),
            })}
          >
            {files.map((image, index) => (
              <Box
                key={index}
                onClick={() => { if (!isLoading) removeAt(index); }}
                cursor={isLoading ? 'not-allowed' : 'pointer'}
                borderWidth={3}
                borderColor={STATUS_COLORS[image.status]}
                m={2}
                h={24}
                w={24}
                d="inline-block"
              >
                <Image
                  w="100%"
                  h="100%"
                  src={image.src.src}
                  onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  opacity={image.status && image.status !== 'pending' ? 0.5 : 1}
                  objectFit="cover"
                />
              </Box>
            ))}
            <Box
              cursor={isLoading ? 'not-allowed' : 'pointer'}
              borderWidth={3}
              borderColor="gray.100"
              m={2}
              h={24}
              w={24}
              textAlign="center"
              pt={8}
              verticalAlign="top"
              fontSize="2xl"
              backgroundColor="gray.100"
              d="inline-block"
              onClick={() => {
                if (isLoading) return;
                browseFiles({
                  onErrors: (e) => pushErrors(...e),
                  onSuccess: (f) => push(...f),
                });
              }}
            >
              +
            </Box>
          </Box>
        )}
      </Files>
      <Button
        mt={8}
        w="100%"
        disabled={files.length === 0}
        isLoading={isLoading}
        onClick={async () => {
          setIsLoading(true);
          for (const i in files) {
            const file = files[i];
            if (file.status) continue;

            updateAt(i, { ...file, status: 'pending' });
            try {
              await uploadPhoto(file);
              updateAt(i, { ...file, status: 'succeeded' });
            } catch (ex) {
              pushErrors({ file, message: ex.toString() });
              updateAt(i, { ...file, status: 'failed' });
            }
          }
          setIsLoading(false);
        }}
      >
        Upload All
      </Button>
      {errors.length > 0 && (
        <Box color="red.600" mt={8}>
          <Text mb={0} fontWeight="bold">Errors:</Text>
          <List styleType="disc">
            {errors.map((e, i) => (
              <ListItem key={i}>{e.file?.name}: {e.message || e.type}</ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
