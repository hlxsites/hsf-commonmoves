import { div, domEl } from '../../scripts/dom-helpers.js';

const loader = div({ class: 'search-results-loader' },
  /* @formatter:off */
  domEl('video', {
    autoplay: true, loop: true, muted: true, playsInline: true,
  }, domEl('source', {
    src: '/icons/maps/loader_opt.webm',
    type: 'video/webm',
  }), domEl('source', { src: '/icons/maps/loader_opt.mp4', type: 'video/mp4' }),
  ),
  /* @formatter:on */
);

export default loader;
