import React from 'react';
import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { logRoles } from '@testing-library/react';
import Home, { getStaticProps } from '../../src/pages/index';

test('Loads and displays projects', async () => {
  render(<Home {...((await getStaticProps()).props)} />);

  const projects = await screen.findAllByRole('link', { name: /.*, a .* created at .*/ });
  expect(projects.length).toBeGreaterThan(0);
  projects.forEach((project) => {
    expect(project).toBeInTheDocument();
  });
  expect(await screen.findByRole('banner')).toBeInTheDocument();
});

test('Project filter exists, expands', async () => {
  /*
  * FIXME(@oohwooh) I have no idea why hidden: true needs to be in all of these queries, something is probably
  * misconfigured somewhere, but I don't know if it's a react-testing-library problem or something with how the DOM
  * is structured.
  */
  render(<Home {...((await getStaticProps()).props)} />);
  expect(await screen.findByRole('combobox', { name: /project type/i, hidden: true })).toBeInTheDocument();
  expect(await screen.findByRole('combobox', { name: /program/i, hidden: true })).toBeInTheDocument();
  expect(await screen.queryByPlaceholderText('anything')).not.toBeVisible();
  expect(await screen.queryByRole('checkbox', { name: /awarded/i, hidden: true })).not.toBeVisible();

  await userEvent.click(screen.getByRole('button', { name: /expand/i, hidden: true }));

  expect(await screen.findByRole('combobox', { name: /project type/i, hidden: true })).toBeInTheDocument();
  expect(await screen.findByRole('combobox', { name: /program/i, hidden: true })).toBeInTheDocument();
  expect(await screen.findByPlaceholderText('anything')).toBeInTheDocument();
  expect(await screen.findByRole('checkbox', { name: /awarded/i, hidden: true })).toBeInTheDocument();
});
