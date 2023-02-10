import React from 'react';
import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { logRoles } from '@testing-library/react';
import Page, { getStaticProps } from '../../src/pages/projects';
import { project } from '../sampleData';


describe('Loads', () => {
  test('Displays projects', async () => {
    render(<Page {...((await getStaticProps({})).props)} />);
    const projects = await screen.findAllByRole('link', { name: /.*, a .* created at .*/i });
    expect(projects.length).toBeGreaterThan(0);
    projects.forEach((project) => {
      expect(project).toBeInTheDocument();
    });
  })
  test('Displays photos', async () => {
    render(<Page {...((await getStaticProps({})).props)} />);
    const photos = await screen.findAllByRole('img', { name: /a photo of .*/i });
    expect(photos.length).toBeGreaterThan(0);
    photos.forEach((photo) => {
      expect(photo).toBeInTheDocument();
    });
  })
});

describe('Filters work', () => {
  test.todo('Filter by project type')
  test.todo('Filter by program')
  test.todo('Filter by region')
})


