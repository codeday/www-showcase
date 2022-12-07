import { apiFetch } from '@codeday/topo/utils';
import { Heading, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../components/Page';
import { GetRegionsQuery, RegionQuery } from './index.gql';

export default function RegionInfo({ region }) {
  console.log(region);
  return (
    <Page>
      <Content textAlign="center">
        <Heading as="h2" fontSize="3xl" mb={8}>Which projects do you want to see from {region.name}?</Heading>
        <Link fontSize="xl" d="block" href={`/projects/all/region=${region.webname}`}>All projects</Link>
        {region.clearEvents.map((e) => (
          <Link fontSize="xl" d="block" key={e.id} href={`/projects/all/event=${e.id}`}>CodeDay {e.eventGroup.name}</Link>
        ))}
      </Content>
    </Page>
  );
}

export async function getStaticPaths() {
  return {
    paths: (await apiFetch(GetRegionsQuery)).cms.regions.items.map(({ webname }) => ({ params: { region: webname } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params: { region } }) {
  const res = await apiFetch(RegionQuery, { webname: region });
  if (!res?.cms?.regions?.items || res.cms.regions.items.length === 0) return { notFound: true };

  return {
    props: {
      region: res.cms.regions.items[0],
    },
  };
}
