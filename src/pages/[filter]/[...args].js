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
export default function Home({ projects, page, slug }) {
  return (
    <Page slug="/">
      <Content>
        {projects && projects.length > 0 ? (
          <>
            <ProjectList projects={projects} />
            <Grid templateColumns="1fr 1fr" mt={8} gap={8}>
              <Box>
                {page > 1 && (
                  <Link href={`/${slug}/${page - 1}`}>&laquo; Previous Page</Link>
                )}
              </Box>
              <Box textAlign="right">
                <Link href={`/${slug}/${page + 1}`}>Next Page &raquo;</Link>
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
  const [pageOrFilter, nullOrPage] = params.args;

  if (typeof filterKey === 'undefined') {
    throw new Error(`${params.filter} is not a valid filter.`);
  }

  const where = filterKey ? { [filterKey]: pageOrFilter } : undefined;
  const page = Number(filterKey ? nullOrPage : pageOrFilter) || 1;

  const { result, error } = await tryAuthenticatedApiQuery(IndexQuery, {
    take: PER_PAGE,
    skip: page * PER_PAGE,
    where,
  });
  if (error) console.error(error);

  return {
    props: {
      projects: result?.showcase?.projects || [],
      page: page,
      slug: `${params.filter}${filterKey ? `/${pageOrFilter}` : ''}`,
    },
    revalidate: 60,
  };
}
