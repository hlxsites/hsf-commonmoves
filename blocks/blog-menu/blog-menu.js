export default async function decorate(block) {
  const selectedCategoryUrl = window.location.href;
  const blogNav = document.createElement('nav');
  const blogNavContent = block.querySelector(':scope > div:last-of-type');
  const selectedCategoryEl = document.createElement('div');
  let categoryName = 'Blog Categories';
  selectedCategoryEl.classList.add('blog-nav-selected');
  blogNav.classList.add('blog-nav', 'text-up');

  [...blogNavContent.querySelector('div').children].forEach((child) => {
    if (child.querySelector('li')) {
      [...child.children].forEach((category) => {
        if (selectedCategoryUrl.includes(category.querySelector('a').href)) {
          category.querySelector('a').classList.add('selected-cat');
          categoryName = category.textContent;
        }
      });
      selectedCategoryEl.innerHTML = ` <span>${categoryName}</span> <img src="/icons/dropdown-icon.svg" alt="dropdown-icon" class="category-dropdown-icon">`;
      blogNav.appendChild(selectedCategoryEl);
    }
    blogNav.appendChild(child);
  });
  block.replaceChild(blogNav, blogNavContent);
  const categoriesList = block.querySelector('ul');

  selectedCategoryEl.addEventListener('click', () => {
    categoriesList.style.visibility = window.getComputedStyle(categoriesList).visibility === 'hidden' ? 'visible' : 'hidden';
  });

  // add logic to stick blog nav header to top of the page
  window.onscroll = () => {
    const sticky = blogNav.offsetTop;
    if (window.pageYOffset > sticky) {
      blogNav.classList.add('sticky');
    } else {
      blogNav.classList.remove('sticky');
    }
  };
}
