export type Menu = {
  label: string;
  path?: string;
  children?: Menu[];
};

export const menus: Menu[] = [
  {
    label: 'Guide',
    children: [
      {
        label: 'Quick Start',
        path: '/start',
      },
      {
        label: 'Theme',
        path: '/theme',
      },
      {
        label: 'Dark Mode',
        path: '/dark-mode',
      },
      {
        label: 'Animation',
        path: '/animation',
      },
    ],
  },
  {
    label: 'General',
    children: [
      {
        label: 'Button',
        path: '/components/button',
      },
      {
        label: 'Icon',
        path: '/components/icon',
      },
      {
        label: 'Image',
        path: '/components/image',
      },
      {
        label: 'Typography',
        path: '/components/typography',
      },
    ],
  },
  {
    label: 'Layout',
    children: [
      {
        label: 'Layout',
        path: '/components/layout',
      },
      {
        label: 'Flex',
        path: '/components/flex',
      },
      {
        label: 'Grid',
        path: '/components/grid',
      },
      {
        label: 'Table',
        path: '/components/table',
      },
      {
        label: 'Divider',
        path: '/components/divider',
      },
    ],
  },
  {
    label: 'Data Display',
    children: [
      {
        label: 'Avatar',
        path: '/components/avatar',
      },
      {
        label: 'Badge',
        path: '/components/badge',
      },
    ],
  },
  {
    label: 'Data Input',
    children: [
      {
        label: 'Input',
        path: '/components/input',
      },
      {
        label: 'NumberInput',
        path: '/components/number-input',
      },
      {
        label: 'Select',
        path: '/components/select',
      },
      {
        label: 'Slider',
        path: '/components/slider',
      },
      {
        label: 'Checkbox',
        path: '/components/checkbox',
      },
      {
        label: 'Radio',
        path: '/components/radio',
      },
      {
        label: 'Switch',
        path: '/components/switch',
      },
    ],
  },
  {
    label: 'Feedback',
    children: [
      {
        label: 'Alert',
        path: '/components/alert',
      },
      {
        label: 'Toast',
        path: '/components/toast',
      },
      {
        label: 'Tooltip',
        path: '/components/tooltip',
      },
      {
        label: 'Popover',
        path: '/components/popover',
      },
      {
        label: 'Modal',
        path: '/components/modal',
      },
      {
        label: 'Drawer',
        path: '/components/drawer',
      },
      {
        label: 'ProgressBar',
        path: '/components/progress-bar',
      },
      {
        label: 'Spinner',
        path: '/components/spinner',
      },
      {
        label: 'Overlay',
        path: '/components/overlay',
      },
      {
        label: 'SpinnerOverlay',
        path: '/components/spinner-overlay',
      },
    ],
  },
  {
    label: 'Navigation',
    children: [
      {
        label: 'Breadcrumb',
        path: '/components/breadcrumb',
      },
      {
        label: 'Pagination',
        path: '/components/pagination',
      },
      {
        label: 'DropdownMenu',
        path: '/components/dropdown-menu',
      },
      {
        label: 'ContextMenu',
        path: '/components/context-menu',
      },
    ],
  },
];
