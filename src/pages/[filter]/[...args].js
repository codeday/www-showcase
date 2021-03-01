import React from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Link, Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import { tryAuthenticatedApiQuery } from '../../util/api';
import Page from '../../components/Page';
import ProjectList from '../../components/ProjectList';
import { IndexQuery } from './index.gql';

const PER_PAGE = 20;
export default function Home({ projects, page, slug, additional }) {
  return (
    <Page slug="/">
      <Content>
        {projects && projects.length > 0 ? (
          <>
            <ProjectList projects={projects} />
            <Grid templateColumns="1fr 1fr" mt={8} gap={8}>
              <Box>
                {page > 1 && (
                  <Link href={`/${slug}/${page - 1}${additional ? `/${additional}` : ''}`}>&laquo; Previous Page</Link>
                )}
              </Box>
              <Box textAlign="right">
                <Link href={`/${slug}/${page + 1}${additional ? `/${additional}` : ''}`}>Next Page &raquo;</Link>
              </Box>
            </Grid>
          </>
        ) : (
          <Text bold>No projects to show right now, check back later.</Text>
        )}
      </Content>
    </Page>
  );
}
Home.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const FILTER_MAPS = {
  'e': 'event',
  'g': 'eventGroup',
  'p': 'program',
  'all': null,
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const filterKey = FILTER_MAPS[params.filter];
  const argOffset = filterKey ? 1 : 0;

  const filterContent = filterKey ? params.args[0] : null;
  const page = Math.max(1, Number.parseInt(params.args[argOffset]) || 1);
  const additional = (params.args[1 + argOffset] || '').split(',');

  if (typeof filterKey === 'undefined') {
    throw new Error(`${params.filter} is not a valid filter.`);
  }

  const where = {
    ...(filterKey && { [filterKey ]: filterContent }),
    ...(additional
      .filter(Boolean)
      .map((term) => {
        let [ k, v ] = term.split('=', 2);
        if (k === 'type' && v) v = v.toUpperCase();
        return { [k]: v || true };
      })
      .reduce((accum, e) => ({ ...accum, ...e }), {})
    )
  };

  const { result, error } = await tryAuthenticatedApiQuery(IndexQuery, {
    take: PER_PAGE,
    skip: (page - 1) * PER_PAGE,
    where,
  });
  if (error) console.error(error);

  return {
    props: {
      projects: result?.showcase?.projects || [],
      page: page,
      slug: `${params.filter}${filterContent ? `/${filterContent}` : ''}`,
      additional: additional || null,
    },
    revalidate: 60,
  };
}
