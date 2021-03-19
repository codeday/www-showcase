import React, { useState, useEffect } from 'react';
import { Select, Stack } from '@chakra-ui/core';
import Text from '@codeday/topo/Atom/Text/Text';
import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Page from '../../../components/Page';
import { ProjectsIndexQuery } from './projects.gql';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import Button from '@codeday/topo/Atom/Button';
import ProjectList from '../../../components/ProjectList';
import Link from '@codeday/topo/Atom/Text/Link';
import Input from '@codeday/topo/Atom/Input/Text';
import Checkbox from '@codeday/topo/Atom/Input/Checkbox';
import Collapse from '@codeday/topo/Molecule/Collapse';
import { UiArrowDown, UiArrowRight } from "@codeday/topocons/Icon"
import PropTypes from 'prop-types';
import { PROJECT_TYPES } from './../../../util/projectTypes';

const PER_PAGE = 20;

export default function Projects({ additional, page, slug, events, projects, startProjectFilter, startEventFilter }) {
  return (
    <Page slug="/">
      <Content>
        <ProjectFilter additional={additional} events={events} startEventFilter={startEventFilter} startProjectFilter={startProjectFilter} />
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

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const projectFilter = params?.projectFilter && params?.projectFilter !== "undefined" ? params?.projectFilter : "PROJECTS";
  if ((projectFilter.toUpperCase() !== "PROJECTS") && !PROJECT_TYPES[projectFilter.toUpperCase()]) throw new Error("Invalid project type filter.");
  const eventFilter = (params?.eventFilter) ? params?.eventFilter : "all";
  const page = parseInt(params?.args && !isNaN(params?.args[0]) ? params?.args[0] : (!isNaN(params?.eventFilter) ? params?.eventFilter : 1));
  const additional = ((params?.args && params?.args[0] && isNaN(params?.args[0])) ? params?.args[0] : ((params?.args && params?.args[1]) ? params.args[1] : '')).split(',');

  const where = {
    ...(additional
      .filter(Boolean)
      .map((term) => {
        let [k, v] = term.split('=', 2);
        if (k === 'undefined') return;
        return { [k]: v || true };
      })
      .reduce((accum, e) => ({ ...accum, ...e }), {})
    )
  }

  if (projectFilter.toLowerCase() !== "all" && projectFilter.toLowerCase() !== "projects" && typeof (projectFilter)) {
    where.type = projectFilter.toUpperCase()
  }

  if (["virtual", "labs"].includes(eventFilter.toLowerCase())) {
    where.program = eventFilter.toLowerCase()
  } else if (eventFilter.toLowerCase() !== "all") {
    where.eventGroup = eventFilter
  }
  const { result, error } = await tryAuthenticatedApiQuery(ProjectsIndexQuery,
    {
      startGt: '2020-07-06T05:00:00.000Z',
      startLt: (new Date(new Date().getTime())).toISOString(),
      take: PER_PAGE,
      skip: ((page - 1) * PER_PAGE) || 0,
      where,
    });
  if (error) {
    console.log(error)
  }
  const events = result?.cms?.events?.items
  const projects = result?.showcase?.projects

  return {
    props: {
      events: events || [],
      projects: projects || [],
      startProjectFilter: projectFilter.toUpperCase() || "ALL",
      startEventFilter: eventFilter.toLowerCase(),
      slug: `${projectFilter.toLowerCase()}/${eventFilter}`,
      page,
      additional: additional || null,
    },
    revalidate: 60,
  };
}


export function ProjectFilter({ additional, startProjectFilter, startEventFilter, events }) {
  const additionalData = additional ? (
    additional.filter(Boolean)
      .map((term) => {
        let [k, v] = term.split('=', 2);
        if (k === 'undefined') return;
        return { [k]: v || true };
      })
      .reduce((accum, e) => ({ ...accum, ...e }), {})) : []
  const [contains, setContains] = useState(additionalData.contains || null);
  const [awarded, setAwarded] = useState(additionalData.awarded || false);
  const [showAdditional, setShowAdditional] = React.useState((contains || awarded));
  const [projectTypeFilter, setProjectTypeFilter] = useState(startProjectFilter);
  const [eventFilter, setEventFilter] = useState(startEventFilter);
  const newAdditional = [(awarded ? 'awarded' : null), (contains ? `contains=${contains}` : null)].filter(Boolean).join(",")

  return (
    <Box display={{ base: "none", sm: "none", md: "block", lg: "block" }}>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (showAdditional) {
          // eslint-disable-next-line no-undef
          window.location.href = `/${projectTypeFilter.toLowerCase()}/${eventFilter}/${newAdditional}`;
        } else {
          window.location.href = `/${projectTypeFilter.toLowerCase()}/${eventFilter}`;
        }
      }}>
        <Stack isInline marginTop={-12}>
          <Button size="sm" as="a" fontSize="l" onClick={() => setShowAdditional(!showAdditional)} zIndex={1000}>{showAdditional ? <UiArrowDown /> : <UiArrowRight />}</Button>
          <Text fontSize="xl">Browse all</Text>
          <Select
            width="fit-content"
            size="sm"
            fontSize="lg"
            onChange={(e) => {
              setProjectTypeFilter(e.target.value);
            }}
            value={projectTypeFilter}
            zIndex={1000}
          >
            <option value="PROJECTS">projects</option>
            <option value="APP">apps 📲</option>
            <option value="GAME">games 🎮</option>
            <option value="VR">vr projects</option>
            <option value="HARDWARE">hardware projects ⚙️</option>
            <option value="WEBSITE">websites 🌐</option>
            <option value="LIBRARY">libraries 📚</option>
            <option value="BOT">bots 🤖</option>
            <option value="OTHER">other projects</option>
          </Select>
          <Text fontSize="xl">from</Text>
          <Select
            width="fit-content"
            size="sm"
            fontSize="lg"
            onChange={(e) => {
              setEventFilter(e.target.value);
            }}
            value={eventFilter}
            zIndex={1000}
          >
            <option value="all">all events</option>
            <option value="virtual">Virtual Codedays</option>
            <option value="labs">CodeDay Labs</option>
            {events.map((event) => (
              <option value={event.id}>{event.title}</option>
            ))}
          </Select>
          {!showAdditional && <Button type="submit" size="sm" fontSize="l" variantColor="brand" zIndex={1000}>Go</Button>}
        </Stack>
        <Collapse isOpen={showAdditional}>
          <Stack isInline ml="10%">
            <Text fontSize="xl">that contain</Text>
            <Input placeholder="anything" value={contains} width="20%" onChange={(e) => setContains(e.target.value)} size="sm" fontSize="l" />
            <Text fontSize="xl">and are</Text>
            <Checkbox size="lg" mb={3} isChecked={awarded} onChange={(e) => setAwarded(e.target.checked)} borderColor="gray.300">awarded</Checkbox>
            <Button type="submit" size="sm" fontSize="l" variantColor="brand">Go</Button>
          </Stack>
        </Collapse>
      </form>
    </Box>
  )
}

ProjectFilter.propTypes = {
  additional: PropTypes.string,
  startProjectFilter: PropTypes.string,
  startEventFilter: PropTypes.string,
  events: PropTypes.array
}
ProjectFilter.defaultProps = {
  additional: null,
  startProjectFilter: 'projects',
  startEventFilter: 'all',
  events: [],
}