import isMobile from '@/utils/is-mobile';

import type { Notifications } from './types';

// const title = 'Jeopardy Companion';
const title = 'JCompanion';

const repository = 'https://github.com/s3cpat/jcompanion';

const messages = {
  app: {
    crash: {
      title: 'Sorry, something went wrong. You can:',
      options: {
        // email: `contact the app author by email - ${email}`,
        reset: 'Press here to reset the app',
      },
    },
  },
  loader: {
    fail: 'Loading is taking a long time... Try again later.',
  },
  images: {
    failed: 'This image failed to load',
  },
  404: 'This error code describes when a page cannot be found. "What is 404?" That is correct.',
};

const dateFormat = 'MMMM DD, YYYY';

const notifications: Notifications = {
  options: {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    autoHideDuration: 6000,
  },
  maxSnack: isMobile ? 3 : 4,
};

const loader = {
  // no more blinking in your app
  delay: 300, // if your asynchronous process is finished during 300 milliseconds you will not see the loader at all
  minimumLoading: 700, // but if it appears, it will stay for at least 700 milliseconds
};

const defaultMetaTags = {
  image: '/cover.png',
  description: 'JCompanion: Keep track of your own score as you watch Jeopardy!',
};

const giphy404 = "https://giphy.com/embed/l41lGvinEgARjB2HC";

export {
  loader,
  notifications,
  dateFormat,
  messages,
  repository,
  title,
  defaultMetaTags,
  giphy404,
};
