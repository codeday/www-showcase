import React from 'react';
import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { logRoles } from '@testing-library/react';
import Page, { getServerSideProps } from '../../src/pages/mine';
import { project } from '../sampleData';

test('Loads', async () => {
  render(<Page {...((await getServerSideProps({})).props)} />);
  expect(await screen.findByRole('banner')).toBeInTheDocument();
});

test('Loads, logged out', async () => {
  render(<Page loggedIn={false} />);
  expect(await screen.findByText(/you need to be logged in to view your projects\./i)).toBeInTheDocument();

});

describe('Loads, logged in', () => {
  test('No projects', async () => {
    render(<Page loggedIn={true} projects={[]} /> )
    expect(await screen.findByText(/you haven't created or been added to any projects yet\./i)).toBeInTheDocument();
  })
  test('With projects', async () => {
    render(<Page loggedIn={true} projects={[project]} /> )
    expect(await screen.findByText(project.name)).toBeInTheDocument();
  })
})
