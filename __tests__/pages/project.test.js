import React from 'react';
import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { logRoles } from '@testing-library/react';
import Page from '../../src/pages/project/[projectId]/index';
import { project } from '../sampleData';


test('Loads and displays project info', async () => {
  render(<Page project={project} />);
  expect(await screen.findByRole('heading', {name: project.name})).toBeInTheDocument()
});


