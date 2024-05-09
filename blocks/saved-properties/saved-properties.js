import { renderSavedProperties as renderCards } from '../property-listing/cards/cards.js';
import { getUserDetails } from '../../scripts/apis/user.js';
import { removeSavedProperty } from '../../scripts/apis/creg/creg.js';
export default async function decorate(block) {
    const user = await getUserDetails();
    if (!user) {
        return;
    }
    const contactKey = user.contactKey;
    await renderCards(contactKey, block);
    const unsaveModal = document.createElement('div');
    unsaveModal.innerHTML = `<div class="cmp-confirmation-modal">
    <div class="cmp-form-loader">
       <div class="cmp-form-loader__content">
          <div class="message">Are you sure you want to unsave this property?</div>
          <div class="confirmation-modal-buttons">
             <section class="cmp-cta modal-cta mr-2"><a rel="noopener noreferrer" href="javascript:void(0)" tabindex="" class="btn btn-primary unsave-btn" role="button"><span class="cmp-cta__btn-text">
                Unsave
                </span></a>
             </section>
             <section class="cmp-cta modal-cta cancel-button"><a rel="noopener noreferrer" href="javascript:void(0)" tabindex="" class="btn btn-secondary" role="button"><span class="cmp-cta__btn-text">
                cancel
                </span></a>
             </section>
          </div>
       </div>
    </div>
 </div>
 <div class="cmp-confirmation-modal__overlay"></div>`;
    block.append(unsaveModal);

    const saveButtons = document.querySelectorAll('.saved-properties .button-property .icon-heartfilled');
    saveButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const listingTile = button.closest('.listing-tile');
            listingTile.classList.add('unsave');
            const confirmationModal = block.querySelector('.cmp-confirmation-modal');
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
        const confirmationModal = block.querySelector('.cmp-confirmation-modal');
        confirmationModal.classList.remove('open');
        const $body = document.querySelector('body');
        $body.classList.remove('modal-open');
    });

    // click even on unsave button
    const unsaveButton = block.querySelector('.unsave-btn');
    unsaveButton.addEventListener('click', (e) => {
        e.preventDefault();
        const listingToRemove = block.querySelector('.unsave');
        const listingLink = listingToRemove.querySelector('a');
        let propertyId = listingLink.getAttribute('href').split('/').pop();
        if(propertyId){
            propertyId = propertyId.split('pid-')[1].split('?')[0];
        }
        const confirmationModal = block.querySelector('.cmp-confirmation-modal');
        confirmationModal.classList.remove('open');
        const $body = document.querySelector('body');
        $body.classList.remove('modal-open');
        removeSavedProperty(contactKey, propertyId).then(() =>
            listingToRemove.remove()
        );
    });
}