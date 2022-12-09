import React from 'react';
import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProjectPreview from '../../src/components/ProjectPreview';
import { project } from '../sampleData';

test('Loads and displays project info', async () => {
  render(<ProjectPreview project={project} />);
  expect(await screen.findByRole('heading')).toHaveTextContent(project.name);
});
