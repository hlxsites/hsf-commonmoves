function openAccordion() {
  var parent = this.closest('.accordion-item');
  parent.classList.toggle('collapse');
}

function createAccordionHeader(heading, tooltipText) {
  const accordionTitle = document.createElement('div');
  accordionTitle.className = 'accordion-title';
  accordionTitle.innerHTML = `
    <div class="property-container">
      <div class="property-row">
        <div class="col col-12 offset-md-1 col-md-10">
          <div class="accordion-header">
            <h2 class="accordion-header-title">${heading}</h2>
            <div class="tooltip">
              <span class="icon icon-info_circle"></span>
              <span class="icon icon-info_circle_dark"></span>
              <span class="tooltiptext">${tooltipText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  return accordionTitle;
}

export function createAccordionItem(className, headerTitle, citation, innerHTML) {
  const accordionItem = document.createElement('div');
  accordionItem.className = `accordion-item ${className}`;
  const accordionTitle = createAccordionHeader(headerTitle, citation);
  const accordionBody = document.createElement('div');
  accordionBody.className = 'accordion-body';
  accordionBody.innerHTML = innerHTML;
  accordionItem.append(accordionTitle);
  accordionItem.append(accordionBody);
  var accordionHeader = accordionItem.querySelector('.accordion-header');
  accordionHeader.addEventListener('click', openAccordion);
  return accordionItem;
}