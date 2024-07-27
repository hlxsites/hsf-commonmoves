import { getMetadata, readBlockConfig } from '../../scripts/aem.js';
import { loadTemplateCSS } from '../../scripts/util.js';

export default async function decorate(block) {
  const blockName = block.getAttribute('data-block-name');
  const designType = getMetadata('template');
  loadTemplateCSS(blockName, designType);
  const config = readBlockConfig(block);

  block.innerHTML = `
    <p class="quote">${config.quote}</p>
    <div class="attribution">
      <p class="author">${config.author}</p>
      <p class="position">${config.position}</p>
    </div>
  `;
}
