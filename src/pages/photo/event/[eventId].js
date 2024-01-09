import React from 'react';
import { Content } from '@codeday/topo/Molecule';
import {
  Button, Heading, Image, Text, Flex, Box,
} from '@codeday/topo/Atom';
import { getSession } from 'next-auth/client';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../components/Page';
import Photo from '../../../components/Photo';
import { EventPhotosQuery } from './eventPhotos.gql';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import PhotoZipDownload from '../../../components/PhotoZipDownload';

export default function Index({ photos }) {
  const { success, error } = useToasts();
  if (!photos) {
    return (
      <Page>
        <Content>
          <Heading>No photos found for event</Heading>
        </Content>
      </Page>
    );
  }
  return (
    <Page>
      <Content wide>
        <Text bold>{photos[0]?.eventGroup?.title} ({photos[0]?.region?.name})</Text>
        <Text>All photos</Text>
        <PhotoZipDownload photos={photos} />
        <Flex dir="row" wrap="wrap" alignContent="space-between" justifyContent="center">
          { photos.map((p) => (
            <Photo photo={p}>
              <Image src={p.url} maxH="xs" />
            </Photo>
          )) }
        </Flex>
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, res, params: { eventId } }) {
  const { result, error } = await tryAuthenticatedApiQuery(EventPhotosQuery, { eventId });
  if (error) console.error(error);
  return {
    props: {
      photos: result?.showcase?.photos || null,
    },
  };
}
