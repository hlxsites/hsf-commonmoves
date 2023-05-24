let alreadyDeferred = false;
function initCommunityCards() {
  if (alreadyDeferred) {
    return;
  }
  alreadyDeferred = true;
  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.innerHTML = `
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '${window.hlx.codeBasePath}/blocks/community-directory/community-directory-delayed.js';
    document.head.append(script);
  `;
  document.head.append(script);
}


export default function decorate(block) {
    initCommunityCards();
}