import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'listing-card-image';
      }
      else div.className = 'listing-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => {
    img.closest('div').className = 'listing-tile';
    let txt = img.closest('picture').nextSibling.textContent;
    console.log(txt);
    img.closest('picture').nextSibling.remove();
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, txt, false, [{ width: '750' }]));
  });
  block.textContent = '';
  block.append(ul);
}