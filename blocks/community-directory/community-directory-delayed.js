let queryIndex;
export async function getQueryIndex() {
  if (!queryIndex) {
    const resp = await fetch('/communities/query-index.json');
    if (resp.ok) {
      queryIndex = await resp.json();
    }
  }
  return queryIndex;
}

async function initCommunityCards() {
    const index = await getQueryIndex();
    const block = document.querySelector('.community-directory');
    
    const list = document.createElement('div');
    list.classList.add('cards-list');
    block.classList.add(`cards-4-cols`);
    index.data.forEach((community) => {
        const communityName = community["LiveBy Community"];

        const card = document.createElement('div');
        card.onclick = () => {
            document.location.href = community.path;
        }

        card.classList.add('cards-item');
        const picture = document.createElement('picture');
        const img = document.createElement('img');
        img.src = community.image;
        img.alt = communityName;
        picture.append(img);
        const paragraphElement = document.createElement(('p'));
        paragraphElement.textContent = `Explore ${communityName}`;
        card.append(picture, paragraphElement);
        list.append(card);
    });
    block.append(list);
}

initCommunityCards();