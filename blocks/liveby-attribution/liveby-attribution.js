export default async function decorate(block) {
  block.innerHTML = `
    <a href="https://liveby.com/" target="_blank">
      <img src="/icons/liveby.png" alt="Powered by LiveBy" />
    </a>
  `;
}
