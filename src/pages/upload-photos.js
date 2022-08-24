import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import Content from '@codeday/topo/Molecule/Content';
import { Heading, Link } from '@codeday/topo/Atom/Text';
import List, { Item as ListItem } from '@codeday/topo/Atom/List';
import Page from '../components/Page';
import ForceLoginPage from '../components/ForceLoginPage';
import MultiImageUpload from '../components/MultiImageUpload';
import { GetAllEventsQuery, UploadPhotoMutation } from './upload-photos.gql';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { tryAuthenticatedApiQuery } from '../util/api';
import { mintToken } from '../util/token';

export default function UploadPhotos({ logIn, allEvents, token }) {
  const [thanks, setThanks] = useState('');
  const [event, setEvent] = useState(null);
  const { info } = useToasts();

  const eventInfo = allEvents?.cms?.events?.items
    ?.flatMap(eg => Object.entries(eg.subEventIds).map(([eventId, nameOrConfig]) => ({
      programId: eg.program?.webname,
      eventGroupId: eg.id,
      eventId,
      regionId: typeof nameOrConfig === 'string' ? undefined : nameOrConfig.region,
      title: typeof nameOrConfig === 'string' ? nameOrConfig : nameOrConfig.title,
    })));

  if (logIn) return <ForceLoginPage />;

  if (!event) {
    return (
      <Page slug="/upload-photos">
        <Content mt={-8}>
          <Heading as="h2" fontSize="4xl">Upload Photos</Heading>
          <Heading as="h3" fontSize="2xl">1. Enter Photo Credit (Optional)</Heading>
          <Input value={thanks} onChange={(e) => setThanks(e.target.value)} placeholder="(e.g. photographer name)" />

          <Heading as="h3" fontSize="2xl" mt={8}>2. Select An Event</Heading>
          <List styleType="disc">
            {eventInfo.map((ei) => (
              <ListItem key={ei.eventId}>
                <Link
                  onClick={() => setEvent(ei)}
                >{ei.eventGroupId} ~ {ei.title}</Link>
              </ListItem>
            ))}
          </List>
        </Content>
      </Page>
    )
  }

  return (
    <Page slug="/upload-photos">
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" mb={8}>Upload Photos: {event.eventGroupId} ~ {event.title}</Heading>
        <MultiImageUpload
          uploadPhoto={async (file) => {
            info(`Uploading ${file.name}`)
            const { result, error: resultError } = await tryAuthenticatedApiQuery(
              UploadPhotoMutation,
              { upload: file.src.file, ...event, thanks },
              token
            );
            if (resultError) throw new Error(resultError);
          }}
        />
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, params }) {
  const session = await getSession({ req });
  if (!session?.user?.admin) return { props: { logIn: true } };

  const allEvents = await apiFetch(GetAllEventsQuery);
  const token = mintToken(session);

  return { props: {
    allEvents,
    token,
  } };
}
