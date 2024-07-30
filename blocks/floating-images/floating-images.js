import { getMetadata, loadCSS } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = block.querySelector(':scope > div');
  container.children[0].classList.add('content');
  container.children[1].classList.add('image');
  const design = getMetadata('template');
  const {blockName} = block.dataset;

  await loadCSS(`${window.hlx.codeBasePath}/blocks/${blockName}/${design}.css`);
}
