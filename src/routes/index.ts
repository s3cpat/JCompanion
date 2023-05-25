import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

import asyncComponentLoader from '@/utils/loader';

import { Pages, Routes } from './types';

const routes: Routes = {
  [Pages.Home]: {
    component: asyncComponentLoader(() => import('@/pages/Home')),
    path: '/',
    title: 'Home',
    icon: HomeIcon,
  },
  [Pages.About]: {
    component: asyncComponentLoader(() => import('@/pages/About')),
    path: '/about',
    title: 'About JCompanion',
    icon: InfoIcon,
  },
  [Pages.Changelog]: {
    component: asyncComponentLoader(() => import('@/pages/Changelog')),
    path: '/changelog',
    title: 'Changelog',
    icon: PublishedWithChangesIcon,
  },
  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
};

export default routes;
