import { type Menu } from '~/shared/AsideMenu';

export const menus: Menu[] = [
  {
    label: 'Getting Started',
    children: [
      {
        label: 'Introduction',
        path: 'introduction',
      },
      {
        label: 'Project Setup',
        path: 'project-setup',
      },
    ],
  },
  {
    label: 'Core Concepts',
    children: [
      {
        label: 'Routing',
        path: 'core-concepts/routing',
      },
      {
        label: 'Route Data',
        path: 'core-concepts/route-data',
      },
      {
        label: 'Form Actions',
        path: 'core-concepts/form-actions',
      },
    ],
  },
];
