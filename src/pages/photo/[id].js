import React from 'react';
import { Content } from '@codeday/topo/Molecule';
import {
  Button, Heading, Image, Text,
} from '@codeday/topo/Atom';
import { getSession } from 'next-auth/client';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../components/Page';
import { tryAuthenticatedApiQuery } from '../../util/api';
import { DeletePhotoMutation, PhotoQuery } from './photo.gql';
import { mintToken } from '../../util/token';

export default function Index({ photo, isAdmin, token }) {
  const { success, error } = useToasts();
  if (!photo) {
    return (
      <Page>
        <Content>
          <Heading>Photo Not Found</Heading>
        </Content>
      </Page>
    );
  }
  return (
    <Page>
      <Content>
        <Text bold>{photo.eventGroup.title} ({photo.region.name})</Text>
        <Text>{photo.thanks ? <Text>Attribution: {photo.thanks}</Text> : null}</Text>
        <Image src={photo.url} />
        {
          isAdmin ? (
            <Text>
              Uploaded At: {photo.createdAt}
              <br />
              <Button onClick={async () => {
                try {
                  await tryAuthenticatedApiQuery(DeletePhotoMutation, { id: photo.id }, token);
                  success('Photo Deleted');
                  ``;
                } catch (e) {
                  error(e.toString());
                }
              }}
              >Delete
              </Button>
              <Button onClick={async () => {
                try {
                  await tryAuthenticatedApiQuery(DeletePhotoMutation, { id: photo.id }, token);
                  success('Photo Deleted');
                } catch (e) {
                  error(e.toString());
                }
              }}
              >Delete
              </Button>
            </Text>
          ) : null
        }
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, res, params: { id } }) {
  const session = await getSession({ req });
  const token = session ? mintToken(session) : null;
  const { result, error } = await tryAuthenticatedApiQuery(PhotoQuery, { id });
  if (error) console.error(error);
  return {
    props: {
      isAdmin: session?.user?.admin || false,
      token: token || null,
      photo: result?.showcase?.photo || null,
    },
  };
}
