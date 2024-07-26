import { getMetadata } from '../../scripts/aem.js';
import { loadTemplateCSS } from '../../scripts/util.js';

export default function decorate(block) {
  const blockName = block.getAttribute('data-block-name');
  const designType = getMetadata('template');
  loadTemplateCSS(blockName, designType);
  const container = block.querySelector(':scope > div');
  container.children[0].classList.add('content');
  container.children[1].classList.add('image');
}
