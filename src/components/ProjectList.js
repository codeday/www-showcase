import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@codeday/topo/Atom/Box';
import ProjectPreview from './ProjectPreview';
import shuffle from 'knuth-shuffle-seeded';
import Photo from './Photo';

export default function ProjectList({ projects, photos }) {
  const sortedProjects = projects
        .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
        .map((project) => <ProjectPreview project={project} />) || [];

  const photoPairs = photos
    ?.reduce((result, value, index, sourceArray) => index % 2 === 0 ? [...result, sourceArray.slice(index, index + 2)] : result, [])
    .map(([a, b]) => <Grid templateColumns="repeat(2, 1fr)" gap={8}><Photo photo={a} /><Photo photo={b} /></Grid>) || []

  const interleaved = shuffle([...sortedProjects, ...photoPairs], 'a');

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
      {interleaved}
    </Grid>
  );
}
ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
};
