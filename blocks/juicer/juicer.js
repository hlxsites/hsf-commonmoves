import { readBlockConfig } from '../../scripts/lib-franklin.js';

function loadDelayed() {
  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.innerHTML = `
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '${window.hlx.codeBasePath}/blocks/juicer/juicer-delayed.js';
    document.head.append(script);
  `;
  document.head.append(script);
}

export default async function decorate(block) {
  const config = readBlockConfig(block);

  block.innerHTML = `
    <h2>${config.title}</h2>
    <ul class="juicer-feed" 
      data-feed-id="${config['feed-id']}"
      data-pages="${config.pages || 1}"
      data-per="${config.per || ''}"
      data-columns="${config.columns || 4}"></ul>
  `;

  window.setTimeout(loadDelayed, 3000);
}
