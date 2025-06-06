import React from 'react';
import {
  Box, Grid, Link, Text,
} from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../../components/Page';
import { ProjectsIndexQuery, PhotosIndexQuery, ProjectsPhotosIndexQuery } from './projects.gql';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import ProjectList from '../../../components/ProjectList';
import ProjectFilter from '../../../components/ProjectFilter';

const PER_PAGE = 20;

export default function Projects({
  additional, page, slug, events, projects, photos, startProjectFilter, startEventFilter,
}) {
  return (
    <Page slug="/">
      <Content>
        <ProjectFilter
          additional={additional}
          events={events}
          startEventFilter={startEventFilter}
          startProjectFilter={startProjectFilter}
        />
        {(projects && projects.length > 0) || (photos && photos.length > 0) ? (
          <>
            <ProjectList projects={projects} photos={photos} />
            <Grid templateColumns="1fr 1fr" mt={8} gap={8}>
              <Box>
                {page > 1 && (
                  <Link href={`/${slug}/${page - 1}${additional ? '/' + additional.join('&') : ''}`}>&laquo; Previous Page</Link>
                )}
              </Box>
              <Box textAlign="right">
                <Link href={`/${slug}/${page + 1}${additional ? '/' + additional.join('&') : ''}`}>Next Page &raquo;</Link>
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

export function makeFilter(params) {
  const eventFilter = (params?.eventFilter) ? params?.eventFilter : 'all';
  const additional = ((params?.args && params?.args[0] && isNaN(params?.args[0])) ? params?.args[0] : ((params?.args && params?.args[1]) ? params.args[1] : '')).split(',');
  let onlyType = null;

  const where = {
    ...(additional
      .filter(Boolean)
      .map((term) => {
        const [k, v] = term.split('=', 2);
        if (k === 'undefined') return;
        return { [k]: v?.includes(';') ? v.split(';') : (v || true) };
      })
      .reduce((accum, e) => ({ ...accum, ...e }), {})
    ),
  };

  if (where.type) where.type = where.type.toLowerCase() !== 'all' ? where.type.toUpperCase() : undefined;

  if (['labs', 'codeday'].includes(eventFilter.toLowerCase())) {
    where.program = eventFilter.toLowerCase();
  } else if (eventFilter.toLowerCase() !== 'all') {
    where.eventGroup = eventFilter;
  }

  if (additional.includes('photos')) onlyType = 'photos';
  if (additional.includes('projects')) onlyType = 'projects';

  return { where, eventFilter, additional, onlyType };
}

export function getGraphQuery(only) {
  if (only === 'photos') return PhotosIndexQuery;
  if (only === 'projects') return ProjectsIndexQuery;
  return ProjectsPhotosIndexQuery;
}

export async function getServerSideProps({ params }) {
  const page = parseInt(params?.args && !isNaN(params?.args[0]) ? params?.args[0] : (!isNaN(params?.eventFilter) ? params?.eventFilter : 1));
  const { where, eventFilter, additional, onlyType } = makeFilter(params);

  const photosWhere = [where].map(({
    event, eventGroup, program, region,
  }) => ({
    event, eventGroup, program, region,
  }))[0];
  
  const effectivePerPage = onlyType ? PER_PAGE * 2 : PER_PAGE ;

  const { result, error } = await tryAuthenticatedApiQuery(getGraphQuery(onlyType),
    {
      startLt: (new Date(new Date().getTime())).toISOString(),
      take: effectivePerPage,
      skip: ((page - 1) * effectivePerPage) || 0,
      where,
      photosWhere,
    });
  if (error) {
    console.log(error);
  }
  const events = result?.cms?.events?.items || [];
  const projects = result?.showcase?.projects || [];
  const photos = result?.showcase?.photos;

  return {
    props: {
      events: events || [],
      projects: projects || [],
      photos: photos || [],
      startProjectFilter: where.type ? where.type.toUpperCase() : 'ALL',
      startEventFilter: eventFilter.toLowerCase(),
      slug: `projects/${eventFilter}`,
      page,
      additional: additional || null,
    },
  };
}
