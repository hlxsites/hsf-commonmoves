import { render as renderCards } from '../shared/property/cards.js';
import { getUserDetails } from '../../scripts/apis/user.js';
import { getSavedProperties, removeSavedProperty } from '../../scripts/apis/creg/creg.js';

function registerEvents(block, contactKey) {
  const saveButtons = block.querySelectorAll('.saved-properties .button-property .icon-heartfull');
  saveButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const listingTile = button.closest('.listing-tile');
      listingTile.classList.add('unsave');
      const confirmationModal = block.querySelector('.confirmation-modal');
      confirmationModal.classList.add('open');
      const $body = document.querySelector('body');
      $body.classList.add('modal-open');
    });
  });

  const cancelButton = block.querySelector('.cancel-button');
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    const listingTile = block.querySelectorAll('.unsave');
    listingTile.forEach((tile) => {
      tile.classList.remove('unsave');
    });
    const confirmationModal = block.querySelector('.confirmation-modal');
    confirmationModal.classList.remove('open');
    const $body = document.querySelector('body');
    $body.classList.remove('modal-open');
  });

  const unsaveButton = block.querySelector('.unsave-btn');
  unsaveButton.addEventListener('click', (e) => {
    e.preventDefault();
    const spinner = block.querySelector('.exit');
    spinner.classList.add('show');
    const listingToRemove = block.querySelector('.unsave');
    const listingLink = listingToRemove.querySelector('a');
    let [, propertyId] = listingLink.getAttribute('href').split('/').pop().split('pid-');
    if (propertyId) {
      [propertyId] = propertyId.split('?');
    }
    const confirmationModal = block.querySelector('.confirmation-modal');
    const $body = document.querySelector('body');
    $body.classList.remove('modal-open');
    removeSavedProperty(contactKey, propertyId).then(() => {
      spinner.classList.remove('show');
      listingToRemove.remove();
      confirmationModal.classList.remove('open');
    });
  });
}

export default async function decorate(block) {
  const user = await getUserDetails();
  if (!user) {
    return;
  }
  const { contactKey } = user;
  const unsaveModal = document.createElement('div');
  unsaveModal.innerHTML = `<div class="confirmation-modal">
    <div class="form-loader">
    <div class="form-loader-image exit"><div class="spinner"><div class="double-bounce1"></div> <div class="double-bounce2"></div></div></div>
       <div class="form-loader-content">
          <div class="message">Are you sure you want to unsave this property?</div>
          <div class="confirmation-modal-buttons">
             <section class="cta modal-cta mr-2"><a rel="noopener noreferrer" href="javascript:void(0)" tabindex="" class="btn button-primary unsave-btn" role="button"><span class="cta-btn-text">
                Unsave
                </span></a>
             </section>
             <section class="cta modal-cta cancel-button"><a rel="noopener noreferrer" href="javascript:void(0)" tabindex="" class="btn button-secondary" role="button"><span class="cta-btn-text">
                cancel
                </span></a>
             </section>
          </div>
       </div>
    </div>
 </div>
 <div class="confirmation-modal-overlay"></div>`;
  block.append(unsaveModal);

  const list = document.createElement('div');
  list.classList.add('property-list-cards', 'saved-properties');
  block.append(list);
  getSavedProperties(contactKey).then((results) => {
    renderCards(list, results.properties);
    registerEvents(block, contactKey);
  });
}
