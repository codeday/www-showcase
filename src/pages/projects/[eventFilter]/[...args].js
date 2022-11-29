import React from 'react';
import Text from '@codeday/topo/Atom/Text/Text';
import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Page from '../../../components/Page';
import { ProjectsIndexQuery } from './projects.gql';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import ProjectList from '../../../components/ProjectList';
import ProjectFilter from '../../../components/ProjectFilter';
import Link from '@codeday/topo/Atom/Text/Link';
import { PROJECT_TYPES } from '../../../util/projectTypes';

const PER_PAGE = 20;

export default function Projects({ additional, page, slug, events, projects, photos, startProjectFilter, startEventFilter }) {
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

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export function makeFilter(params) {
  const projectFilter = params?.projectFilter && params?.projectFilter !== "undefined" ? params?.projectFilter : "PROJECTS";
  if ((projectFilter.toUpperCase() !== "PROJECTS") && !PROJECT_TYPES[projectFilter.toUpperCase()]) throw new Error("Invalid project type filter.");
  const eventFilter = (params?.eventFilter) ? params?.eventFilter : "all";
  const additional = ((params?.args && params?.args[0] && isNaN(params?.args[0])) ? params?.args[0] : ((params?.args && params?.args[1]) ? params.args[1] : '')).split(',');

  const where = {
    ...(additional
      .filter(Boolean)
      .map((term) => {
        let [k, v] = term.split('=', 2);
        if (k === 'undefined') return;
        return { [k]: v?.includes(';') ? v.split(';') : (v || true) };
      })
      .reduce((accum, e) => ({ ...accum, ...e }), {})
    )
  }

  if (projectFilter.toLowerCase() !== "all" && projectFilter.toLowerCase() !== "projects" && typeof (projectFilter)) {
    where.type = projectFilter.toUpperCase()
  }

  if (["virtual", "labs", "codeday"].includes(eventFilter.toLowerCase())) {
    where.program = eventFilter.toLowerCase()
  } else if (eventFilter.toLowerCase() !== "all") {
    where.eventGroup = eventFilter
  }

  return { where, projectFilter, eventFilter, additional };
}

export async function getStaticProps({ params }) {
  const page = parseInt(params?.args && !isNaN(params?.args[0]) ? params?.args[0] : (!isNaN(params?.eventFilter) ? params?.eventFilter : 1));
  const { where, projectFilter, eventFilter, additional } = makeFilter(params);
  const photosWhere = [where].map(({event, eventGroup, program, region }) => ({ event, eventGroup, program, region}))[0];
  const { result, error } = await tryAuthenticatedApiQuery(ProjectsIndexQuery,
    {
      startLt: (new Date(new Date().getTime())).toISOString(),
      take: PER_PAGE,
      skip: ((page - 1) * PER_PAGE) || 0,
      where,
      photosWhere,
    });
  if (error) {
    console.log(error)
  }
  const events = result?.cms?.events?.items
  const projects = result?.showcase?.projects
  const photos = result?.showcase?.photos

  return {
    props: {
      events: events || [],
      projects: projects || [],
      photos: photos || [],
      startProjectFilter: projectFilter.toUpperCase() || "ALL",
      startEventFilter: eventFilter.toLowerCase(),
      slug: `${projectFilter.toLowerCase()}/${eventFilter}`,
      page,
      additional: additional || null,
    },
    revalidate: 60,
  };
}

