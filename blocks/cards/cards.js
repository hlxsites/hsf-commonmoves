export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'cards-item';
    [...row.children].forEach((div) => {
      if (div.querySelector('picture')) {
        // update container for picture with label
        div.className = 'cards-card-image';
        if (div.lastChild.nodeType === Node.TEXT_NODE) {
          const picture = div.querySelector('picture');
          const paragraphElement = document.createElement(('p'));
          paragraphElement.append(div.lastChild);
          div.append(picture, paragraphElement);
        }
      } else div.className = 'cards-card-body';
    });
  });
}
