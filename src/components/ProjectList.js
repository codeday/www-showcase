import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@codeday/topo/Atom/Box';
import ProjectPreview from './ProjectPreview';

export default function ProjectList({ projects }) {
  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap={8}>
      {projects
        .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
        .map((project) => <ProjectPreview project={project} />)}
    </Grid>
  );
}
ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
};
