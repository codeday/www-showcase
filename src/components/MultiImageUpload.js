import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import List, { Item as ListItem } from '@codeday/topo/Atom/List';
import { Stack } from '@chakra-ui/core';
import { useState } from 'react';
import Files from 'react-butterfiles';
import { useList } from 'react-use';
import Text from '@codeday/topo/Atom/Text';

const STATUS_COLORS = {
  pending: 'blue.500',
  failed: 'red.500',
  succeeded: 'green.500',
}

export default function MultiImageUpload({ uploadPhoto, ...props }) {
  const [errors, { push: pushErrors }] = useList([]);
  const [dragging, setDragging] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [files, { push, removeAt, updateAt }] = useList([]);

  return (
    <Box borderColor={dragging ? 'blue.500' : undefined} borderWidth={2} p={8} {...props}>
      <Files
          multiple
          convertToBase64
          maxSize="50mb"
          multipleMaxSize={null}
          accept={["image/jpg", "image/jpeg", "image/png"]}
          onError={(e) => pushErrors(...e)}
          onSuccess={f => push(...f)}
      >
          {({ browseFiles, getDropZoneProps }) => (
              <Box
                  {...getDropZoneProps({
                      onDragEnter: () => setDragging(true),
                      onDragLeave: () => setDragging(false),
                      onDrop: () => setDragging(false),
                  })}
              >
                  <Stack direction="row" spacing={2}>
                      {files.map((image, index) => (
                          <Box
                              key={index}
                              onClick={() => removeAt(index)}
                              cursor="pointer"
                              borderWidth={3}
                              borderColor={STATUS_COLORS[image.status]}
                          >
                            <Box
                              h={24}
                              w={24}
                              backgroundImage={`url(${image.src.base64})`}
                              backgroundPosition="50% 50%"
                              backgroundSize="cover"
                              opacity={image.status && image.status !== 'pending' ? 0.5 : 1}
                            />
                          </Box>
                      ))}
                      <Box
                        cursor="pointer"
                        borderWidth={3}
                        borderColor="gray.100"
                        onClick={() => {
                          browseFiles({
                            onErrors: (e) => pushErrors(...e),
                            onSuccess: (f) => push(...f),
                          });
                        }}
                      >
                        <Box
                          h={24}
                          w={24}
                          textAlign="center"
                          pt={8}
                          fontSize="2xl"
                          backgroundColor="gray.100"
                        >
                          +
                        </Box>
                      </Box>
                  </Stack>
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
            }
            catch (ex) {
              pushErrors({ file, message: ex.toString()});
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
