export default async function decorate(block) {
  block.querySelector(':scope > div').classList.add('map');
}
