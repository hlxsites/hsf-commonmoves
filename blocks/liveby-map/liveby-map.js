import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

let alreadyDeferred = false;
function initGoogleMapsAPI() {
  if (alreadyDeferred) {
    return;
  }
  alreadyDeferred = true;
  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.innerHTML = `
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '${window.hlx.codeBasePath}/blocks/liveby-map-delayed/liveby-map-delayed.js';
    document.head.append(script);
  `;
  document.head.append(script);
}


export default async function decorate(block) {
  const map = document.createElement('div');
  map.classList.add("liveby-map-main")
  block.append(map);
  initGoogleMapsAPI();
}
