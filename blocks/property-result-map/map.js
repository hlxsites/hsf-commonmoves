let alreadyDeferred = false;
function initGoogleMapsAPI() {
    if (alreadyDeferred) {
        return;
    }
    alreadyDeferred = true;
    const script = document.createElement('script');
    script.type = 'text/partytown';
    script.id = crypto.randomUUID();
    script.innerHTML = `
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '${window.hlx.codeBasePath}/blocks/property-result-map/map-delayed.js';
    document.head.append(script);
  `;
    document.head.append(script);
}

export async function render(block, searchParams = []) {
    const map = document.createElement('div');
    map.classList.add('property-result-map');
    block.append(map);
    initGoogleMapsAPI();
}