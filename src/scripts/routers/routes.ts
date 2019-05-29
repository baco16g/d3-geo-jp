import React from 'react';
import {Routes} from 'universal-router';

const routes: Routes<any, {default: React.ComponentType}> = [
  {
    path: '/',
    action: () => import('../views/pages'),
  },
];

export default routes;
